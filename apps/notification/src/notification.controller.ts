import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern } from '@nestjs/microservices';
import { EventoEntity } from 'apps/self-nurse/src/database/entities';
@Controller()
export class NotificationController {
  private readonly _logger = new Logger();

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send_notification')
  getHello(data: EventoEntity[]) {
    this._logger.log(`Mensaje entrante ${data[0].alerta}`);
    // return this.notificationService.getHello();
  }
}
