import { Doctor } from 'src/doctors/entities/doctor.entity';

export class CreateDashboardDto {
  id: number;
  doctors: Doctor[];
}
