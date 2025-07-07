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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/users/enums/user-role.enum';
import { AtGuard, RolesGuard } from 'src/auth/guards';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(AtGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.admin, Role.doctor, Role.patient, Role.pharmacist)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Roles(Role.admin, Role.doctor, Role.patient, Role.pharmacist)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Roles(Role.admin, Role.doctor, Role.pharmacist)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Roles(Role.admin, Role.doctor, Role.pharmacist)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Roles(Role.admin, Role.doctor, Role.pharmacist)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
