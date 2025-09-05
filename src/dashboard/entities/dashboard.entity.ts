import {
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Record } from 'src/records/entities/record.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('dashboards')
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Doctor)
  @JoinTable({
    name: 'dashboard_doctors',
    joinColumn: { name: 'dashboard_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'doctor_id', referencedColumnName: 'doctor_id' },
  })
  doctors: Doctor[];

  @ManyToMany(() => Appointment)
  @JoinTable({
    name: 'dashboard_appointments',
    joinColumn: { name: 'dashboard_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'appointment_id',
      referencedColumnName: 'appointment_id',
    },
  })
  appointments: Appointment[];

  @ManyToMany(() => Record)
  @JoinTable({
    name: 'dashboard_records',
    joinColumn: { name: 'dashboard_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'record_id', referencedColumnName: 'record_id' },
  })
  records: Record[];

  @ManyToMany(() => PharmacyOrder)
  @JoinTable({
    name: 'dashboard_pharmacy_orders',
    joinColumn: { name: 'dashboard_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'pharcy_order_id',
      referencedColumnName: 'pharmacy_order_id',
    },
  })
  pharmacyOrders: PharmacyOrder[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'dashboard_users',
    joinColumn: { name: 'dashboard_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
  })
  users: User[];
}
