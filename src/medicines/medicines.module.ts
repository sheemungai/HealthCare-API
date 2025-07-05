import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Medicine } from './entities/medicine.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine, Prescription]), UsersModule],
  controllers: [MedicinesController],
  providers: [MedicinesService],
})
export class MedicinesModule {}
