/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { PatientStatusService } from './patient.status.service';

@ApiTags('Estado Paciente')
@Controller('/api/patientStatus')
export class PatientStatusController {
  private readonly logger = new Logger(PatientStatusController.name);
  constructor(private readonly patientStatusService: PatientStatusService) {}

  @Get()
  @Public()
  async getStatus(@Res() res: Response) {
    try {
      const status = await this.patientStatusService.getAll();

      return res.status(HttpStatus.OK).json({
        msg: 'Operación exitosa',
        items: status,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: 'Error en la solicitud',
      });
    }
  }
}
