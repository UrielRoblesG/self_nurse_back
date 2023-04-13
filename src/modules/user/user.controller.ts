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

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger();

  constructor(private readonly userService: UserService) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
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
