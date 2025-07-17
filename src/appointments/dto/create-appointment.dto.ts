import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsString()
  appointment_time: string;

  // eg confirmed, pending , cancelled
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  start_url?: string;

  @IsString()
  @IsOptional()
  join_url?: string; // Optional field for Zoom meeting URL

  @IsNotEmpty()
  @IsString()
  reason: string;
}
