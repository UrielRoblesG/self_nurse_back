import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { IUser } from 'src/common/interfaces/interface.user';

export class CreateUserDto implements IUser {
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  secondLastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsInt()
  type: number;

  @ApiProperty()
  @IsNotEmpty()
  patient?: any;

  @ApiProperty()
  @IsNotEmpty()
  caregiver?: any;

  @ApiProperty()
  @IsNotEmpty()
  doctor?: any;
}
