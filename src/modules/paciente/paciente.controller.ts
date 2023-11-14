import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Res,
  Logger,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Response as Resp } from '../../common/responses/response';
import { User } from '../../models/user';
import { VitalSignsAlertDto } from './dto/vital-signs-alert.dto';
import { UserService } from '../user/user.service';
import { Notificacion } from 'src/models/notificacion';
import { FirebaseService } from 'src/services/firebase.service';

@ApiTags('Paciente')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/paciente')
export class PacienteController {
  private readonly _logger = new Logger(PacienteController.name);
  constructor(private readonly pacienteService: PacienteService,
     private readonly userService : UserService,
      private readonly firebaseService : FirebaseService,) {}

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

  @Post('getVitalSignsAlert') 
  async getVitalSignsAlert(@Req() req : Request, @Res() res : Response, @Body() body : VitalSignsAlertDto)  {
    try {
      const user = req['user'];
      this._logger.debug(body);
      const userExist = await this. userService.findOneById(user['id']);

      if (userExist == null) {
        return res.status(HttpStatus.BAD_GATEWAY).json(new Resp('Error', 'Usuario no encontrado'));  
      }
    let notificacion = new Notificacion();
      if (body.type == 1) {
        notificacion.title = 'Ritmo cardiaco bajo';
        notificacion.body = `El ritmo cardiaco del paciente esta bajo: ${body.bpm} bpm.`;
      }
      else {
        notificacion.title = 'Temperatura alta';
        notificacion.body = `La temperatura del paciente esta aumentando: ${body.temperature} Cº.`;
      }
      await this.firebaseService.sendSingleNotification(userExist.deviceToken, notificacion)
      return res.status(HttpStatus.OK).json(new Resp('Ok', 'Operacion exitosa'));
    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_GATEWAY).json(new Resp('Error', error));
    }  
  }


  @Get('getMonthlyAlerts/:year/:mes')
  async getAlerts(@Res() res: Response, 
        @Req() req : Request, 
        @Param('year') year: number,
         @Param('mes') mes: number) {
    try {
      const user = req['user'];
      
      const alertas = await this.pacienteService.getMonthlyAlerts(user, mes, year);

      return res.status(Number.parseInt(alertas.status)).json(alertas);

    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
  }
}
