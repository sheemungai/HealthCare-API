import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const patient = await this.patientRepository.findOne({
      where: { user: { user_id: createAppointmentDto.patient_id } },
    });
    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createAppointmentDto.patient_id} not found`,
      );
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      patient,
    });

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
    console.log('appointment  data', appointment);
    // If appointment is not found, return a message
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

  async delete(id: number) {
    return this.appointmentRepository.delete(id);
  }
}
