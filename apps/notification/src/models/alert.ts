import { INotification } from './notification.interface';

export class Alert implements INotification {
  title: string;
  notification: string;
  imageUrl?: string;
  type: number;
}
