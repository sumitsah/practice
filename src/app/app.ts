import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Filter } from "./filter/filter";
import { Header } from './header/header';

interface CartItem {
  id: number,
  name: string,
  qty: number
}

/* 
two way binding using model() signal
https://stackblitz.com/edit/model-input-deborahk?file=src%2Fsnacks%2Fsnack.service.ts

output
https://stackblitz.com/edit/output-deborahk?file=package.json

procedural Approach for selecting multilist
https://stackblitz.com/~/edit/sync-select-procedural-deborahk

using Subjects Approach for selecting multilist
https://stackblitz.com/~/edit/sync-select-subject-deborahk?file=package.json

using effect() Approach for selecting multilist
https://stackblitz.com/~/edit/sync-select-effect-deborahk?file=package.json

httpREsource first look
https://stackblitz.com/~/edit/httpresource-first-look-deborahk?file=package.json

Debouncing in signal when using resource 
https://stackblitz.com/~/edit/httpresource-debouncing-deborahk?file=package.json

return httpResource from a method
https://stackblitz.com/~/edit/httpresource-return-from-method-deborahk?file=package.json
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, Header],
  // changeDetection: ChangeDetectionStrategy.Eager
})
export class App {

}
