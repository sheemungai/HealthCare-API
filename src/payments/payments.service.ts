import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, paymentStatus } from './entities/payment.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async initializePayment(createPaymentDto: CreatePaymentDto) {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: { doctor_id: createPaymentDto.doctor_id },
      });
      if (!doctor) {
        throw new NotFoundException(
          `Doctor with ID ${createPaymentDto.doctor_id} not found`,
        );
      }

      const payload = {
        email: createPaymentDto.email,
        amount: doctor.consultation_fee * 100, // Paystack expects amount in kobo
        callback_url: createPaymentDto.callback_url,
      };

      interface PaystackResponse {
        status: boolean;
        data: {
          reference: string;
          authorization_url: string;
        };
        message?: string;
      }

      const response = await axios.post<PaystackResponse>(
        'https://api.paystack.co/transaction/initialize',
        payload,
        {
          headers: {
            Authorization: `Bearer sk_test_d3b4382f60bbc3fbd49bd75eb956378dace11302`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data.status) {
        throw new BadRequestException(
          'Failed to initialize payment with Paystack',
        );
      }

      const existingPayment = await this.paymentRepository.findOne({
        where: { transaction_id: response.data.data.reference },
      });

      if (existingPayment) {
        return new BadRequestException(
          'Payment with this transaction ID already exists',
        );
      }

      const appointment = await this.appointmentRepository.findOne({
        where: { appointment_id: createPaymentDto.appointment_id },
      });
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }

      const payment = this.paymentRepository.create({
        patient_id: createPaymentDto.patient_id,
        status: paymentStatus.PENDING,
        amount: Number(doctor.consultation_fee) / 100,
        transaction_id: response.data.data.reference,
      });

      payment.payment_method = 'mpesa';
      payment.appointment_id = appointment.appointment_id;

      await this.paymentRepository.save(payment);

      return {
        authorization_url: response.data.data.authorization_url,
        payment_reference: response.data.data.reference,
        payment_id: payment.payment_id,
      };
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  }

  //payment verification

  async verifyPayment(appointment_id: number) {
    try {
      interface PaystackVerifyResponse {
        status: boolean;
        data: {
          status: string;
          amount: number;
          [key: string]: any;
        };
        message?: string;
      }
      const appointmentPayment = await this.appointmentRepository.findOne({
        where: { appointment_id },
        relations: { payment: true },
      });
      if (!appointmentPayment) {
        throw new NotFoundException('Appointment not found');
      }
      if (!appointmentPayment.payment) {
        throw new NotFoundException(
          'Payment record not found for this appointment',
        );
      }
      const response = await axios.get<PaystackVerifyResponse>(
        `https://api.paystack.co/transaction/verify/${appointmentPayment.payment.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer sk_test_d3b4382f60bbc3fbd49bd75eb956378dace11302`,
          },
        },
      );

      const data = response.data?.data;
      if (!response.data.status || !data) {
        throw new BadRequestException('Failed to verify payment');
      }

      const payment = await this.paymentRepository.findOne({
        where: { transaction_id: appointmentPayment.payment.transaction_id },
      });

      if (!payment) {
        throw new NotFoundException('Payment record not found');
      }

      const appointment = await this.appointmentRepository.findOne({
        where: { appointment_id: payment.appointment_id },
        relations: ['patient'],
      });

      if (!appointment) {
        throw new NotFoundException('Appointment record not found');
      }

      appointment.payment_status = paymentStatus.COMPLETED;
      // Already completed? No need to reprocess
      if (payment.status === paymentStatus.COMPLETED) {
        return { message: 'Payment already verified and completed' };
      }

      await this.appointmentRepository.save(appointment);
      // Payment failed
      if (data.status !== 'success') {
        payment.status = paymentStatus.FAILED;
        await this.paymentRepository.save(payment);
        return { message: 'Payment failed', payment };
      }

      // Payment success
      const paidAmount = data.amount;

      payment.amount = paidAmount; // Convert kobo to naira
      payment.status = paymentStatus.COMPLETED;
      payment.created_at = new Date();
      await this.paymentRepository.save(payment);

      return {
        message: 'Payment verified and updated',
        payment,
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  async findAll() {
    const payments = await this.paymentRepository.find();
    return payments;
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { payment_id: id },
      relations: ['appointment', 'pharmacyOrder'],
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
      return 'Payment not found';
    }
    this.paymentRepository.merge(payment, updatePaymentDto);

    return await this.paymentRepository.save(payment);
  }

  async remove(id: number) {
    return this.paymentRepository.delete(id);
  }
}
