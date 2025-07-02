import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User, Appointment])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsModule, TypeOrmModule],
})
export class DoctorsModule {}
