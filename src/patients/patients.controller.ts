import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/users/enums/user-role.enum';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles(Role.admin, Role.doctor, Role.pharmacist)
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Roles(Role.admin, Role.doctor, Role.pharmacist, Role.patient)
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }
  @Get('prescriptions/:id')
  findPrescriptions(@Param('id') id: string) {
    return this.patientsService.findPrescriptions(+id);
  }

  @Get('doctors')
  findDoctors() {
    return this.patientsService.findDoctors();
  }

  @Get('appointments/:id')
  findAppointments(@Param('id') id: string) {
    return this.patientsService.findAppointments(+id);
  }

  @Get('pharmacy_orders/:id')
  findPharmacyOrders(@Param('id') id: string) {
    return this.patientsService.findPharmacyOrders(+id);
  }

  @Get('medicines')
  findMedicines() {
    return this.patientsService.findMedicines();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Roles(Role.admin, Role.doctor, Role.pharmacist)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Roles(Role.admin, Role.doctor, Role.pharmacist)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
