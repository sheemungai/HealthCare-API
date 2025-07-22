import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { ZoomService } from 'src/zoom/zoom.service';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Payment, paymentStatus } from 'src/payments/entities/payment.entity';
// import dayjs from 'dayjs';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private zoomService: ZoomService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const [patient, doctor] = await Promise.all([
      this.patientRepository.findOne({
        where: { user: { user_id: createAppointmentDto.patient_id } },
      }),
      this.doctorRepository.findOne({
        where: { user: { user_id: createAppointmentDto.doctor_id } },
      }),
    ]);

    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createAppointmentDto.patient_id} not found`,
      );
    }

    if (!doctor) {
      throw new NotFoundException(
        `Doctor with ID ${createAppointmentDto.doctor_id} not found`,
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
      doctor,
      payment_status: 'unpaid',
      join_url: zoomMeeting.join_url, // Store the Zoom meeting URL
      start_url: zoomMeeting.start_url, // Store the Zoom start URL
    });
    console.log('Appointment data:', appointment);
    const savedAppointment = await this.appointmentRepository.save(appointment);

    const payment = this.paymentRepository.create({
      patient_id: createAppointmentDto.patient_id,
      payment_method: 'Mpesa',
      appointment: savedAppointment,
      status: paymentStatus.PENDING,
      amount: doctor.consultation_fee, // Assuming consultation fee is the amount
    });

    await this.paymentRepository.save(payment);

    return savedAppointment;
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

  async getAppointmentsWithPaymentStatus(
    patientId?: number,
    doctorId?: number,
  ) {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.payment', 'payment')
      .select([
        'appointment',
        'patient.user_id',
        'patient.user.name',
        'doctor.doctor_id',
        'doctor.name',
        'doctor.consultation_fee',
        'payment.payment_id',
        'payment.status',
        'payment.amount',
        'payment.payment_method',
      ]);

    if (patientId) {
      query.where('appointment.patient_id = :patientId', { patientId });
    }
    if (doctorId) {
      query.where('appointment.doctor_id = :doctorId', { doctorId });
    }

    return query.getMany();
  }
}
