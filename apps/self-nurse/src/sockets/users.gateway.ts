import { Logger, UseGuards, Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { AuthGuard } from '../modules/auth/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IConnectedUser } from '../common/interfaces/interface.connected.user';
import { IRegisterEvent } from '../common/interfaces/interface.register.event';
import { UserService } from '../modules/user/user.service';
import { DoctorService } from '../modules/doctor/doctor.service';
import { NurseService } from '../modules/nurse/nurse.service';
import { Socket } from 'socket.io';
import { User } from '../models/user';

@WebSocketGateway(80, { namespace: 'users' })
export class UsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly _logger = new Logger(UsersGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly doctorService: DoctorService,
    private readonly nurseService: NurseService,
  ) {}
  @WebSocketServer()
  server: any;

  @SubscribeMessage('registrar')
  async handleEvent(client: Socket, @MessageBody() data: IRegisterEvent) {
    const paciente = await this.userService.getPatientByCode(data.patientCode);
    if (paciente == null) return;

    const user = await this.userService.getUserByToken(data.userToken);

    if (user == null) return;

    let response: any;

    switch (user.idType) {
      case 2:
        response = await this.nurseService.registrarPaciente(user, paciente);
        this.server.to(paciente.id).emit('nurse_registrado', new User(user));
        break;
      case 3:
        response = await this.doctorService.vicularPacienteADoctor(
          user,
          paciente,
        );
        this.server.to(paciente.id).emit('doctor_registrado', new User(user));
        break;
    }
    // const resp = { ...response, type: user.idType, user: new User(paciente) };
    this.server.to(user.id).emit('paciente_registrado', response);
  }

  async handleConnection(client: any, ...args: any[]) {
    const token = client.handshake.headers['x-token'];
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      if (user.role == 'patient') {
        await this.userService.updatePatientStatus(user.id);
      }

      client.join(user.id);
      this._logger.log(`New user connected`);
    } catch (error) {
      this._logger.error(error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: any) {
    const token = client.handshake.headers['x-token'];
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      if (user.role == 'patient') {
        await this.userService.updatePatientStatus(user.id);
      }

      client.disconnect();
    } catch (error) {
      this._logger.error(error);
      client.disconnect();
    }
  }

  afterInit(server: any) {
    this._logger.log('Socket is live');
  }
}
