import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern } from '@nestjs/microservices';
import { EventoEntity } from 'apps/self-nurse/src/database/entities';
import { FirebaseService } from './services/firebase.service';

@Controller()
export class NotificationController {
  private readonly _logger = new Logger();
  private readonly firebaseService: FirebaseService;

  constructor(private readonly notificationService: NotificationService) {
    this.firebaseService = new FirebaseService();
  }

  @EventPattern('send_notification')
  getHello(data: EventoEntity[]) {
    this._logger.log(`Mensaje entrante ${data[0].alerta}`);
    // return this.notificationService.getHello();
  }
}
