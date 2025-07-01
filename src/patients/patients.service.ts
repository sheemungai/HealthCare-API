import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
  ) {}
  async create(createPatientDto: CreatePatientDto) {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  async findAll() {
    const patients = await this.patientRepository.find();
    return patients;
  }

  async findOne(id: number) {
    const patient = await this.patientRepository.findOne({
      where: { patient_id: id },
    });
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOne({
      where: { patient_id: id },
    });
    if (!patient) {
      return 'Patient not found';
    }
    return this.patientRepository.update(id, updatePatientDto);
  }

  async remove(id: number) {
    const patient = await this.patientRepository.findOne({
      where: { patient_id: id },
    });
    if (!patient) {
      return 'Patient not found';
    }
    return this.patientRepository.delete(id);
  }
}
