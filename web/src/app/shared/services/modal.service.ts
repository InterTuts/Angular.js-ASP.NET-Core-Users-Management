// System Utils
import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

// App Utils
import { ModalComponent } from '../general/modal/modal.component';
import { Modal } from '../models/modal.model';

// Configuration
@Injectable({
  providedIn: 'root',
})

// Logic
export class ModalService {
  newModalComponent!: ComponentRef<ModalComponent>;
  options: Modal | undefined;

  constructor(
    private applicationRef: ApplicationRef,
    private injector: EnvironmentInjector,
  ) {}

  // Method to open the modal
  showModal(
    newMemberTemplate: ViewContainerRef,
    modalView: TemplateRef<Element>
  ): void {
    // Clear previous views
    newMemberTemplate.clear();

    // Create an embedded view from the view
    const innerContent = newMemberTemplate.createEmbeddedView(modalView);

    // Change the modal content
    this.newModalComponent = newMemberTemplate.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });

    // Open modal
    this.newModalComponent.instance.openModal();
  }

  // Method to close the modal
  closeModal(): void {
    // Destroy the modal
    this.newModalComponent.instance.removeModal();
  }
}
