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
import { UtilsService } from '../../../services/utils.service';

// Configuration
@Component({
  selector: 'app-field-text',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './field-text.component.html',
  styleUrl: './field-text.component.scss'
})

// Logic
export class FieldTextComponent {
  // Fields
  uniqueId!: string;

  // Input fields
  @Input() placeholder!: string;
  @Input() disabled!: boolean;
  @Input() control!: FormControl;

  constructor(private utilsService: UtilsService) {
    // Generate unique id
    this.uniqueId = this.utilsService.uniqueId();
  }

}
