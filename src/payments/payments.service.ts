import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    // 1. Find the related appointment with doctor info
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: createPaymentDto.appointment_id },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // 2. Create payment record
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      amount: createPaymentDto.amount || appointment.doctor.consultation_fee,
      status: 'pending', // Initial status
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // 3. Update appointment payment status
    await this.appointmentRepository.update(
      { appointment_id: createPaymentDto.appointment_id },
      { payment_status: 'pending' },
    );

    return savedPayment;
  }

  async confirmPayment(paymentId: number) {
    // 1. Find the payment
    const payment = await this.paymentRepository.findOne({
      where: { payment_id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // 2. Update payment status
    await this.paymentRepository.update(
      { payment_id: paymentId },
      { status: 'completed' },
    );

    // 3. Update appointment payment status
    await this.appointmentRepository.update(
      { appointment_id: payment.appointment_id },
      { payment_status: 'paid' },
    );

    return this.paymentRepository.findOne({
      where: { payment_id: paymentId },
    });
  }

  async findAll() {
    const payments = await this.paymentRepository.find();
    return payments;
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { payment_id: id },
    });
    if (!payment) {
      return 'payment not found';
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { payment_id: id },
    });
    if (!payment) {
      return 'Prescription not found';
    }
    this.paymentRepository.merge(payment, updatePaymentDto);

    return await this.paymentRepository.save(payment);
  }

  async remove(id: number) {
    return this.paymentRepository.delete(id);
  }
}
