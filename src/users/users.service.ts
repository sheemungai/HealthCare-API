import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Role } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  //hashed password
  private async hashData(data: string): Promise<string> {
    const salts = await Bcrypt.genSalt(10);
    return Bcrypt.hash(data, salts);
  }
  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: ['user_id'],
    });
    if (existingUser) {
      throw new Error(`User with email ${createUserDto.email} already exist`);
    }

    const newUser: Partial<User> = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: await this.hashData(createUserDto.password),
      phone: createUserDto.phone,
      role: createUserDto.role,
    };
    if (createUserDto.role) {
      newUser.role = createUserDto.role;
    }

    const savedUser = await this.userRepository.save(newUser);

    // Create role-specific profile
    switch (createUserDto.role) {
      case Role.patient:
        await this.createPatientProfile(savedUser, createUserDto);
        break;
      case Role.doctor:
        await this.createDoctorProfile(savedUser, createUserDto);
        break;
      default:
        // For admin or other roles, just create the user
        break;
    }

    return plainToInstance(User, savedUser);
  }

  private async createPatientProfile(
    user: User,
    createUserDto: CreateUserDto,
  ): Promise<Patient> {
    const patientData = {
      name: user.name,
      email: user.email,
      password: user.password,
      dob: createUserDto.dob,
      gender: createUserDto.gender,
      phone: user.phone,
      address: createUserDto.address,
      user: user,
    };

    const patient = this.patientRepository.create(patientData);
    return this.patientRepository.save(patient);
  }

  private async createDoctorProfile(
    user: User,
    createUserDto: CreateUserDto,
  ): Promise<Doctor> {
    const doctorData = {
      name: user.name,
      email: user.email,
      password: user.password,
      specialization: createUserDto.specialization,
      license_number: createUserDto.license_number,
      availability: createUserDto.availability || 'Available',
      consultation_fee: createUserDto.consultation_fee || 0,
      user: user,
    };

    const doctor = this.doctorRepository.create(doctorData);
    return this.doctorRepository.save(doctor);
  }

  async findAll(email?: string) {
    let users: User[];
    if (email) {
      users = await this.userRepository.find({
        where: { email },
        select: ['user_id', 'name', 'email', 'role'],
      });
    } else {
      users = await this.userRepository.find({
        select: ['user_id', 'name', 'email', 'role'],
      });
    }
    return users.map((user) => plainToInstance(User, user));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      select: ['user_id', 'name', 'email', 'role'],
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return plainToInstance(User, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ user_id: id });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    // Update base user
    await this.userRepository.update(id, updateUserDto);

    // Update role-specific profile if needed
    if (user.role === Role.patient) {
      await this.patientRepository.update(
        { user: { user_id: id } },
        {
          name: updateUserDto.name,
          phone: updateUserDto.phone,
          dob: updateUserDto.dob,
          gender: updateUserDto.gender,
          address: updateUserDto.address,
        },
      );
    } else if (user.role === Role.doctor) {
      await this.doctorRepository.update(
        { user: { user_id: id } },
        {
          name: updateUserDto.name,
          specialization: updateUserDto.specialization,
          license_number: updateUserDto.license_number,
          availability: updateUserDto.availability,
          consultation_fee: updateUserDto.consultation_fee,
        },
      );
    }

    return this.findOne(id);
  }
  async delete(id: number) {
    return await this.userRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `User with id ${id} not found`;
        }
      })
      .catch((error) => {
        console.error(`Error removing user: `, error);
        throw new Error(`Failed to remove user with id ${id}`);
      });
  }
}
