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
  HttpStatus,
} from '@nestjs/common';
import { NurseService } from './nurse.service';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Logger } from '@nestjs/common';
import { Response } from 'express';
import { Response as Resp } from 'src/common/responses/response';
import { User } from 'src/models/user';

@ApiTags('Enfermero')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/nurse')
export class NurseController {
  private readonly _logger = new Logger(NurseController.name);

  constructor(private readonly nurseService: NurseService) {}

  @Get('/byPatient')
  async getByPatient(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req['user'];
      const nurse = await this.nurseService.getPatientNurse(user);

      if (nurse == null) {
        throw new Error('Paciente no tiene registrado un enfermer@');
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Exito', 'Operación exitosa', new User(nurse)));
    } catch (error) {
      this._logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new Response('Error', error));
    }
  }

  @Get('getPaciente')
  async findOne(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req['user'];

      const paciente = await this.nurseService.getPaciente(user);

      if (paciente == null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new Resp('Errro', 'Paciente no encontrado'));
      }
      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operación exitosa', paciente));
    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNurseDto: UpdateNurseDto) {
    return this.nurseService.update(+id, updateNurseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseService.remove(+id);
  }
}
