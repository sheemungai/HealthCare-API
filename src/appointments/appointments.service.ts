import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async findAll() {
    const appointments = await this.appointmentRepository.find({
      relations: ['patient', 'doctor'],
    });
    return appointments;
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
      relations: ['patient', 'doctor'],
    });
    if (!appointment) {
      return 'appointment not found';
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
    });
    if (!appointment) {
      return 'appointment not found';
    }
    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  async remove(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
    });
    if (!appointment) {
      return 'appointment not found';
    }
    return this.appointmentRepository.delete(appointment);
  }
}
