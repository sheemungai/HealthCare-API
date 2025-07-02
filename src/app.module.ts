import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicinesModule } from './medicines/medicines.module';
import { RecordsModule } from './records/records.module';
import { PatientsModule } from './patients/patients.module';
import { PharmacyOrdersModule } from './pharmacy_orders/pharmacy-orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DoctorsModule } from './doctors/doctors.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    DoctorsModule,
    DatabaseModule,
    AppointmentsModule,
    PaymentsModule,
    PharmacyOrdersModule,
    PatientsModule,
    RecordsModule,
    MedicinesModule,
    PrescriptionsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(
      'users', // Specific route example
      'doctors',
      'appointments',
      'payments',
      'pharmacy-orders',
      'patients',
      'records',
      'medicines',
      'prescriptions',
    );
  }
}
