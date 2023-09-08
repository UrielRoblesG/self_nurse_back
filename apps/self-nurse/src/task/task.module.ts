import { Module } from '@nestjs/common';
import { EventNotificationService } from './event-notification/event-notification.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventoService } from '../modules/evento/evento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity, UserEntity } from '../database/entities';
import { ViewGetPacienteEventos } from '../database/views';

@Module({
  imports: [
    /*ClientsModule.register([
      { name: 'NOTIFICATION_SERVICE', transport: Transport.TCP },
    ]),*/
    TypeOrmModule.forFeature([
      EventoEntity,
      ViewGetPacienteEventos,
      UserEntity,
    ]),
  ],
  providers: [EventNotificationService, EventoService],
  exports: [EventNotificationService],
})
export class TaskModule {}
