import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/enums/user-role.enum';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    private readonly UserService: UsersService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const user = await this.UserService.findOne(createDoctorDto.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== Role.doctor) {
      throw new Error('User is not a doctor');
    }
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      user, // Assuming user_id is the foreign key in Doctor entity
    });
    return this.doctorRepository.save(doctor);
  }

  async findAll() {
    const doctors = await this.doctorRepository.find({
      relations: ['user', 'appointments'],
    });
    return doctors;
  }

  async findOne(id: number) {
    return this.doctorRepository.findOne({
      where: { doctor_id: id },
      relations: ['user', 'appointments'],
    });
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
    return this.doctorRepository.delete(id);
  }
}
