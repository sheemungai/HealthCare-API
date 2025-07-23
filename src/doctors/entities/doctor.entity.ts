import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { Record } from 'src/records/entities/record.entity';
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
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  specialization: string;

  @Column()
  license_number: string;

  @Column({ nullable: true })
  img: string;

  @Column()
  availability: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultation_fee: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToOne(() => User, (user) => user.doctor, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  @JoinColumn()
  prescriptions: Prescription[];

  @OneToMany(() => Record, (record) => record.doctor)
  records: Record[];
}
