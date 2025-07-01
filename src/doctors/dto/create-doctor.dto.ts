import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  license_number: string;

  @IsString()
  @IsNotEmpty()
  availability: string;

  @IsNumber()
  @IsNotEmpty()
  consultation_fee: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
