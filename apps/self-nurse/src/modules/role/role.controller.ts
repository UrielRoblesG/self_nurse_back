import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('api/role')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);
  constructor(private readonly roleService: RoleService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Public()
  @Get()
  async findRoles(@Res() res: Response) {
    try {
      const resp = await this.roleService.findAll();

      return res.status(HttpStatus.OK).json({
        msg: 'Operación exitosa',
        categorias: resp,
      });
    } catch (error) {
      this.logger.error(`Error getRoles ${error}`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: 'Error en el servidor',
      });
    }
  }

  @Get('admin')
  @Roles(Role.Admin)
  async findRolesAdmin(@Res() res: Response) {
    try {
      const resp = await this.roleService.findAllAdmin();

      return res.status(HttpStatus.OK).json({
        msg: 'Operación exitosa',
        categorias: resp,
      });
    } catch (error) {
      this.logger.error(`Error getRoles ${error}`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: 'Error en el servidor',
      });
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
