import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PharmacyOrdersService } from './pharmacy-orders.service';
import { CreatePharmacyOrderDto } from './dto/create-pharmacy-order.dto';
import { UpdatePharmacyOrderDto } from './dto/update-pharmacy-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/users/enums/user-role.enum';

@ApiTags('pharmacy-orders')
@ApiBearerAuth()
@UseGuards(AtGuard, RolesGuard)
@Controller('pharmacy-orders')
export class PharmacyOrdersController {
  constructor(private readonly pharmacyOrdersService: PharmacyOrdersService) {}

  @Public()
  @Post()
  @Roles(Role.doctor, Role.admin, Role.pharmacist, Role.patient)
  create(@Body() createPharmacyOrderDto: CreatePharmacyOrderDto) {
    return this.pharmacyOrdersService.create(createPharmacyOrderDto);
  }

  @Roles(Role.doctor, Role.admin, Role.pharmacist, Role.patient)
  @Get()
  findAll() {
    return this.pharmacyOrdersService.findAll();
  }

  @Roles(Role.doctor, Role.admin, Role.pharmacist, Role.patient)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyOrdersService.findOne(+id);
  }

  @Roles(Role.doctor, Role.admin, Role.pharmacist)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePharmacyOrderDto: UpdatePharmacyOrderDto,
  ) {
    return this.pharmacyOrdersService.update(+id, updatePharmacyOrderDto);
  }

  @Roles(Role.doctor, Role.admin, Role.pharmacist)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyOrdersService.remove(+id);
  }
}
