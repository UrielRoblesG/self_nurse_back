import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoService } from './evento.service';
import { EventsGateway } from './events.gateway';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'apps/self-nurse/src/database/database.module';
import { EventoEntity } from 'apps/self-nurse/src/database/entities/evento.entity';
import { UserEntity } from 'apps/self-nurse/src/database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventoEntity,
      /*ViewGetPacienteEventos,*/
      UserEntity,
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  /*controllers: [NotificationController],*/
  providers: [/*NotificationService, */ EventsGateway, EventoService],
})
export class NotificationModule {}
