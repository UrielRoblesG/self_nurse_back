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
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../../models/user';
import { Response as Resp } from '../../common/responses/response';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

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
      if (user == null) {
        throw new Error('No se pudo obtener el usuario');
      }
      const userResponse = new User(user);
      return res.status(HttpStatus.OK).send({
        msg: 'Operacion exitosa',
        user: userResponse,
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
  update(
    @Res() res: Response,
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      // TODO: Terminar esto
    } catch (error) {
      this.logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json(new Resp('Error', error));
    }
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
