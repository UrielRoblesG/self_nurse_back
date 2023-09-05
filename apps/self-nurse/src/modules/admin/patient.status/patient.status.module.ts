import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientStatusService } from './patient.status.service';
import { CatPatientStatusEntity } from '../../../database/entities/cat.patient.status.entity';
import { PatientStatusController } from './patient.status.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatPatientStatusEntity]),
    PatientStatusModule,
  ],
  controllers: [PatientStatusController],
  providers: [PatientStatusService],
  exports: [PatientStatusService],
})
export class PatientStatusModule {}
