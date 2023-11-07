export class Notificacion implements Notification {
  body: string;
  data: any;
  dir: NotificationDirection;
  icon: string;
  lang: string;
  onclick: (this: Notification, ev: Event) => any;
  onclose: (this: Notification, ev: Event) => any;
  onerror: (this: Notification, ev: Event) => any;
  onshow: (this: Notification, ev: Event) => any;
  silent: boolean;
  tag: string;
  title: string;

  public constructor();
  public constructor(titulo: string, body: string, data?: any);

  public constructor(...args: any[]) {
    if (args.length == 3) {
      this.title = args[0];
      this.body = args[1];
      this.data = args[2];
    } else if (args.length == 2) {
      this.title = args[0];
      this.body = args[1];
    }
  }

  close(): void {
    throw new Error('Method not implemented.');
  }
  addEventListener<K extends keyof NotificationEventMap>(
    type: K,
    listener: (this: Notification, ev: NotificationEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error('Method not implemented.');
  }
  removeEventListener<K extends keyof NotificationEventMap>(
    type: K,
    listener: (this: Notification, ev: NotificationEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: unknown,
    listener: unknown,
    options?: unknown,
  ): void {
    throw new Error('Method not implemented.');
  }
  dispatchEvent(event: Event): boolean {
    throw new Error('Method not implemented.');
  }
}
