import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Dashboard } from './entities/dashboard.entity';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { RecordsModule } from 'src/records/records.module';
import { PatientsModule } from 'src/patients/patients.module';
import { UsersModule } from 'src/users/users.module';
import { PharmacyOrdersModule } from 'src/pharmacy_orders/pharmacy-orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dashboard]),
    DoctorsModule,
    AppointmentsModule,
    RecordsModule,
    PatientsModule,
    UsersModule,
    PharmacyOrdersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
