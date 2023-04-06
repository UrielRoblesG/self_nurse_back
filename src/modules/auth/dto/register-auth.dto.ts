import { IUser } from 'src/common/interfaces/interface.user';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterAuthDto implements IUser {
  id?: number;

  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  secondLastName: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
  @IsNotEmpty()
  type: number;
}
