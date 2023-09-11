import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  import { Cron, CronExpression } from '@nestjs/schedule';
  import { EventoService } from './evento.service';
  import { Injectable, Logger } from '@nestjs/common';
  
  @Injectable()
  @WebSocketGateway()
  export class EventsGateway implements OnGatewayInit {
    private readonly logger: Logger = new Logger(EventsGateway.name);
    @WebSocketServer() server: Server;

    constructor(private readonly eventoService: EventoService) {}
  
    afterInit() {
      this.logger.log('Socket.io microservice initialized.');
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async showEveryFiveMinutes() {
      const eventos = await this.eventoService.obtenerEventosProximos(new Date());
  
      if (eventos.length <= 0) {
        return;
      }
      this.logger.log('Emitting event to all clients.');
      this.server.emit('send_notification', 'hola, si se emitieron datos');
      //this.server.emit('send_notification', eventos);
    }
  }
