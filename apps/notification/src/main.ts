import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
  const socketApp = await NestFactory.create(NotificationModule);
  await socketApp.listen(3001);
}
bootstrap();
