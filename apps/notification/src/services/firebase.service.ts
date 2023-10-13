import { Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';

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
    notification: Notification,
  ) {
    await firebase.messaging().sendEachForMulticast({
      tokens: tokens,
      notification: notification,
    });
  }

  public async sendSingleNotification(
    token: string,
    notification: Notification,
  ) {
    await firebase.messaging().send({
      token: token,

      notification: {
        title: notification.title,
        body: notification.body,
      },
      android: {
        priority: 'high',
      },
    });
  }
}
