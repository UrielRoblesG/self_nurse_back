import { Module } from '@nestjs/common';
//import { NotificationController } from './notification.controller';
//import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity, UserEntity } from './database/entities/';
import { ViewGetPacienteEventos } from './database/views/v.get.eventos';
import { EventoService } from './services/evento.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([
    EventoEntity,
    ViewGetPacienteEventos,
    UserEntity,
  ]),],
  /*controllers: [NotificationController],*/
  providers: [/*NotificationService, */EventsGateway, EventoService],
})
export class NotificationModule {}
