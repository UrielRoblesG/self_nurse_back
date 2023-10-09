import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoService } from './evento.service';
import { EventsGateway } from './events.gateway';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'apps/self-nurse/src/database/database.module';
import { EventoEntity } from 'apps/self-nurse/src/database/entities/evento.entity';
import { UserEntity } from 'apps/self-nurse/src/database/entities/user.entity';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoEntity, UserEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    NotificationsModule,
  ],
  /*controllers: [NotificationController],*/
  providers: [/*NotificationService, */ EventsGateway, EventoService],
})
export class NotificationModule {}
