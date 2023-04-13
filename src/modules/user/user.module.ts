import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { PatientEntity } from 'src/database/entities/patient.entity';
import { CaregiverEntity } from 'src/database/entities/caregiver.entity';
import { DoctorEntity } from 'src/database/entities/doctor.entity';
import { RelationshipService } from '../admin/relationship/relationship.service';
import { RelationshipModule } from '../admin/relationship/relationship.module';
import { PatientStatusModule } from '../admin/patient.status/patient.status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PatientEntity,
      CaregiverEntity,
      DoctorEntity,
    ]),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RelationshipModule,
    PatientStatusModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
