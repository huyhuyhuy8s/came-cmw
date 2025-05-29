
import { NotificationSubject, Observer } from '@/lib/utils';

// Implementation of Observer Pattern
export class ToastObserver implements Observer {
  private showToast: (message: string) => void;

  constructor(showToast: (message: string) => void) {
    this.showToast = showToast;
  }

  update(data: any): void {
    this.showToast(data.message);
  }
}

export class ConsoleObserver implements Observer {
  update(data: any): void {
    console.log('Notification:', data);
  }
}

export class NotificationObserverService {
  private subject: NotificationSubject;

  constructor() {
    this.subject = new NotificationSubject();
  }

  addObserver(observer: Observer) {
    this.subject.attach(observer);
  }

  removeObserver(observer: Observer) {
    this.subject.detach(observer);
  }

  notify(data: any) {
    this.subject.notify(data);
  }
}

export const notificationObserverService = new NotificationObserverService();
