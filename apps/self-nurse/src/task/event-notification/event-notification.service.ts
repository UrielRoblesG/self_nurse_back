import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventoService } from '../../modules/evento/evento.service';

@Injectable()
export class EventNotificationService {
  private readonly _logger = new Logger(EventNotificationService.name);

  constructor(
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy,

    private readonly eventoService: EventoService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async showEveryFiveSeconds() {
    const eventos = await this.eventoService.obtenerEventosProximos(new Date());

    if (eventos.length <= 0) {
      return;
    }

    this.client.emit('send_notification', eventos);
  }
}
