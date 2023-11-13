import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity, UserEntity } from '../../database/entities';
import { DoctorService } from '../doctor/doctor.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserEntity, PatientEntity]),
  ],
  controllers: [PacienteController],
  providers: [PacienteService, JwtService, DoctorService],
})
export class PacienteModule {}
