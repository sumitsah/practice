import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-observe',
  imports: [],
  templateUrl: './observe.html',
  styleUrl: './observe.css',
})

/* 
Cold observables start to emit values only when we subscribe to them. Hot onnes emit always.

For hot observable data source is creatd and activated otside of observable. For cold one - inside
*/
export class Observe implements OnInit {
  ngOnInit(): void {
    // const obs$ = of(null).pipe(map(() => Math.random()));

    const obs$ = fromTimestampCold();
    const obsHot$ = fromTimestampHot();

    console.log('Different values for all the subscriber. Every new subscriber creates saparate execution context')
    console.log('they are unicasted because they are sharing execution')
    obs$.subscribe({
      next: (value) => console.log(value)
    })
    obs$.subscribe(console.log)
    obs$.subscribe(console.log)

    // Hot
    obsHot$.subscribe({
      next: (value) => console.log(value)
    })
    obsHot$.subscribe(console.log)
    obsHot$.subscribe(console.log)
  }
}

// Note: Data source is created inside the observable  const timestamp = Date.now();

const fromTimestampCold = (): Observable<number> => {
  return new Observable((subscriber) => {
    const timestamp = Date.now();
    subscriber.next(timestamp);
  })
}

const fromTimestampHot = (): Observable<number> => {
  const timestamp = Date.now();
  return new Observable((subscriber) => {
    subscriber.next(timestamp);
  })
}
