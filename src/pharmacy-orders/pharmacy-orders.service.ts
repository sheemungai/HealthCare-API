import { Injectable } from '@nestjs/common';
import { CreatePharmacyOrderDto } from './dto/create-pharmacy-order.dto';
import { UpdatePharmacyOrderDto } from './dto/update-pharmacy-order.dto';

@Injectable()
export class PharmacyOrdersService {
  create(createPharmacyOrderDto: CreatePharmacyOrderDto) {
    return 'This action adds a new pharmacyOrder';
  }

  findAll() {
    return `This action returns all pharmacyOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pharmacyOrder`;
  }

  update(id: number, updatePharmacyOrderDto: UpdatePharmacyOrderDto) {
    return `This action updates a #${id} pharmacyOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} pharmacyOrder`;
  }
}
