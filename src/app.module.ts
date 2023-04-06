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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'sa',
      password: 'root',
      database: 'self_nurse_db',
      entities: [
        UserEntity,
        CatUserType,
        PatientEntity,
        DoctorEntity,
        CaregiverEntity,
        CatRelationshipEntity,
        CatPatientStatusEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}