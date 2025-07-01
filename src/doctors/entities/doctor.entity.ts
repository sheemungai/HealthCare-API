import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

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

  @OneToMany(() => Appointment, (appointment) => appointment.doctor_id)
  appointments: Appointment[];
}
