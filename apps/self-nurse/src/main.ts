import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const _logger = new Logger();
  const app = await NestFactory.create(AppModule);
  _logger.debug(new Date().toString());

  const config = new DocumentBuilder()
    .setTitle('Sef Nurse Documentation')
    .addBearerAuth()
    .setDescription('The Self Nurse API description')
    .setVersion('1.0')
    .addTag('Usuarios')
    .addTag('Autenticacion')
    .addTag('Evento')
    .addTag('Enfermero')
    .addTag('Estado Paciente')
    .addTag('Relacion cuidador')
    .addTag('Roles')
    .build();
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  _logger.log(`Aplicación corriendo en el puerto ${AppModule.PORT}`);
  await app.listen(AppModule.PORT);
}
bootstrap();
