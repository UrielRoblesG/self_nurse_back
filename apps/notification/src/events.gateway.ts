import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  private readonly logger: Logger = new Logger(EventsGateway.name);
  
  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log('Socket.io microservice initialized.');
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  //aqui va la funcion que hace la consulta
  async sayHelloWorld() {
    this.logger.log('Emitting "hola mundo" to all clients.');
    this.server.emit('hola_mundo', 'Hola mundo');
  }
}
