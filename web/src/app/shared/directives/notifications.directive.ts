/*
 * @directive Notifications
 *
 * @author Ruslan Sirbu
 * @version 0.0.1
 * @updated 2024-05-23
 *
 * This directive is used to display HTML notifications
 */

// System Utils
import { Directive, ElementRef } from '@angular/core';

// Configuration
@Directive({
  selector: '[appNotifications]',
  standalone: true,
})

// Logic
export class NotificationsDirective {
  // Inject services
  constructor(private elementRef: ElementRef) {}

  /**
   * Display notifications
   *
   * @param type for notification
   * @param text for notification
   */
  public showNotification(type: string, text: string) {
    // Create a new div
    const notification = document.createElement('div');

    // Set default class
    notification.classList.add('popup-notification');

    // Set status
    notification.classList.add(
      type === 'success'
        ? 'popup-notification-success'
        : 'popup-notification-error',
    );

    // Set notification text
    notification.innerText = text;

    // Append notification to the dom
    this.elementRef.nativeElement.appendChild(notification);

    // Remove the message
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}
