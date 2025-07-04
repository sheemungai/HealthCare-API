import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsNumber()
  appointment_id: number;

  @IsNotEmpty()
  @IsDate()
  created_by: Date; // The user who created the prescription, typically a doctor

  @IsString()
  notes?: string; // Optional field for additional notes
}
