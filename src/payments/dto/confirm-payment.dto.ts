import { IsNotEmpty, IsNumber } from 'class-validator';
export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  payment_id: number;
}
