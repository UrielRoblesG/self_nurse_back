import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertEntity, CatPatientStatusEntity, DoctorEntity, NurseEntity, PatientEntity, UserEntity } from '../../database/entities';
import { DoctorService } from '../doctor/doctor.service';
import { UserService } from '../user/user.service';
import { FirebaseService } from 'src/services/firebase.service';
import { PatientStatusService } from '../admin/patient.status/patient.status.service';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserEntity, PatientEntity, NurseEntity,DoctorEntity, CatPatientStatusEntity, AlertEntity]),
  ],
  controllers: [PacienteController],
  providers: [PacienteService, JwtService, DoctorService, UserService, FirebaseService, PatientStatusService, CloudinaryService],
})
export class PacienteModule {}
