import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Response as Resp } from '../../common/responses/response';
import { User } from '../../models/user';

@ApiTags('Paciente')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/paciente')
export class PacienteController {
  private readonly _logger = new Logger(PacienteController.name);
  constructor(private readonly pacienteService: PacienteService) {}

  @Get('getDoctor')
  async getDoctorByPatientToken(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req['user'];

      const response = await this.pacienteService.findDoctor(user);

      if (response == null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new Resp('Sin doctor', 'Aun no tienes un doctor registrado'));
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operacion exitosa', new User(response)));
    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
  }

  @Get('cuidadorByIdPaciente/:id')
  async getNurseByIdPaciente(@Param('id') id: number, @Res() res: Response) {
    try {
      const nurse = await this.pacienteService.findPatientNurse(id);

      if (nurse == null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new Resp('Error', 'Enfermer@ no encontrado'));
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operación exitosa', new User(nurse)));
    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
  }

  @Patch('actualizarHistorialMedico')
  async update(
    @Body() updatePacienteDto: UpdatePacienteDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const user = req['user'];

      const response = await this.pacienteService.updateHistorialMedico(updatePacienteDto, user);
      
      if (!response) {
        return res.status(HttpStatus.NOT_FOUND).json(new Resp('Error', 'Error al actualizar historial medico'));
      }

      return res.status(HttpStatus.OK).json(new Resp('Ok','Operación exitosa'));
    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
  }
}
