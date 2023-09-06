import { Module } from '@nestjs/common';
import { EventNotificationService } from './event-notification/event-notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EventNotificationService],
  exports: [EventNotificationService],
})
export class TaskModule {}
