import { PatientStatusController } from './modules/admin/patient.status/patient.status.controller';
import { PatientStatusModule } from './modules/admin/patient.status/patient.status.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RoleGuard } from './modules/role/guard/role.guard';
import { RoleModule } from './modules/role/role.module';
import { RelationshipModule } from './modules/admin/relationship/relationship.module';
import { DatabaseModule } from './database/database.module';
import { EventoModule } from './modules/evento/evento.module';
import { NurseModule } from './modules/nurse/nurse.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventNotificationService } from './task/event-notification/event-notification.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'NOTIFICATION_SERVICE', transport: Transport.TCP },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    PatientStatusModule,
    AuthModule,
    UserModule,
    RoleModule,
    RelationshipModule,
    DatabaseModule,
    EventoModule,
    NurseModule,
    DoctorModule,
    PacienteModule,
    TaskModule,
  ],
  controllers: [PatientStatusController, AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    JwtService,
  ],
  exports: [JwtService],
})
export class AppModule {
  static PORT: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.PORT = +this.configService.get('PORT');
  }
}
