import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseService } from './services/firebase.service';

@Injectable()
@WebSocketGateway()
export class NotificationGateway implements OnGatewayInit {
  private readonly logger: Logger = new Logger(NotificationGateway.name);

  @WebSocketServer() server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  afterInit() {
    this.logger.log('Socket.io service initialized.');
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async buscaUsuarios() {
    this.logger.log('Buscando eventos próximos y sus usuarios relacionados...');
    const currentDate = new Date();

    try {
      const users =
        await this.notificationService.obtenerUsuariosDeEventosProximos(
          currentDate,
        );
      //redundancia para evitar errores en caso de null
      if (users && users.length > 0) {
        this.logger.log(`Usuarios encontrados: ${users.length}`);
        // this.server.emit('hola_mundo', `Usuarios relacionados con eventos próximos: ${users.length}`);

        let devicesId: string[];
        const firebaseInstance = FirebaseService.getInstance();
        users.forEach((user) => devicesId.push(user.deviceToken));
        const notification = new Notification('Titulo provisional', {
          body: 'Body de prueba',
        });
        await firebaseInstance.sendNotificationMulticast(
          devicesId,
          notification,
        );
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
