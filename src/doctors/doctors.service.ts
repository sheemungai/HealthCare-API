import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
  ) {}
  async create(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async findAll() {
    const doctors = await this.doctorRepository.find();
    return doctors;
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: id },
    });
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: id },
    });
    if (!doctor) {
      return 'doctor not found';
    }
    return this.doctorRepository.update(id, updateDoctorDto);
  }

  async remove(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: id },
    });
    if (!doctor) {
      return 'doctor not found';
    }
    return this.doctorRepository.delete(id);
  }
}
