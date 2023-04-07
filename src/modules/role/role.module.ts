import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { CatUserType } from 'src/database/entities/cat.user.type';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guard/role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CatUserType])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
