import { Controller, Body, Post } from '@nestjs/common';
import { VitalSignsService } from './vital-signs.service';

@Controller('vital-signs')
export class VitalSignsController {
  constructor(private readonly vitalSignsService: VitalSignsService) {}
  
  @Post('api/vitalsigns/by-users')
  async findByUserIds(@Body('userIds') userIds: number[]) {
    return await this.vitalSignsService.findByUserIds(userIds);
  }
}
