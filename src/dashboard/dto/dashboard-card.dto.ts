export interface DashboardCardDto {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  stats?: Record<string, any>;
  actions?: string[];
  type: 'doctor' | 'appointment' | 'record' | 'pharmacy-order' | 'user';
  entity?: any;
}
 