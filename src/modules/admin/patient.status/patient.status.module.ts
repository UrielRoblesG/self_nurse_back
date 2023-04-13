import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientStatusService } from './patient.status.service';
import { CatPatientStatusEntity } from 'src/database/entities/cat.patient.status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatPatientStatusEntity]),
    PatientStatusModule,
  ],
  controllers: [],
  providers: [PatientStatusService],
  exports: [PatientStatusService],
})
export class PatientStatusModule {}
