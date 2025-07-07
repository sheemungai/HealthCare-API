import { Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    const prescription = this.prescriptionRepository.create(
      createPrescriptionDto,
    );
    return await this.prescriptionRepository.save(prescription);
  }

  async findAll() {
    const prescriptions = await this.prescriptionRepository.find();
    return prescriptions;
  }

  async findOne(id: number) {
    const prescription = await this.prescriptionRepository.findOne({
      where: { prescription_id: id },
    });
    if (!prescription) {
      return 'Prescription not found';
    }
    return prescription;
  }

  async update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    const prescription = await this.prescriptionRepository.findOne({
      where: { prescription_id: id },
    });
    if (!prescription) {
      return 'Prescription not found';
    }
    this.prescriptionRepository.merge(prescription, updatePrescriptionDto);
    return await this.prescriptionRepository.save(prescription);
  }

  async remove(id: number) {
    return this.prescriptionRepository.delete(id);
  }
}
