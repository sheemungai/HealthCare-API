import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  appointment_id: number;

  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

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
  status?: string = 'pending';
}
