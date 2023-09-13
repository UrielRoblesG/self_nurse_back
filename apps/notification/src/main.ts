import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const socketApp = await NestFactory.create(NotificationModule);
  socketApp.useWebSocketAdapter(new WsAdapter(socketApp));
  await socketApp.listen(3002);
}

bootstrap();
