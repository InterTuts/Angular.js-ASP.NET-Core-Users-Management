// System Utils
import { ElementRef } from '@angular/core';

// App Utils
import { NotificationsDirective } from './notifications.directive';

describe('NotificationsDirective', () => {
  let directive: NotificationsDirective;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    mockElementRef = {
      nativeElement: document.createElement('div')
    };

    directive = new NotificationsDirective(mockElementRef);
  });

  it('should create a notification with success class and text', () => {
    const type = 'success';
    const text = 'Operation successful';

    directive.showNotification(type, text);

    const notification = mockElementRef.nativeElement.querySelector('.popup-notification');
    expect(notification).not.toBeNull();
    expect(notification.classList).toContain('popup-notification-success');
    expect(notification.innerText).toBe(text);
  });

  it('should create a notification with error class and text', () => {
    const type = 'error';
    const text = 'Operation failed';

    directive.showNotification(type, text);

    const notification = mockElementRef.nativeElement.querySelector('.popup-notification');
    expect(notification).not.toBeNull();
    expect(notification.classList).toContain('popup-notification-error');
    expect(notification.innerText).toBe(text);
  });

  it('should remove the notification after 2000ms', (done) => {
    const type = 'success';
    const text = 'This message will disappear';

    directive.showNotification(type, text);

    let notification = mockElementRef.nativeElement.querySelector('.popup-notification');
    expect(notification).not.toBeNull();

    setTimeout(() => {
      notification = mockElementRef.nativeElement.querySelector('.popup-notification');
      expect(notification).toBeNull();
      done();
    }, 2000);
  });
});
