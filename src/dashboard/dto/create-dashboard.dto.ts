import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';

export class CreateDashboardDto {
  id: number;
  doctors: Doctor[];
  appointments: Appointment[];
  records: Record[];
  pharmacyOrders: PharmacyOrder[];
  users: User[];
}
