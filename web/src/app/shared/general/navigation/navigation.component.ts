// System Utils
import {
  EventEmitter,
  Component,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

// Installed Utils
import { TranslateModule } from '@ngx-translate/core';

// Configuration
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})

// Logic
export class NavigationComponent implements OnChanges {
  // Received Data
  @Input() total!: number;
  @Input() page!: number;
  @Input() limit!: number;

  // Returned Data
  @Output() navigate = new EventEmitter<number>();

  // Pages Links container
  pages: number[] = [];

  ngOnChanges(changes: import('@angular/core').SimpleChanges) {

    // Monitor the changes for page and total
    if (changes['page'] || changes['total']) {

      // Calculate the number of pages divided by limit
      const totalPages = Math.ceil(this.total / this.limit);

      // Calculate start and end page numbers
      let startPage = Math.max(this.page - 2, 1);
      const endPage = Math.min(startPage + 4, totalPages);

      // Adjust startPage if we're at the end of the page range
      if (endPage === totalPages) {
        startPage = Math.max(endPage - 4, 1);
      }

      // Generate the array of page numbers
      this.pages = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

    }

  }

  onPageClick(event: MouseEvent, page: number) {
    event.preventDefault();
    this.navigate.emit(page);
  }
}
