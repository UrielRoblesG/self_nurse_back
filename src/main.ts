import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sef Nurse Documentation')
    .addBearerAuth()
    .setDescription('The Self Nurse API description')
    .setVersion('1.0')
    .addTag('Usuarios')
    .addTag('Autenticacion')
    .addTag('Evento')
    .addTag('Estado Paciente')
    .addTag('Relacion cuidador')
    .addTag('Roles')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(`Aplicación corriendo en el puerto ${AppModule.PORT}`);
  await app.listen(AppModule.PORT);
}
bootstrap();
