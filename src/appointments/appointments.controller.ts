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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/users/enums/user-role.enum';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(AtGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Public()
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    console.log('Creating appointment with data:', createAppointmentDto);
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Roles(Role.doctor, Role.admin, Role.patient)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Roles(Role.doctor, Role.admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Roles(Role.doctor, Role.admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appointmentsService.delete(+id);
  }
}
