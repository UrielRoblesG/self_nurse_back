import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Logger } from '@nestjs/common';
import { Response } from 'src/common/responses/response';

@ApiTags('Evento')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('api/evento')
export class EventoController {
  private readonly log = new Logger();
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  async create(@Body() createEventoDto: CreateEventoDto) {
    try {
      const resp = await this.eventoService.create(createEventoDto);

      return resp;
    } catch (e) {
      this.log.error(e);
    }
  }

  @Get()
  findAll() {
    return this.eventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventoService.update(+id, updateEventoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const resp = await this.eventoService.remove(id);

      if (resp != null) {
        return new Response('Ok', 'Operación exitosa');
      }
    } catch (error) {
      return new Response('Error', error);
    }
  }
}
