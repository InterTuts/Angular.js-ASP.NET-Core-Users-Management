// System Utils
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// App Utils
import { UtilsService } from '../../../services/utils.service';

// Configuration
@Component({
  selector: 'app-field-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './field-password.component.html',
})

// Logic
export class FieldPasswordComponent {
  // Fields
  uniqueId!: string;

  // Input fields
  @Input() placeholder!: string;
  @Input() control!: FormControl;

  constructor(private utilsService: UtilsService) {
    // Generate unique id
    this.uniqueId = this.utilsService.uniqueId();
  }
}
