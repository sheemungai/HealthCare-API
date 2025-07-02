import { Module } from '@nestjs/common';
import { PharmacyOrdersService } from './pharmacy-orders.service';
import { PharmacyOrdersController } from './pharmacy-orders.controller';

@Module({
  controllers: [PharmacyOrdersController],
  providers: [PharmacyOrdersService],
})
export class PharmacyOrdersModule {}
