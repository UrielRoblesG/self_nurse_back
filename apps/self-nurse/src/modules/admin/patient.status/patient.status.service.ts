import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatPatientStatusEntity } from '../../../database/entities/cat.patient.status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientStatusService {
  private readonly logger = new Logger(PatientStatusService.name);
  constructor(
    @InjectRepository(CatPatientStatusEntity)
    private readonly catPacienteEstatusRepository: Repository<CatPatientStatusEntity>,
  ) {}

  async getPatientStatus(id: number): Promise<CatPatientStatusEntity | null> {
    try {
      const status = await this.catPacienteEstatusRepository.findOneBy({
        id: id,
      });

      if (!status) {
        return null;
      }

      return status;
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }
  async getAll(): Promise<CatPatientStatusEntity[]> {
    try {
      const status = await this.catPacienteEstatusRepository.find({});

      if (!status) {
        return null;
      }

      return status;
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }
}
