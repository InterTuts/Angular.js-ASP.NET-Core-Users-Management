// System Utils
import {
  Component,
  Input
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

// App Utils
import { DropdownComponent } from '../../../general/dropdown/dropdown.component';
import { UiDropdown } from '../../../models/ui.model';

// Configuration
@Component({
  selector: 'app-field-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownComponent
  ],
  templateUrl: './field-select.component.html'
})

// Logic
export class FieldSelectComponent {
  // Fields
  uniqueId!: string;

  // Input fields
  @Input() dropdownButton!: string;
  @Input() dropdownItems!: Array<UiDropdown>;
  @Input() control!: FormControl;

  callbackValue(option: string | number) {
    this.control.setValue(option);
  }

}
