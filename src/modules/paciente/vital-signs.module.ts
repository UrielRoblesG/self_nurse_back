import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSignsService } from './vital-signs.service';
import { VitalSignsController } from './vital-signs.controller';
import { VitalSignsEntity } from '../../database/entities/vital-signs.entity';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FirebaseService } from 'src/services/firebase.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSignsEntity]),
  PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [VitalSignsService, JwtService],
  controllers: [VitalSignsController],
  exports: [VitalSignsService]
})
export class VitalSignsModule {}
