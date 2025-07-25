import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  stock_quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsNotEmpty()
  @IsString()
  expiry_date: string;
}
