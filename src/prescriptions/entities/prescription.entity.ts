import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Record } from 'src/records/entities/record.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  prescription_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  appointment_id: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.prescriptions)
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.prescriptions)
  @JoinColumn()
  doctor: Doctor;

  @OneToOne(() => Appointment, (appointment) => appointment.prescription)
  @JoinColumn()
  appointment: Appointment;

  @ManyToMany(() => Medicine, (medicine) => medicine.prescriptions)
  @JoinTable()
  medicines: Medicine[];

  @OneToMany(() => Record, (record) => record.prescription)
  records: Record[];
}
