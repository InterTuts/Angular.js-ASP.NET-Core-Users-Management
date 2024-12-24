// System Utils
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Configuration
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})

// Logic
export class AppComponent {
  title = 'web';
}
