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
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/users/enums/user-role.enum';

@UseGuards(AtGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Public()
  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Roles(Role.admin, Role.doctor, Role.patient)
  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  // @Roles(Role.admin, Role.doctor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(+id);
  }

  @Roles(Role.admin, Role.doctor, Role.patient)
  @Get(':id/patients')
  findPatients(@Param('id') id: string) {
    return this.prescriptionsService.findPatients(+id);
  }

  @Roles(Role.admin, Role.doctor)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @Roles(Role.admin, Role.doctor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.delete(+id);
  }
}
