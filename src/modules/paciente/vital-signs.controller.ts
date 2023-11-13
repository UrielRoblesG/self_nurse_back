import { Controller, Body, Post, Get, Req, Res, Logger } from '@nestjs/common';
import { VitalSignsService } from './vital-signs.service';
import { VitalSignsAlertDto } from './dto/vital-signs-alert.dto';

@Controller('api/vital-signs')
export class VitalSignsController {

  private readonly _logger = new Logger(VitalSignsController.name);
  
  constructor(private readonly vitalSignsService: VitalSignsService) {}
  
  @Post('vitalsigns/by-users')
  async findByUserIds(@Body('userIds') userIds: number[]) {
    return await this.vitalSignsService.findByUserIds(userIds);
  }


  @Get('getVitalSignsAlert') 
  async getVitalSignsAlert(@Req() req : Request, @Res() res : Response, @Body() body : VitalSignsAlertDto)  {
    this._logger.debug(body);  
  } 
}
