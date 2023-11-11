import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseService } from '../../services/firebase.service';
import { Notificacion } from '../../models/notificacion';
import { subHours } from 'date-fns';

@Injectable()
@WebSocketGateway()
export class NotificationGateway implements OnGatewayInit {
  private readonly logger: Logger = new Logger(NotificationGateway.name);

  @WebSocketServer() server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  afterInit() {
    this.logger.log('Socket.io service initialized.');
  }

  @Cron("0 */4 * * * *", {
    timeZone: 'America/Mexico_City',
  })
  async buscaUsuarios() {
    this.logger.log('Buscando eventos próximos y sus usuarios relacionados...');
    const currentDate = subHours(new Date(), 1);

    try {
      const notificaciones =
        await this.notificationService.obtenerNotificacionesProximas(
          currentDate,
        );
      //redundancia para evitar errores en caso de null

      if (notificaciones && notificaciones.length > 0) {
        this.logger.log(`Número de notificaciones a enviar: ${notificaciones.length}`);
        // this.server.emit('hola_mundo', `Usuarios relacionados con eventos próximos: ${users.length}`);

        const firebaseInstance = FirebaseService.getInstance();
        notificaciones.forEach( async (n) => {
          try {

            await firebaseInstance.sendSingleNotification(
              n.data['dispositivo'],
              n,
            );
          } catch(e) {
            this.logger.error(e);
          }
        })
      } else {
        this.logger.log(
          'No se encontraron usuarios relacionados con eventos próximos.',
        );
      }
    } catch (error) {
      this.logger.error('Error en gateway al buscar usuarios:', error);
    }
  }
}
