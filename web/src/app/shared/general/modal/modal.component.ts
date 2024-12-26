// System Utils
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// App Utils
import { ModalService } from '../../services/modal.service';

// Configuration
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})

// Logic
export class ModalComponent implements AfterViewInit {
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;
  modalStatus: string = '';
  modalSize: string = 'modal-md';

  constructor(
    private modalService: ModalService,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    if (typeof this.modalService.options !== 'undefined') {
      this.modalSize = this.modalService.options.size;
    }
  }

  closeModal(e: Event) {
    if ( e.target && !(e.target as Element).closest('.modal-container') ) {
      this.modalService.closeModal();
    }
  }

  handleKeydown(e: Event): void {
    if ( e.target && !(e.target as Element).closest('.modal-container') ) {
      this.modalService.closeModal();
    }
  }

  openModal() {
    this.modalStatus = 'modal-show';
  }

  removeModal() {
    this.modalStatus = 'modal-hide';

    setTimeout(() => {
      this.modalService.options = undefined;
      this.elementRef.nativeElement.remove();
      this.modalService.newModalComponent?.destroy();
    }, 200);
  }
}
