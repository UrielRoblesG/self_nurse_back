import { Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { INotification } from '../models/notification.interface';

export class FirebaseService {
  private readonly _logger = new Logger(FirebaseService.name);
  private static instance: FirebaseService;

  constructor() {
    const certPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'apps',
      'notification',
      'config',
      'push-notification-key.json',
    );
    this._logger.log(`CertPath: ${certPath}`);
    firebase.initializeApp({
      credential: firebase.credential.cert(certPath),
    });
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public async sendNotificationMulticast(
    tokens: string[],
    notification: INotification,
  ) {
    await firebase.messaging().sendEachForMulticast({
      tokens: tokens,
      notification: notification,
    });
  }
}
