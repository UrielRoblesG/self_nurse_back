import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const socketApp = await NestFactory.create(NotificationModule);
  await socketApp.listen(3002);
}
bootstrap();
