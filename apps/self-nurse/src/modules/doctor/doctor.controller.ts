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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Response as Resp } from '../../common/responses/response';

@ApiTags('Doctor')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/doctor/')
export class DoctorController {
  private readonly _logger = new Logger(DoctorController.name);

  constructor(private readonly doctorService: DoctorService) {}

  @Get('obtenerPacientes')
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const doctor = req['user'];
      const pacientes = await this.doctorService.findAll(doctor);

      if (pacientes.length == 0) {
        return res
          .status(HttpStatus.NO_CONTENT)
          .json(new Resp('Empty', 'Sin registros'));
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operación exitosa', pacientes));
    } catch (error) {
      this._logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }
}
