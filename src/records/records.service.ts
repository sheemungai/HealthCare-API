import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto) {
    const record = this.recordsRepository.create(createRecordDto);
    return this.recordsRepository.save(record);
  }

  async findAll() {
    const records = await this.recordsRepository.find();
    return records;
  }

  async findOne(id: number) {
    const record = await this.recordsRepository.findOne({
      where: { record_id: id },
      relations: ['patient', 'doctor', 'prescription'],
    });
    if (!record) {
      return 'Record not found';
    }
    return record;
  }

  async update(id: number, updateRecordDto: UpdateRecordDto) {
    const record = await this.recordsRepository.findOne({
      where: { record_id: id },
    });
    if (!record) {
      return 'Record not found';
    }
    this.recordsRepository.merge(record, updateRecordDto);
    return this.recordsRepository.save(record);
  }

  async remove(id: number) {
    return this.recordsRepository.delete(id);
  }
}
