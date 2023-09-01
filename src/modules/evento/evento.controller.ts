import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Response as Resp } from 'src/common/responses/response';
import { Evento } from 'src/models';

@ApiTags('Evento')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('api/evento')
export class EventoController {
  private readonly log = new Logger(EventoController.name);
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createEventoDto: CreateEventoDto,
  ) {
    try {
      const user = req['user'];
      const evento = await this.eventoService.create(createEventoDto, user);

      if (evento == null) {
        throw new Error('Error al crear el evento');
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operación exitosa', new Evento(evento)));
    } catch (e) {
      this.log.error(e);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', e));
    }
  }

  @Get('/findEventByDate/:date')
  async findAllEvents(
    @Res() res: Response,
    @Req() req: Request,
    @Param('date') date: Date,
  ) {
    try {
      const user = req['user'];

      const eventos = await this.eventoService.findAllEvents(user, date);

      if (eventos.length <= 0) {
        return res
          .status(HttpStatus.NO_CONTENT)
          .json(new Resp('Ok', 'No hay eventos'));
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operacion exitosa', eventos));
    } catch (error) {
      this.log.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new Resp('Ok', 'Error en la solicitud'));
    }
  }

  @Get('/findNurseEventByDate/:id/:day')
  async findNurseEventByDate(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('day') day: Date,
  ) {
    try {
      const eventos = await this.eventoService.findAllNurseEvents(
        Number.parseInt(id),
        day,
      );

      if (eventos.length <= 0) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new Resp('Ok', 'No hay eventos'));
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operación exitosa', eventos));
    } catch (error) {
      this.log.error(error);

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new Resp('Ok', 'Operación exitosa'));
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number) {
    try {
      const resp = await this.eventoService.remove(id);

      if (resp == null) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new Resp('Error', 'Error al eliminar el evento'));
      }

      return res
        .status(HttpStatus.OK)
        .json(new Resp('Ok', 'Operacion exitosa'));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new Resp('Error', 'Error'));
    }
  }
}
