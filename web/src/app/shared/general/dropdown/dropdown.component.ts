// System Utils
import {
  Component,
  HostListener,
  Input,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Installed Utils
import { TranslateModule } from '@ngx-translate/core';

// App Utils
import type { UiDropdown } from '../../models/ui.model';

// Configuration
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './dropdown.component.html',
})

// Logic
export class DropdownComponent {
  // Received data
  @Input() buttonText!: SafeHtml;
  @Input() dropdownItems!: Array<UiDropdown>;

  // Sent Data
  @Output() callbackValue = new EventEmitter<number | string>();

  // Dropdown Status
  dropdownStatus = 'false';

  // Inject Services
  constructor(private elementRef: ElementRef) {}

  // Events Handlers

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (
      typeof event !== 'undefined' &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.dropdownStatus = 'false';
    }
  }

  callback(event: Event, prop: string | number | undefined) {
    event.preventDefault();
    this.callbackValue.emit(prop);
  }

  // Other Methods

  toggleDropdown(event: MouseEvent) {
    event.preventDefault();

    // Change the dropdown status
    this.dropdownStatus = this.dropdownStatus === 'false' ? 'true' : 'false';

    // Check if the menu should be showed
    if (this.dropdownStatus === 'true') {
      // Wait until the menu is open
      setTimeout(() => {
        // Get menu
        const menu: Element =
          this.elementRef.nativeElement.getElementsByClassName(
            'dropdown-menu',
          )[0];

        // Get the menu height
        const height: number = menu.clientHeight;

        // Get dropdown
        const dropdown: Element =
          this.elementRef.nativeElement.getElementsByClassName(
            'dropdown',
          )[0];

        // Get dropdown position from top
        const dropdownTop: number = dropdown.getBoundingClientRect().top;

        // Calculate the height of the button
        const button_height: number =
          this.elementRef.nativeElement.offsetHeight;

        // Get the window height
        const windowHeight = window.innerHeight;

        // Verify if there is enough space for menu
        if (windowHeight - (dropdownTop + button_height + height + 10) > 14) {
          // Set transformation
          (menu as HTMLElement).style.marginTop = `15px`;
        } else {
          // Set transformation
          (menu as HTMLElement).style.marginTop =
            `-${button_height + height + 10}px`;
        }
      }, 100);
    }
  }
}
