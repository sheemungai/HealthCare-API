import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Record } from 'src/records/entities/record.entity';
import { PharmacyOrder } from 'src/pharmacy_orders/entities/pharmacy-order.entity';
import { User } from 'src/users/entities/user.entity';
import { DashboardCardDto } from './dto/dashboard-card.dto';
import { DashboardDataDto } from './dto/dashboard-data.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(PharmacyOrder)
    private pharmacyOrderRepository: Repository<PharmacyOrder>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDashboardDto: CreateDashboardDto): Promise<Dashboard> {
    const dashboard = this.dashboardRepository.create();

    // Add doctors if provided
    if (
      createDashboardDto.doctorIds &&
      createDashboardDto.doctorIds.length > 0
    ) {
      dashboard.doctors = await this.doctorRepository.findBy({
        doctor_id: In(createDashboardDto.doctorIds),
      });
    }

    // Add appointments if provided
    if (
      createDashboardDto.appointmentIds &&
      createDashboardDto.appointmentIds.length > 0
    ) {
      dashboard.appointments = await this.appointmentRepository.findBy({
        appointment_id: In(createDashboardDto.appointmentIds),
      });
    }

    // Add records if provided
    if (
      createDashboardDto.recordIds &&
      createDashboardDto.recordIds.length > 0
    ) {
      dashboard.records = await this.recordRepository.findBy({
        record_id: In(createDashboardDto.recordIds),
      });
    }

    // Add pharmacy orders if provided
    if (
      createDashboardDto.pharmacyOrderIds &&
      createDashboardDto.pharmacyOrderIds.length > 0
    ) {
      dashboard.pharmacyOrders = await this.pharmacyOrderRepository.findBy({
        pharmacy_order_id: In(createDashboardDto.pharmacyOrderIds),
      });
    }

    // Add users if provided
    if (createDashboardDto.userIds && createDashboardDto.userIds.length > 0) {
      dashboard.users = await this.userRepository.findBy({
        user_id: In(createDashboardDto.userIds),
      });
    }

    return await this.dashboardRepository.save(dashboard);
  }

  async findAll(): Promise<Dashboard[]> {
    return await this.dashboardRepository.find({
      relations: [
        'doctors',
        'appointments',
        'records',
        'pharmacyOrders',
        'users',
      ],
    });
  }

  async findOne(id: number): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: [
        'doctors',
        'appointments',
        'records',
        'pharmacyOrders',
        'users',
      ],
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    return dashboard;
  }

  async update(
    id: number,
    updateDashboardDto: UpdateDashboardDto,
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: [
        'doctors',
        'appointments',
        'records',
        'pharmacyOrders',
        'users',
      ],
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    // Update doctors if provided
    if (updateDashboardDto.doctorIds !== undefined) {
      dashboard.doctors =
        updateDashboardDto.doctorIds.length > 0
          ? await this.doctorRepository.findBy({
              doctor_id: In(updateDashboardDto.doctorIds),
            })
          : [];
    }

    // Update appointments if provided
    if (updateDashboardDto.appointmentIds !== undefined) {
      dashboard.appointments =
        updateDashboardDto.appointmentIds.length > 0
          ? await this.appointmentRepository.findBy({
              appointment_id: In(updateDashboardDto.appointmentIds),
            })
          : [];
    }

    // Update records if provided
    if (updateDashboardDto.recordIds !== undefined) {
      dashboard.records =
        updateDashboardDto.recordIds.length > 0
          ? await this.recordRepository.findBy({
              record_id: In(updateDashboardDto.recordIds),
            })
          : [];
    }

    // Update pharmacy orders if provided
    if (updateDashboardDto.pharmacyOrderIds !== undefined) {
      dashboard.pharmacyOrders =
        updateDashboardDto.pharmacyOrderIds.length > 0
          ? await this.pharmacyOrderRepository.findBy({
              pharmacy_order_id: In(updateDashboardDto.pharmacyOrderIds),
            })
          : [];
    }

    // Update users if provided
    if (updateDashboardDto.userIds !== undefined) {
      dashboard.users =
        updateDashboardDto.userIds.length > 0
          ? await this.userRepository.findBy({
              user_id: In(updateDashboardDto.userIds),
            })
          : [];
    }

    return await this.dashboardRepository.save(dashboard);
  }

  async remove(id: number): Promise<{ message: string }> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    await this.dashboardRepository.remove(dashboard);
    return { message: 'Dashboard removed successfully' };
  }

  async getDashboardData(id: number): Promise<DashboardDataDto> {
    const dashboard = await this.findOne(id);
    const cards = this.generateDashboardCards(dashboard);

    const dashboardData: DashboardDataDto = {
      id: dashboard.id,
      title: `Healthcare Dashboard #${dashboard.id}`,
      description: 'Your personalized medical dashboard',
      cards: cards,
      totalDoctors: dashboard.doctors?.length || 0,
      totalAppointments: dashboard.appointments?.length || 0,
      totalRecords: dashboard.records?.length || 0,
      totalPharmacyOrders: dashboard.pharmacyOrders?.length || 0,
      totalUsers: dashboard.users?.length || 0,
      createdAt: dashboard.createdAt,
      updatedAt: dashboard.updatedAt,
    };

    return dashboardData;
  }

  async getDashboardCards(id: number): Promise<DashboardCardDto[]> {
    const dashboard = await this.findOne(id);
    return this.generateDashboardCards(dashboard);
  }

  private generateDashboardCards(dashboard: Dashboard): DashboardCardDto[] {
    const cards: DashboardCardDto[] = [];

    // Add doctor cards
    if (dashboard.doctors?.length > 0) {
      dashboard.doctors.forEach((doctor) => {
        cards.push(this.mapDoctorToCard(doctor));
      });
    }

    // Add appointment cards
    if (dashboard.appointments?.length > 0) {
      dashboard.appointments.forEach((appointment) => {
        cards.push(this.mapAppointmentToCard(appointment));
      });
    }

    // Add record cards
    if (dashboard.records?.length > 0) {
      dashboard.records.forEach((record) => {
        cards.push(this.mapRecordToCard(record));
      });
    }

    // Add pharmacy order cards
    if (dashboard.pharmacyOrders?.length > 0) {
      dashboard.pharmacyOrders.forEach((order) => {
        cards.push(this.mapPharmacyOrderToCard(order));
      });
    }

    // Add user cards
    if (dashboard.users?.length > 0) {
      dashboard.users.forEach((user) => {
        cards.push(this.mapUserToCard(user));
      });
    }

    return cards;
  }

  private mapDoctorToCard(doctor: Doctor): DashboardCardDto {
    return {
      id: doctor.doctor_id,
      title: `Dr. ${doctor.doctor_name}`,
      // subtitle: doctor.specialization,
      // description: `${doctor.experience_years} years experience`,
      // stats: {
      //   experience: `${doctor.experience_years} years`,
      //   fee: `$${doctor.consultation_fee}`,
      //   specialization: doctor.specialization,
      // },
      actions: ['view-profile', 'book-appointment', 'contact'],
      type: 'doctor',
      entity: doctor,
    };
  }

  private mapAppointmentToCard(appointment: Appointment): DashboardCardDto {
    return {
      id: appointment.appointment_id,
      title: `Appointment`,
      // subtitle: new Date(appointment.appointment_time).toLocaleDateString(),
      // description: appointment.reason,
      // stats: {
      //   status: appointment.payment_status,
      //   time: new Date(appointment.appointment_time).toLocaleTimeString(),
      //   doctor: appointment.doctor?.name,
      // },
      actions: ['reschedule', 'cancel', 'view-details'],
      type: 'appointment',
      entity: appointment,
    };
  }

  private mapRecordToCard(record: Record): DashboardCardDto {
    return {
      id: record.record_id,
      title: `Medical Record`,
      // subtitle: new Date(record.date_created).toLocaleDateString(),
      // description:
      //   record.diagnosis?.substring(0, 100) +
      //   (record.diagnosis?.length > 100 ? '...' : ''),
      // stats: {
      //   doctor: record.doctor?.name,
      //   patient: record.patient?.user?.name,
      //   type: 'Medical Record',
      // },
      actions: ['view-details', 'download', 'share'],
      type: 'record',
      entity: record,
    };
  }

  private mapPharmacyOrderToCard(order: PharmacyOrder): DashboardCardDto {
    return {
      id: order.pharmacy_order_id,
      title: `Pharmacy Order #${order.pharmacy_order_id}`,
      // subtitle: new Date(
      //   order.pharmacy_order_date,
      // ).toLocaleDateString(),
      // description: `Order total: $${order.total_amount}`,
      // stats: {
      //   status: order.order_status,
      //   total: `$${order.total_amount}`,
      //   items: 'Multiple items',
      // },
      actions: ['view-details', 'track-order', 'reorder'],
      type: 'pharmacy-order',
      entity: order,
    };
  }

  private mapUserToCard(user: User): DashboardCardDto {
    return {
      id: user.user_id,
      title: user.name,
      // subtitle: user.email,
      // description: `Role: ${user.role}`,
      // stats: {
      //   role: user.role,
      //   joined: new Date(user.date_created).toLocaleDateString(),
      // },
      actions: ['view-profile', 'edit-profile', 'contact'],
      type: 'user',
      entity: user,
    };
  }
}
