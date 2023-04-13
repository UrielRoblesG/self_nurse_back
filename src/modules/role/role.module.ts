import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { CatUserType } from 'src/database/entities/cat.user.type';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatUserType]),
    RoleModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RoleController],
  providers: [RoleService, JwtService],
})
export class RoleModule {}
