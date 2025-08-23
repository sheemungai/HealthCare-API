// dashboard.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Record } from 'src/records/entities/record.entity';
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
  ) {}

  /**
   * Create a new dashboard
   */
  async create(createDashboardDto: CreateDashboardDto): Promise<Dashboard> {
    const dashboard = this.dashboardRepository.create();

    // Add doctors if provided
    if (
      createDashboardDto.doctorIds &&
      createDashboardDto.doctorIds.length > 0
    ) {
      dashboard.doctors = await this.doctorRepository.findBy({
        id: In(createDashboardDto.doctorIds),
      });
    }

    // Add appointments if provided
    if (
      createDashboardDto.appointmentIds &&
      createDashboardDto.appointmentIds.length > 0
    ) {
      dashboard.appointments = await this.appointmentRepository.findBy({
        id: In(createDashboardDto.appointmentIds),
      });
    }

    // Add records if provided
    if (
      createDashboardDto.recordIds &&
      createDashboardDto.recordIds.length > 0
    ) {
      dashboard.records = await this.recordRepository.findBy({
        id: In(createDashboardDto.recordIds),
      });
    }

    return await this.dashboardRepository.save(dashboard);
  }

  /**
   * Get all dashboards
   */
  async findAll(): Promise<Dashboard[]> {
    return await this.dashboardRepository.find({
      relations: ['doctors', 'appointments', 'records'],
    });
  }

  /**
   * Get a specific dashboard by ID
   */
  async findOne(id: number): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: ['doctors', 'appointments', 'records'],
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    return dashboard;
  }

  /**
   * Update a dashboard
   */
  async update(
    id: number,
    updateDashboardDto: UpdateDashboardDto,
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: ['doctors', 'appointments', 'records'],
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    // Update doctors if provided
    if (updateDashboardDto.doctorIds !== undefined) {
      dashboard.doctors =
        updateDashboardDto.doctorIds.length > 0
          ? await this.doctorRepository.findBy({
              id: In(updateDashboardDto.doctorIds),
            })
          : [];
    }

    // Update appointments if provided
    if (updateDashboardDto.appointmentIds !== undefined) {
      dashboard.appointments =
        updateDashboardDto.appointmentIds.length > 0
          ? await this.appointmentRepository.findBy({
              id: In(updateDashboardDto.appointmentIds),
            })
          : [];
    }

    // Update records if provided
    if (updateDashboardDto.recordIds !== undefined) {
      dashboard.records =
        updateDashboardDto.recordIds.length > 0
          ? await this.recordRepository.findBy({
              id: In(updateDashboardDto.recordIds),
            })
          : [];
    }

    return await this.dashboardRepository.save(dashboard);
  }

  /**
   * Delete a dashboard
   */
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

  /**
   * Get complete dashboard data with cards and statistics
   */
  async getDashboardData(id: number): Promise<DashboardDataDto> {
    const dashboard = await this.findOne(id);
    const cards = await this.generateDashboardCards(dashboard);

    const dashboardData: DashboardDataDto = {
      id: dashboard.id,
      title: `Dashboard #${dashboard.id}`,
      description: 'Your personalized medical dashboard',
      cards: cards,
      totalDoctors: dashboard.doctors?.length || 0,
      totalAppointments: dashboard.appointments?.length || 0,
      totalRecords: dashboard.records?.length || 0,
      createdAt: dashboard.createdAt || new Date(),
      updatedAt: dashboard.updatedAt || new Date(),
    };

    return dashboardData;
  }

  /**
   * Get only dashboard cards
   */
  async getDashboardCards(id: number): Promise<DashboardCardDto[]> {
    const dashboard = await this.findOne(id);
    return this.generateDashboardCards(dashboard);
  }

  /**
   * Get dashboard statistics and summary
   */
  async getDashboardSummary(id: number) {
    const dashboard = await this.findOne(id);

    return {
      id: dashboard.id,
      summary: {
        totalEntities:
          (dashboard.doctors?.length || 0) +
          (dashboard.appointments?.length || 0) +
          (dashboard.records?.length || 0),
        doctors: dashboard.doctors?.length || 0,
        appointments: dashboard.appointments?.length || 0,
        records: dashboard.records?.length || 0,
      },
      recentActivity: await this.getRecentActivity(dashboard),
      quickActions: ['add-doctor', 'schedule-appointment', 'view-reports'],
    };
  }

  /**
   * Generate dashboard cards from entities
   */
  private async generateDashboardCards(
    dashboard: Dashboard,
  ): Promise<DashboardCardDto[]> {
    const cards: DashboardCardDto[] = [];

    // Add doctor cards
    if (dashboard.doctors && dashboard.doctors.length > 0) {
      dashboard.doctors.forEach((doctor) => {
        cards.push(this.mapDoctorToCard(doctor));
      });
    }

    // Add appointment cards
    if (dashboard.appointments && dashboard.appointments.length > 0) {
      dashboard.appointments.forEach((appointment) => {
        cards.push(this.mapAppointmentToCard(appointment));
      });
    }

    // Add record cards
    if (dashboard.records && dashboard.records.length > 0) {
      dashboard.records.forEach((record) => {
        cards.push(this.mapRecordToCard(record));
      });
    }

    return cards;
  }

  /**
   * Get recent activity for the dashboard
   */
  private async getRecentActivity(dashboard: Dashboard) {
    const activities = [];

    if (dashboard.doctors && dashboard.doctors.length > 0) {
      activities.push({
        type: 'doctor_added',
        count: dashboard.doctors.length,
        message: `${dashboard.doctors.length} doctors in dashboard`,
        timestamp: new Date(),
      });
    }

    if (dashboard.appointments && dashboard.appointments.length > 0) {
      activities.push({
        type: 'appointment_scheduled',
        count: dashboard.appointments.length,
        message: `${dashboard.appointments.length} appointments scheduled`,
        timestamp: new Date(),
      });
    }

    if (dashboard.records && dashboard.records.length > 0) {
      activities.push({
        type: 'record_created',
        count: dashboard.records.length,
        message: `${dashboard.records.length} medical records available`,
        timestamp: new Date(),
      });
    }

    return activities;
  }

  /**
   * Map Doctor entity to Dashboard Card
   */
  private mapDoctorToCard(doctor: Doctor): DashboardCardDto {
    return {
      id: doctor.id,
      title: `${doctor.firstName} ${doctor.lastName}`,
      subtitle: doctor.specialization,
      description: doctor.bio,
      imageUrl: doctor.profilePicture,
      stats: {
        experience: `${doctor.yearsOfExperience} years`,
        rating: doctor.rating,
        patients: doctor.patientCount,
      },
      actions: ['view-profile', 'book-appointment', 'contact'],
      type: 'doctor',
      entity: doctor,
    };
  }

  /**
   * Map Appointment entity to Dashboard Card
   */
  private mapAppointmentToCard(appointment: Appointment): DashboardCardDto {
    return {
      id: appointment.id,
      title: `Appointment with Dr. ${appointment.doctor?.lastName}`,
      subtitle: new Date(appointment.appointmentDate).toLocaleDateString(),
      description: appointment.reason,
      stats: {
        status: appointment.status,
        duration: appointment.duration,
        patient: appointment.patient?.firstName,
      },
      actions: ['reschedule', 'cancel', 'view-details'],
      type: 'appointment',
      entity: appointment,
    };
  }

  /**
   * Map Record entity to Dashboard Card
   */
  private mapRecordToCard(record: Record): DashboardCardDto {
    return {
      id: record.id,
      title: `Medical Record - ${record.recordType}`,
      subtitle: new Date(record.date).toLocaleDateString(),
      description:
        record.notes?.substring(0, 100) +
        (record.notes?.length > 100 ? '...' : ''),
      stats: {
        doctor: record.doctor?.lastName,
        patient: record.patient?.firstName,
        type: record.recordType,
      },
      actions: ['view-details', 'download', 'share'],
      type: 'record',
      entity: record,
    };
  }

  /**
   * Search dashboards by content
   */
  async searchDashboards(query: string): Promise<Dashboard[]> {
    const dashboards = await this.findAll();

    return dashboards.filter((dashboard) => {
      // Search in doctors
      const doctorMatch = dashboard.doctors?.some(
        (doctor) =>
          `${doctor.firstName} ${doctor.lastName}`
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase()),
      );

      // Search in appointments
      const appointmentMatch = dashboard.appointments?.some(
        (appointment) =>
          appointment.reason.toLowerCase().includes(query.toLowerCase()) ||
          appointment.status.toLowerCase().includes(query.toLowerCase()),
      );

      // Search in records
      const recordMatch = dashboard.records?.some(
        (record) =>
          record.recordType.toLowerCase().includes(query.toLowerCase()) ||
          record.notes.toLowerCase().includes(query.toLowerCase()),
      );

      return doctorMatch || appointmentMatch || recordMatch;
    });
  }
}
