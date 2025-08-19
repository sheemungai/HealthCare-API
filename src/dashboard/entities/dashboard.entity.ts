import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Doctor)
  doctor: Doctor[];
}
