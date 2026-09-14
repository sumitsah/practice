import { Component, computed, effect, linkedSignal, signal, untracked } from '@angular/core';

@Component({
  selector: 'app-signal',
  imports: [],
  templateUrl: './signal.html',
  styleUrl: './signal.css',
})
export class Signal {
  protected readonly title = signal('practice');
  normalCounter = 0;
  signalCounter = signal(0);

  doubleCounter = computed(() => this.signalCounter() * 2)
  normalVar = {
    update: 'Without Zone'
  }
  user = signal({
    name: 'Sumit',
    age: 29
  })

  shippingOptions = signal(['Standard', 'Express']);

  // Defaults to index 0, but can be updated later!
  selectedOption = linkedSignal(() => this.shippingOptions());

  increment() {
    this.normalCounter++;
    // this.signalCounter.update(v => v + 1)
  }

  constructor() {
    effect((onCleanup) => {
      // this.signalCounter.update(v => v + 1) can not be run inside the effect signal.
      console.log(`effect ran `, this.signalCounter())
      // const v = this.signalCounter()
      // untracked(() => {
      //   if (v == 1) {
      //     this.signalCounter.update(v => v + 1)
      //     console.log(v)
      //   }
      // })
      onCleanup(() => console.log(`cleaning the memory`))

    })
  }


  ngOnInit() {
    // FOllowing code clears the fundamentals that normalVariable will not be updated (change detection) unless there is an event fired in the dom
    // but if signal is used in conjuction with normal variable the change detection cycle will trigger and 
    // normal variable will also get opportunity to update itself in the DOM.
    // setInterval(() => {
    //   // Mutate both every second
    //   this.normalCounter++;
    //   this.signalCounter.update(v => v + 1);

    //   console.log(`In memory -> Normal: ${this.normalCounter}, Signal: ${this.signalCounter()}`);
    // }, 1000);

    console.log(this.selectedOption())

    setTimeout(() => {

      this.user.update(u => ({
        ...u,
        age: 30
      }));
      // this.user.update(u => {
      //   u.age = 30;
      //   return u;
      // });
      console.dir(this.user())
    }, 2000);
    // this.user.update(u => {
    //   u.age = 30;
    //   return u;
    // });
    // this.user.update(u => ({
    //   ...u,
    //   age: 30
    // }));
  }

  // ngDoCheck() {
  //   console.log('Change detection has run..')
  // }

  changeAge() {
    this.normalVar.update = 'Zoneless';
    console.log(this.normalVar)
    // this.user.update(u => {
    //   u.age = 30;
    //   return u;
    // });
  }
}
