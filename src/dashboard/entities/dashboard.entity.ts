import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Record } from 'src/records/entities/record.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Doctor)
  doctor: Doctor[];

  @ManyToMany(() => Appointment)
  appointment: Appointment[];

  @ManyToMany(() => Record)
  record: Record[];

  @ManyToMany(() => PharmacyOrder)
  pharmacyOrder: PharmacyOrder[];

  @ManyToMany(() => User)
  user: User[];
}
