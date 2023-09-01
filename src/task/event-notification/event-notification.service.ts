import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventNotificationService {
  private readonly _logger = new Logger(EventNotificationService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  showEveryFiveSeconds() {
    this._logger.log("This message show's every 5 minutes");
  }
}
