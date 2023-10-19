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

  constructor(titulo: string, body: string, data?: any) {
    this.title = titulo;
    this.body = body;
    this.data = data;
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
