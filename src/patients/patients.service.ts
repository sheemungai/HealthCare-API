import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/enums/user-role.enum';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor) private doctorsRepository: Repository<Doctor>,
    private readonly userService: UsersService, // Assuming you have a UserService to handle user-related operations
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const user = await this.userService.findOne(createPatientDto.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== Role.patient) {
      throw new Error('User is not a patient');
    }
    const patient = this.patientRepository.create({
      ...createPatientDto,
      user, // Assuming user_id is the foreign key in Patient entity
    });
    return this.patientRepository.save(patient);
  }

  async findAll() {
    return this.patientRepository.find({
      relations: {
        user: true,
        prescriptions: true,
        pharmacyOrders: true,
        appointments: true,
        records: true,
      },
    });
  }

  async findDoctors() {
    return this.doctorsRepository.find({});
  }

  async findOne(id: number) {
    return this.patientRepository.findOne({
      where: { patient_id: id },
      relations: ['user'],
    });
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
    return this.patientRepository.delete(id);
  }
}
