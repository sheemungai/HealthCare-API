import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsNumber()
  @IsNotEmpty()
  patient_id: number;

  @IsNumber()
  @IsNotEmpty()
  doctor_id: number;

  @IsNumber()
  @IsNotEmpty()
  prescription_id: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
