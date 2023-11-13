import { Controller, Body, Post,UseGuards, Logger, Get, Req, Res } from '@nestjs/common';
import { VitalSignsService } from './vital-signs.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VitalSignsAlertDto } from './dto/vital-signs-alert.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/vitalsigns') 
export class VitalSignsController {

  private readonly _logger = new Logger(VitalSignsController.name);
  
  constructor(private readonly vitalSignsService: VitalSignsService) {}
  
  @Post('by-users')
  async findByUserIds(@Body('userIds') userIds: number[]) {
    return await this.vitalSignsService.findByUserIds(userIds);
  }


  @Get('getVitalSignsAlert') 
  async getVitalSignsAlert(@Req() req : Request, @Res() res : Response, @Body() body : VitalSignsAlertDto)  {
    this._logger.debug(body);  
  } 
}
