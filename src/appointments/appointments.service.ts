import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { ZoomService } from 'src/zoom/zoom.service';
// import dayjs from 'dayjs';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private zoomService: ZoomService,
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

    // Create Zoom meeting
    const meetingTopic = `Medical Appointment - ${patient.user?.name || 'Patient'} - ${createAppointmentDto.reason}`;

    const zoomMeeting = await this.zoomService.createMeeting(
      meetingTopic,
      createAppointmentDto.appointment_time,
      60, // Default 60 minutes duration
    );

    console.log('zoomMeeting:', zoomMeeting);
    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      patient,
      join_url: zoomMeeting.join_url, // Store the Zoom meeting URL
      start_url: zoomMeeting.start_url, // Store the Zoom start URL
    });
    console.log('Appointment data:', appointment);

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
