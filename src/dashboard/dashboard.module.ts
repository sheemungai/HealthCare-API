import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Dashboard } from './entities/dashboard.entity';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Dashboard]), DoctorsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
