import { Component, ComponentRef, inject, Renderer2, viewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponent } from './dynamic-component/dynamic-component';

@Component({
  selector: 'app-dynamic-comp-container',
  templateUrl: './dynamic-comp-container.html',
  styleUrl: './dynamic-comp-container.css',
})

export class DynamicCompContainer {

  // Inject Renderer2 for safe native style manipulation
  private renderer = inject(Renderer2);

  // Get a programmatic handle on the anchor template container
  private anchor = viewChild('alertAnchor', { read: ViewContainerRef });

  // Store a reference to the active dynamic component instance
  private dynamicComponentRef!: ComponentRef<DynamicComponent> | undefined;

  createComponent() {
    const container = this.anchor();

    // Clear any previously spawned instances so they don't pile up
    container?.clear();

    // 2. Instantiating the Component
    this.dynamicComponentRef = container?.createComponent(DynamicComponent);

    // 3. Passing Data Input
    // Setting properties triggers the internal change detection cycle natively
    this.dynamicComponentRef?.setInput('title', 'System Warning');
    this.dynamicComponentRef?.setInput('message', 'Your dynamic session token is expiring soon.');

    // 4. Listening to Emitted Events (Outputs)
    // The instance exposed via the Ref is an active RxJS observable stream
    this.dynamicComponentRef?.instance.dismissed.subscribe(() => {
      console.log('Event caught in parent!');
      this.destroyAlert();
    });

    // 5. Applying Custom Styles or Classes Programmatically
    // Always use the underlying .location.nativeElement to grab the HTML wrapper node
    const nativeElement = this.dynamicComponentRef?.location.nativeElement;
    // 1. Essential structural layout context
    /* this.renderer.addClass(nativeElement, 'block');
    this.renderer.addClass(nativeElement, 'mt-4');
    this.renderer.addClass(nativeElement, 'p-4'); // Adds padding inside the border box
    this.renderer.addClass(nativeElement, 'max-w-md'); // Keeps box constrained
    this.renderer.addClass(nativeElement, 'rounded-md'); // Rounds the corners nicely

    // 2. Explicit border and background paintings
    this.renderer.setStyle(nativeElement, 'borderStyle', 'solid');
    this.renderer.setStyle(nativeElement, 'borderWidth', '2px');
    this.renderer.setStyle(nativeElement, 'borderColor', '#f59e0b');
    this.renderer.setStyle(nativeElement, 'display', 'block');
    this.renderer.setStyle(nativeElement, 'backgroundColor', '#fffbeb'); */


    // Now these addClass lines will work perfectly because the CSS rules exist!
    this.renderer.addClass(nativeElement, 'block');
    this.renderer.addClass(nativeElement, 'mt-4');
    this.renderer.addClass(nativeElement, 'p-4');
    this.renderer.addClass(nativeElement, 'border-2');
    this.renderer.addClass(nativeElement, 'border-solid');
    this.renderer.addClass(nativeElement, 'border-amber-500');
    this.renderer.addClass(nativeElement, 'bg-amber-50');
    this.renderer.addClass(nativeElement, 'max-w-md');
    this.renderer.addClass(nativeElement, 'rounded-md');

  }

  // 6. Destroying the Component Cleanly
  destroyAlert() {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef?.destroy();
      this.dynamicComponentRef = undefined;
    }
  }
}
