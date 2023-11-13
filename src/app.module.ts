
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';

import { DatabaseModule } from './database/database.module';
import { PatientStatusController } from './modules/admin/patient.status/patient.status.controller';
import { PatientStatusModule } from './modules/admin/patient.status/patient.status.module';
import { RelationshipModule } from './modules/admin/relationship/relationship.module';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { EventoModule } from './modules/evento/evento.module';
import { NurseModule } from './modules/nurse/nurse.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { RoleGuard } from './modules/role/guard/role.guard';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { NotificationModule } from './modules/notification/notification.module';
import { SocketsModule } from './sockets/sockets.module';
import { VitalSignsModule } from './modules/paciente/vital-signs.module';

@Module({
  imports: [
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
    NotificationModule,
    SocketsModule,
    VitalSignsModule
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
