import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { HttpStatus } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger();

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Res() res: Response, @Body() loginAuthDto: LoginAuthDto) {
    try {
      const resp = await this.authService.login(loginAuthDto);

      return res.json(resp);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  @Public()
  @Post('/register')
  async register(
    @Res() res: Response,
    @Body() registerAuthDto: RegisterAuthDto,
  ) {
    try {
      const resp = await this.authService.register(registerAuthDto);

      return res.json(resp);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  @Post('/logout')
  // @Roles(Role.Admin, Role.Patient, Role.Doctor, Role.Caregiver)
  @UseGuards(AuthGuard)
  async logout(@Res() res: Response, @Req() req: Request) {
    try {
      const { user } = req;
      await this.authService.logout(user);

      return res.status(HttpStatus.OK).json({ msg: 'Operación exitosa' });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error });
    }
  }
}
