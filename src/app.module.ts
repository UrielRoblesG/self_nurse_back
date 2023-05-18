import { PatientStatusController } from './modules/admin/patient.status/patient.status.controller';
import { PatientStatusService } from './modules/admin/patient.status/patient.status.service';
import { PatientStatusModule } from './modules/admin/patient.status/patient.status.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { CatUserType } from './database/entities/cat.user.type';
import { PatientEntity } from './database/entities/patient.entity';
import { DoctorEntity } from './database/entities/doctor.entity';
import { CatRelationshipEntity } from './database/entities/cat.relationship.enity';
import { CaregiverEntity } from './database/entities/caregiver.entity';
import { CatPatientStatusEntity } from './database/entities/cat.patient.status.entity';
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
