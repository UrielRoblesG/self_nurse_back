import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSignsService } from './vital-signs.service';
import { VitalSignsController } from './vital-signs.controller';
import { VitalSignsEntity } from '../../database/entities/vital-signs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSignsEntity])],
  providers: [VitalSignsService],
  controllers: [VitalSignsController],
  exports: [VitalSignsService]
})
export class VitalSignsModule {}
