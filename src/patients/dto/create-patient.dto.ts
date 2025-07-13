import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsNumber,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsISO8601()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number; // This should be set by the service, not the DTO
}
