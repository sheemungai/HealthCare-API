import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
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

  @Column()
  price: number;

  @Column()
  expiry_date: Date;

  @ManyToMany(() => Prescription, (prescription) => prescription.medicines)
  @JoinTable()
  prescriptions: Prescription[];

  @ManyToMany(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.medicines)
  pharmacyOrders: PharmacyOrder[];
}
