import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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
      phone: createUserDto.phone,
    };
    if (createUserDto.role) {
      newUser.role = createUserDto.role;
    }

    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(User, savedUser);
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
    return await this.userRepository
      .update(id, updateUserDto)
      .then((result) => {
        if (result.affected === 0) {
          return `User with id ${id} not found`;
        }
      })
      .catch((error) => {
        console.error(`Error updating user: `, error);
        throw new Error(`Failed to update user with id ${id}`);
      });
  }

  async remove(id: number) {
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
