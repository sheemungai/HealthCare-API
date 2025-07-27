import {
  Appointment,
  // paymentStatus,
} from 'src/appointments/entities/appointment.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum paymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  UNPAID = 'unpaid',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ nullable: true })
  appointment_id: number;

  @Column({ nullable: true })
  pharmacy_order_id: number;

  @Column()
  patient_id: number;

  @Column()
  payment_method: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: paymentStatus, default: paymentStatus.UNPAID })
  status: paymentStatus;

  @Column({ nullable: true })
  transaction_id: string;

  @OneToOne(() => Appointment, (appointment) => appointment.payment)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToOne(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.payment)
  pharmacyOrder: PharmacyOrder;
}
