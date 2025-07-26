import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

export enum paymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  UNPAID = 'unpaid',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  appointment_time: string;

  @Column()
  status: string;

  @Column()
  reason: string;

  @Column({ type: 'enum', enum: paymentStatus, default: paymentStatus.UNPAID })
  payment_status: paymentStatus;

  @Column({ nullable: true })
  join_url: string;

  @Column({ nullable: true })
  start_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @OneToMany(() => Prescription, (prescription) => prescription.appointment)
  prescriptions: Prescription[];

  @OneToOne(() => Payment, (payment) => payment.appointment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  payment: Payment;
}
