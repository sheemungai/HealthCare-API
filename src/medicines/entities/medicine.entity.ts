import { Patient } from 'src/patients/entities/patient.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn()
  medicine_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  stock_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  img: string;

  @Column()
  expiry_date: string;

  @ManyToOne(() => Patient, (patient) => patient.medicines)
  patient: Patient;

  @ManyToMany(() => Prescription, (prescription) => prescription.medicines)
  @JoinTable()
  prescriptions: Prescription[];

  @ManyToMany(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.medicines)
  pharmacyOrders: PharmacyOrder[];
}
