import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'apps/self-nurse/src/database/database.module';
import { NurseEntity, PatientEntity, EventoEntity, UserEntity } from 'apps/self-nurse/src/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventoEntity,
      NurseEntity,
      PatientEntity,
      UserEntity,
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  providers: [NotificationGateway,NotificationService],
})
export class NotificationModule {}
