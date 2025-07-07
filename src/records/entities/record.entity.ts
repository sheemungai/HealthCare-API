import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  prescription_id: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.records)
  patient: Patient[];

  @ManyToOne(() => Doctor, (doctor) => doctor.records)
  doctor: Doctor;

  @ManyToOne(() => Prescription, (prescription) => prescription.records)
  prescription: Prescription;
}
