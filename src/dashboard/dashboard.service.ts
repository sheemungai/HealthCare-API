import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Dashboard } from './entities/dashboard.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
  ) {}
  async create(createDashboardDto: CreateDashboardDto) {
    const dashboard = this.dashboardRepository.create(createDashboardDto);
    return await this.dashboardRepository.save(dashboard);
  }
  async findAll() {
    return await this.dashboardRepository.find();
  }

  async findOne(id: number) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: ['doctor', 'appointment', 'records', 'record'],
    });
    if (!dashboard) {
      return 'Dashboard not found';
    }
    return dashboard;
  }

  async update(id: number, updateDashboardDto: UpdateDashboardDto) {
    const dashboard = await this.dashboardRepository.findOne({ where: { id } });
    if (!dashboard) {
      return 'Dashboard not found';
    }
    await this.dashboardRepository.update(id, updateDashboardDto);
    return this.dashboardRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const dashboard = await this.dashboardRepository.findOne({ where: { id } });
    if (!dashboard) {
      return 'Dashboard not found';
    }
    await this.dashboardRepository.remove(dashboard);
    return 'Dashboard removed successfully';
  }
}
