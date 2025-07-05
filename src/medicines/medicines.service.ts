import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  create(createMedicineDto: CreateMedicineDto) {
    const medicine = this.medicineRepository.create(createMedicineDto);
    return this.medicineRepository.save(medicine);
  }

  findAll() {
    return this.medicineRepository.find();
  }

  findOne(id: number) {
    return this.medicineRepository.findOne({ where: { medicine_id: id } });
  }

  update(id: number, updateMedicineDto: UpdateMedicineDto) {
    return this.medicineRepository.update(id, updateMedicineDto);
  }

  remove(id: number) {
    return this.medicineRepository.delete(id);
  }
}
