import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, User, Appointment]),
    UsersModule, // Import UsersModule to access User entity`
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsModule, TypeOrmModule],
})
export class PatientsModule {}
