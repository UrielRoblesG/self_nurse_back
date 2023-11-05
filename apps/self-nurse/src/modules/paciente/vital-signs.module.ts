import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSignsService } from './vital-signs.service';
import { VitalSignsController } from './vital-signs.controller';
import { VitalSignsEntity } from './entities/vital-signs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSignsEntity])],
  providers: [VitalSignsService],
  controllers: [VitalSignsController],
})
export class VitalSignsModule {}
