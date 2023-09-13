import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoService } from './evento.service';
import { EventsGateway } from './events.gateway';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'apps/self-nurse/src/database/database.module';
import { EventoEntity } from 'apps/self-nurse/src/database/entities/evento.entity';
import { NurseEntity, PatientEntity } from 'apps/self-nurse/src/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventoEntity,
      NurseEntity,
      PatientEntity,
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  providers: [EventsGateway/*, EventoService*/],
})
export class NotificationModule {}
