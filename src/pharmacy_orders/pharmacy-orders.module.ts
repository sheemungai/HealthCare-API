import { Module } from '@nestjs/common';
import { PharmacyOrdersService } from './pharmacy-orders.service';
import { PharmacyOrdersController } from './pharmacy_orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyOrder } from './entities/pharmacy-order.entity';
import { UsersModule } from 'src/users/users.module';
import { Medicine } from 'src/medicines/entities/medicine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyOrder, Medicine]), UsersModule],
  controllers: [PharmacyOrdersController],
  providers: [PharmacyOrdersService],
})
export class PharmacyOrdersModule {}
