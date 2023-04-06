import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
