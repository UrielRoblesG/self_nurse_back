import { Module } from '@nestjs/common';
import { UsersGateway } from './users.gateway';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../modules/user/user.service';
import { UserModule } from '../modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DoctorEntity,
  NurseEntity,
  PatientEntity,
  UserEntity,
} from '../database/entities';
import { PatientStatusModule } from '../modules/admin/patient.status/patient.status.module';
import { CloudinaryModule } from '../modules/user/cloudinary/cloudinary.module';
import { DoctorService } from '../modules/doctor/doctor.service';
import { NurseService } from '../modules/nurse/nurse.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      UserEntity,
      PatientEntity,
      NurseEntity,
      DoctorEntity,
    ]),

    PatientStatusModule,

    CloudinaryModule,
  ],
  controllers: [],
  providers: [
    UsersGateway,
    JwtService,
    UserService,
    DoctorService,
    NurseService,
  ],
})
export class SocketsModule {}
