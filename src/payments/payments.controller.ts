import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/users/enums/user-role.enum';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(AtGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('init')
  @ApiOperation({ summary: 'Initialize payment (MPESA via Paystack)' })
  @ApiResponse({ status: 201, description: 'Payment initialized' })
  async initializePayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.initializePayment(createPaymentDto);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle Paystack/M-PESA callback (after payment)' })
  async handlePaymentCallback(@Query('reference') reference: string) {
    if (!reference) {
      throw new BadRequestException('Missing payment reference in callback');
    }
    return this.paymentsService.verifyPayment(reference);
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
