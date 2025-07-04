import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './http-exception.filters';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    //helmet configuration
    app.use(helmet());

    //cors
    app.enableCors({
      origin: '*',
      methods: 'GET, HEAD,PUT, PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
      credentials: true,
    });

    //global prefix for API routes
    app.setGlobalPrefix('api/v1');

    const configService = app.get(ConfigService);
    const PORT = configService.getOrThrow<number>('PORT');

    const config = new DocumentBuilder()
      .setTitle('HeathCare API')
      .setDescription('')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('heathcare')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'users management endpoints')
      .addTag('patients', 'Patients management endpoints')
      .addTag('appointments', 'Appointments management endpoints')
      .addTag('doctors', 'Doctor management endpoints')
      .addTag('medicines', 'Medicine processing endpoints')
      .addTag('payments', 'Payments management endpoints')
      .addTag('pharmacy-orders', 'Pharmacy orders management endpoints')
      .addTag('prescriptions', 'Prescription management endpoints')
      .addTag('records', 'Records management endpoints')
      .addServer('http://localhost:3000/', 'Local development server')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: '/api-json',
      swaggerOptions: {
        persistAuthorization: true,
        tagSorter: 'alpha',
        operationsSorter: 'alpha',
        docExpansion: 'none',
        filter: true,
      },
      customCss: `
      swagger-ui .topbar { display: none; }`,
      customSiteTitle: 'HealthCare API Documentation',
    });

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.listen(PORT);
    console.log(`Server is running on  http://localhost:${PORT}`);
    console.log(`Swagger is available at http://localhost:${PORT}/api/docs`);
  } catch (error) {
    console.error('Error during the application: ', error);
  }
}
bootstrap();
