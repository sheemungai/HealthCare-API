import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  specialization: string;

  @Column()
  license_number: string;

  @Column()
  availability: string;

  @Column()
  consultation_fee: number;

  @Column()
  user_id: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor_id)
  appointments: Appointment[];

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn()
  user: User;
}
