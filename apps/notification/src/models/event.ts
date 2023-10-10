import { INotification } from './notification.interface';

export class Event implements INotification {
  title: string;
  notification: string;
  imageUrl?: string;
  type: number;
}
