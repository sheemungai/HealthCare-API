import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

@Entity('pharmacy_orders')
export class PharmacyOrder {
  @PrimaryGeneratedColumn()
  pharmacy_order_id: number;

  @Column()
  patient_id: number;

  @Column()
  medicine_id: number;

  @Column()
  quantity: number;

  @Column()
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.pharmacyOrders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @OneToOne(() => Payment, (payment) => payment.pharmacyOrder)
  @JoinColumn()
  payment: Payment;

  @ManyToMany(() => Medicine, (medicine) => medicine.pharmacyOrders)
  @JoinTable()
  medicines: Medicine[];
}
