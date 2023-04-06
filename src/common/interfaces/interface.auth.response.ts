import { IUser } from './interface.user';

export interface IAuthRespose {
  msg?: string;
  token: string;
  user: IUser;
}
