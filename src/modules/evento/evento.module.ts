import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EventoEntity,
  NurseEntity,
  PatientEntity,
} from 'src/database/entities';

@Module({
  controllers: [EventoController],
  imports: [
    EventoModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([EventoEntity, PatientEntity, NurseEntity]),
  ],
  providers: [EventoService, JwtService],
})
export class EventoModule {}
