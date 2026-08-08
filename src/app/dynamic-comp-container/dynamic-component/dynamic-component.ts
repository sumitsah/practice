import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dynamic-component',
  imports: [],
  templateUrl: './dynamic-component.html',
  styleUrl: './dynamic-component.css',
})
export class DynamicComponent {
  // 1. Define inputs (using modern Angular 19 Signal inputs)
  title = input<string>('Alert');
  message = input<string>('');

  // 2. Define outputs (using modern Angular output)
  dismissed = output<void>();

  onClose() {
    this.dismissed.emit();
  }
}
