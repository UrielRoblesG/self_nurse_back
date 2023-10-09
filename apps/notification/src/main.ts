import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { initializeApp } from 'firebase-admin/app';
import { FirebaseService } from './services/firebase.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.TCP,
    },
  );

  const firebaseService = new FirebaseService();

  await app.listen();
  const socketApp = await NestFactory.create(NotificationModule);
  await socketApp.listen(3002);
}
bootstrap();
