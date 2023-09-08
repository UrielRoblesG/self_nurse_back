import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity, UserEntity } from './database/';
import { EventoService } from './evento.service';
import { EventsGateway } from './events.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([
    EventoEntity,
    /*ViewGetPacienteEventos,*/
    UserEntity,
  ]),
  ConfigModule.forRoot({ isGlobal: true }),
  ScheduleModule.forRoot(),
  DatabaseModule,],
  /*controllers: [NotificationController],*/
  providers: [/*NotificationService, */EventsGateway, EventoService],
})
export class NotificationModule {}
