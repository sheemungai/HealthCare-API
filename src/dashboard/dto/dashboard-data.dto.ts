import { DashboardCardDto } from './dashboard-card.dto';

export interface DashboardDataDto {
  id: number;
  title: string;
  description?: string;
  cards: DashboardCardDto[];
  totalDoctors: number;
  totalAppointments: number;
  totalRecords: number;
  totalPharmacyOrders?: number;
  totalUsers?: number;
  createdAt: Date;
  updatedAt: Date;
}
