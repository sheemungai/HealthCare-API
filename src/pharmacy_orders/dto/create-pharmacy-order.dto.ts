import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePharmacyOrderDto {
  @IsNumber()
  @IsNotEmpty()
  patient_id: number;

  @IsNumber()
  @IsNotEmpty()
  medicine_id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}
