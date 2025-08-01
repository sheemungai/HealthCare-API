import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      Appointment,
      Medicine,
      Doctor,
      PharmacyOrder,
      Prescription, // Ensure Prescription is imported if used in PatientsService
    ]),
    UsersModule, // Import UsersModule to access User entity
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsModule, TypeOrmModule],
})
export class PatientsModule {}
