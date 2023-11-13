import { Controller, Body, Post,UseGuards } from '@nestjs/common';
import { VitalSignsService } from './vital-signs.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/vitalsigns/') 
export class VitalSignsController {
  constructor(private readonly vitalSignsService: VitalSignsService) {}
  
  @Post('by-users')
  async findByUserIds(@Body('userIds') userIds: number[]) {
    return await this.vitalSignsService.findByUserIds(userIds);
  }
}
