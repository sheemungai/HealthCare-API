import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column()
  appointment_id: number;

  @Column()
  patient_id: number;

  @Column()
  payment_method: string;

  @Column()
  pharmacy_order_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  amount: number;

  @Column()
  status: string;

  @OneToOne(() => Appointment, (appointment) => appointment.payment)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToOne(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.payment)
  @JoinColumn({ name: 'pharmacy_order_id' })
  pharmacyOrder: PharmacyOrder;
}
