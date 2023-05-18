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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PatientStatusModule,
    AuthModule,
    UserModule,
    RoleModule,
    RelationshipModule,
    DatabaseModule,
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
    AppModule.PORT = +configService.get('PORT');
  }
}
