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
import { IJwtPayload } from 'src/common/interfaces/interface.jwt.payload';
import { Response as Resp } from 'src/common/responses/response';

@ApiTags('Autenticacion')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger();

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Res() res: Response, @Body() loginAuthDto: LoginAuthDto) {
    try {
      const resp = await this.authService.login(loginAuthDto);

      return res.status(HttpStatus.OK).json(resp);
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

      return res.status(HttpStatus.OK).json({ user: resp });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new Resp('Error', 'Error'));
    }
  }

  @Post('/logout')
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

  @Post()
  @UseGuards(AuthGuard)
  async getUser(@Res() res: Response, @Req() req: Request) {
    try {
      const data = req.user as IJwtPayload;
      const user = await this.authService.getUser(data.email);

      return res.status(HttpStatus.OK).json({
        msg: 'Operación exitosa',
        data: user,
      });
    } catch (error) {
      this.logger.error(error);

      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: 'Error en el servidor',
      });
    }
  }
}
