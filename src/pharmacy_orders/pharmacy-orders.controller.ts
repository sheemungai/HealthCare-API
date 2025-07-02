import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PharmacyOrdersService } from './pharmacy-orders.service';
import { CreatePharmacyOrderDto } from './dto/create-pharmacy-order.dto';
import { UpdatePharmacyOrderDto } from './dto/update-pharmacy-order.dto';

@Controller('pharmacy-orders')
export class PharmacyOrdersController {
  constructor(private readonly pharmacyOrdersService: PharmacyOrdersService) {}

  @Post()
  create(@Body() createPharmacyOrderDto: CreatePharmacyOrderDto) {
    return this.pharmacyOrdersService.create(createPharmacyOrderDto);
  }

  @Get()
  findAll() {
    return this.pharmacyOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePharmacyOrderDto: UpdatePharmacyOrderDto,
  ) {
    return this.pharmacyOrdersService.update(+id, updatePharmacyOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyOrdersService.remove(+id);
  }
}
