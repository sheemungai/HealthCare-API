import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { Record } from 'src/records/entities/record.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  dob: Date;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn()
  user: User;

  @OneToMany(() => Prescription, (prescription) => prescription.patient)
  @JoinColumn()
  prescriptions: Prescription[];

  @OneToMany(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.patient)
  pharmacyOrders: PharmacyOrder[];

  @OneToMany(() => Record, (record) => record.patient)
  records: Record[];
}
