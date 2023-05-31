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
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger();

  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      const resp = await this.userService.create(createUserDto);

      return res.status(HttpStatus.OK).json({
        msg: 'Operación exitosa',
        data: resp,
      });
    } catch (error) {
      this.logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ msg: 'Error: contracte con el administrador' });
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Roles(Role.Caregiver, Role.Doctor, Role.Patient, Role.Admin)
  @Get('/token/:token')
  async findOneByToken(
    @Param('token') token: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const payload = req['user'];
      const user = await this.userService.findOneById(payload.id);

      return res.status(HttpStatus.OK).send({
        msg: 'Operacion exitosa',
        user: user,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: 'Error al obtener usuario',
        codigo: 400,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number) {
    try {
      const resp = await this.userService.remove(id);
      if (!resp) {
        return res.status(400).json({ msg: 'Operación invalida' });
      }
      return res.status(200).json({ msg: 'Operación exitosa' });
    } catch (error) {
      this.logger.error(`Error delete user: ${error}`);
    }
  }
}
