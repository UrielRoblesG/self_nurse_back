import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'apps/self-nurse/src/database/database.module';
import {
  NurseEntity,
  PatientEntity,
  EventoEntity,
  UserEntity,
} from 'apps/self-nurse/src/database/entities';
import { EventoService } from 'apps/self-nurse/src/modules/evento/evento.service';
import { ViewGetPacienteEventos } from 'apps/self-nurse/src/database/views';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventoEntity,
      NurseEntity,
      PatientEntity,
      UserEntity,
      ViewGetPacienteEventos,
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  providers: [NotificationGateway, EventoService, NotificationService],
})
export class NotificationModule {}
