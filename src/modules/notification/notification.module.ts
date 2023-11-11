import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationGateway } from './notification.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { EventoEntity, NurseEntity, PatientEntity, UserEntity } from 'src/database/entities';
import { ViewGetPacienteEventos } from 'src/database/views';
import { EventoService } from '../evento/evento.service';

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
