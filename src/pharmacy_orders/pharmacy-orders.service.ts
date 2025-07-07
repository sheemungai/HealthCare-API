import { Injectable } from '@nestjs/common';
import { CreatePharmacyOrderDto } from './dto/create-pharmacy-order.dto';
import { UpdatePharmacyOrderDto } from './dto/update-pharmacy-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PharmacyOrder } from './entities/pharmacy-order.entity';

@Injectable()
export class PharmacyOrdersService {
  constructor(
    @InjectRepository(PharmacyOrder)
    private pharmacy_orderRepository: Repository<PharmacyOrder>,
  ) {}

  async create(createPharmacyOrderDto: CreatePharmacyOrderDto) {
    const pharmacy_orders = this.pharmacy_orderRepository.create(
      createPharmacyOrderDto,
    );
    return await this.pharmacy_orderRepository.save(pharmacy_orders);
  }

  async findAll() {
    const pharmacy_orders = await this.pharmacy_orderRepository.find();
    return pharmacy_orders;
  }

  async findOne(id: number) {
    const pharmacy_order = await this.pharmacy_orderRepository.findOne({
      where: { pharmacy_order_id: id },
    });
    if (!pharmacy_order) {
      return ' Pharmacy_orders not found';
    }

    return pharmacy_order;
  }

  async update(id: number, updatePharmacyOrderDto: UpdatePharmacyOrderDto) {
    const pharmacy_order = await this.pharmacy_orderRepository.findOne({
      where: { pharmacy_order_id: id },
    });
    if (!pharmacy_order) {
      return 'pharmacy_order not found';
    }
    this.pharmacy_orderRepository.merge(pharmacy_order, updatePharmacyOrderDto);
    return await this.pharmacy_orderRepository.save(pharmacy_order);
  }

  async remove(id: number) {
    return this.pharmacy_orderRepository.delete(id);
  }
}
