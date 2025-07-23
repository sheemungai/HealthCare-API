import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { paymentStatus } from 'src/appointments/entities/appointment.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  appointment_id: number;

  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  callback_url?: string;

  @IsOptional()
  @IsNumber()
  pharmacy_order_id?: number;

  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsNotEmpty()
  @IsString()
  status?: paymentStatus = paymentStatus.PENDING;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  transaction_id?: string;
}
