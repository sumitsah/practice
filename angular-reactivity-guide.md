# Angular Reactivity and Change Detection Guide

## 1. Difference Between Signal `set()` and `update()`

In Angular, the primary difference is that **`set()` completely replaces a signal's value with a brand-new one, while `update()` modifies the value by computing it from the current state using a callback function.**

### Summary Comparison

| Feature | `set()` | `update()` |
| :--- | :--- | :--- |
| **Primary Purpose** | **Overwriting** the current state | **Transforming** the current state |
| **Argument Type** | A direct value (e.g., `3`, `'John'`) | A callback function (e.g., `prev => prev + 1`) |
| **State Dependency** | Independent of the previous value | **Dependent** on the previous value |
| **Race Conditions** | Vulnerable to stale data in async loops | **Safe and atomic** for rapid sequential updates |

### The `set()` Method
Use `set()` when you already have the final value and want to overwrite the signal completely, without caring about what was stored inside it previously.

```typescript
const user = signal('Alice');

// Overwrites 'Alice' with 'Bob'
user.set('Bob'); 
```

### The `update()` Method
Use `update()` when the next value depends heavily on the previous value (like toggling a boolean, incrementing a counter, or appending to an array). Angular passes the current value into your callback function automatically.

```typescript
const count = signal(0);

// Reads 0, adds 1, sets value to 1
count.update(currentValue => currentValue + 1); 
```

### Why not just use `set(count() + 1)`?
While `count.set(count() + 1)` technically works, it forces you to read the signal immediately before setting it. If multiple asynchronous operations try to modify the signal at the same time, `set()` can fall into **stale state bugs** where one operation accidentally overwrites another. `update()` guarantees that the computation always receives the absolute latest, atomic snapshot of the state.

---

## 2. Computed Signals and Effects

### What It Is and Its Usage
A **computed signal** is a reactive value that is derived from other signals. It is introduced to handle synchronous, side-effect-free state transformations automatically and efficiently. It creates a new, read-only signal by combining, filtering, or transforming one or more existing signals. 

```typescript
const count = signal(5);

// Computed signal: automatically multiplies count by 2
const doubleCount = computed(() => count() * 2); 

console.log(doubleCount()); // Outputs: 10
```
Whenever `count` changes, Angular knows that `doubleCount` needs to be updated. You cannot manually call `.set()` or `.update()` on a computed signal; it is strictly **read-only**.

### Why It Was Introduced
Before signals, Angular relied on **Zone.js** to detect changes. Zone.js intercepted every browser event (clicks, timers, HTTP requests) and checked the entire component tree for changes. This was computationally expensive.

Computed signals were introduced to provide:
* **Glitch-Free Execution:** They prevent temporary, inconsistent states during complex state updates.
* **Lazy Evaluation:** The derivation function *only* runs when someone actually reads the computed signal's value. If the value isn't rendered on screen or read in code, no CPU cycles are wasted.
* **Caching (Memoization):** If the underlying signals haven't changed, reading the computed signal returns the cached value instantly without re-running the function.

### When to Use It
Use `computed()` whenever you need to **calculate a value that depends on other reactive states**. 

* **Filtering lists:** E.g., showing only active users from a `users` signal list based on a `searchTerm` signal.
* **Formatting strings:** E.g., combining a `firstName` and `lastName` signal into a `fullName` computed signal.
* **Math operations:** E.g., calculating a shopping cart total from an array of products.

### How It Differs From `effect`

| Feature | `computed()` | `effect()` |
| :--- | :--- | :--- |
| **Primary Goal** | **Derive a value** from other signals | Run **outside code/side-effects** when signals change |
| **Returns** | A new read-only Signal | Nothing (`void`) |
| **Evaluation** | **Lazy** (runs only when read) | **Eager** (runs automatically when dependencies change) |
| **Value Caching** | Yes (memoized) | No |
| **Write Operations**| Prohibited (cannot change state inside) | Allowed (can call APIs, log, or manipulate DOM) |

### Why Can't We Just Use `effect`?
While you *could* technically write an effect to manually update a second signal whenever a first signal changes, doing so introduces significant architectural and performance flaws:

1. **State Overlapping and Infinite Loops:** Writing to signals inside an effect easily triggers cascading updates or infinite loops. Angular explicitly blocks writing to signals inside effects by default to prevent this.
2. **Wasted Memory and CPU:** Effects run eagerly. If you use an effect to calculate a value that isn't currently visible on the screen, you are wasting processing power. `computed()` safely waits until the value is actually needed.
3. **Boilerplate Code:** Using `effect` forces you to manage two separate reactive nodes (the trigger and the destination variable). `computed()` neatly packages the dependency and the resulting value into one single, clean declaration.

---

## 3. Linked Signals

A **`linkedSignal`** acts as a hybrid. It **automatically derives its default value from a source signal, but unlike a computed signal, it remains fully writable**. 

### Why It Was Introduced
Before `linkedSignal`, developers struggled with a common UI pattern: **local state that depends on an external input, but needs to be overridden or reset locally**. 

To handle this previously, developers had to use `effect()` or `ngOnChanges` to manually reset a standard `signal` whenever the source changed. This caused major architectural problems:
* **Boilerplate and clutter:** Writing manual tracking code for simple field resets.
* **Cascading Writes & Loops:** Writing to signals inside an `effect()` frequently triggers accidental infinite rendering loops.
* **Out-of-Sync Data:** If an effect ran late, the UI would briefly flash old, incorrect data.

`linkedSignal` solves this by handling the relationship declaratively and safely in a single node.

### When to Use It
Use `linkedSignal` when a value has a "dynamic default" that is dictated by another signal, but the user must be able to change it via UI interaction.

* **Resetting Forms on Selection Changes:** A user picks a product from a list, and a `quantity` field defaults to `1`. If they change the product, the quantity must automatically reset to `1`. However, they still need to manually change it to `2` or `3` using `+ / -` buttons.
* **Component Inputs with Overrides:** Passing a `theme` input into a text-editor component, but allowing the user to click a button to toggle local dark mode independently.

### If We Have Computed Signals, Why `linkedSignal`?
The core difference boils down to **writability** and **historical context**. A `computed` signal represents strict, immutable data projection. A `linkedSignal` represents temporary, stateful overrides.

#### 1. The Writability Difference
* **`computed()` is Read-Only:** You cannot call `.set()` or `.update()` on it. If your UI needs to modify the value directly, `computed` will crash.
* **`linkedSignal()` is Writable:** It exposes `.set()` and `.update()`. You can overwrite its value anytime. The moment the *underlying source* changes again, it discards the manual override and re-computes the default value.

#### 2. Access to Previous State
A `linkedSignal` can track what its value *used* to be before an update, allowing for smart transition logic. `computed` has no memory of its historical values.

#### Quick Code Comparison

##### The `computed` Approach (Strict/Read-Only)
```typescript
shippingOptions = signal(['Standard', 'Express']);
// Always forced to be the first option. Cannot be changed by user selection.
selectedOption = computed(() => this.shippingOptions()); 
```

##### The `linkedSignal` Approach (Reactive Default + Writable Override)
```typescript
shippingOptions = signal(['Standard', 'Express']);

// Defaults to index 0, but can be updated later!
selectedOption = linkedSignal(() => this.shippingOptions()); 

// When the user clicks a different option in the UI:
onSelectOption(index: number) {
  this.selectedOption.set(this.shippingOptions()[index]); // Valid!
}
```
If `shippingOptions` changes entirely (e.g., loading a different country's courier choices), the `linkedSignal` automatically throws away the manual selection and resets cleanly to index `0` of the new list.

---

## 4. Change Detection in Zoneless Angular

In **Zoneless Angular**, change detection no longer relies on Zone.js to auto-detect browser macro/microtasks (like `setTimeout` or HTTP responses) and refresh the entire application tree. Instead, Angular uses an **explicit scheduler** that relies on native browser APIs (like `requestAnimationFrame`) to check components only when it is explicitly notified that a change occurred. 

Furthermore, **OnPush is the default change detection strategy**, meaning Angular will only check components that are explicitly flagged as dirty.

### When Does It Update Signals vs. Normal Variables?

#### 1. Normal Variables (Standard Class Properties)
A normal JavaScript variable (e.g., `count = 0;`) is not reactive. Angular has no runtime visibility into when its value changes in memory. 

Angular will **only** update a normal variable in the UI if **another native framework trigger forces a change detection cycle**:
* **DOM Event Listeners:** If you mutate a normal variable inside a template-bound event handler (like `(click)="increment()"`), Angular tracks the user interaction, flags the component as dirty, and schedules a render.
* **Component Input Changes:** If a parent component pushes a brand new object reference or primitive value into an `@Input()`, change detection runs on that component.
* **The `async` Pipe:** If you pass an Observable through `| async` in the template, the pipe internally calls `ChangeDetectorRef.markForCheck()`, scheduling a UI refresh.

**Where normal variables completely fail in Zoneless:** If a normal variable is updated inside an asynchronous task that Angular doesn't manage natively—such as a manual RxJS `.subscribe()`, a `setTimeout()`, a `setInterval()`, or a native `fetch()` callback—**the UI will never update**. You would be forced to manually inject `ChangeDetectorRef` and call `.markForCheck()`.

#### 2. Signals
Signals provide **fine-grained, direct notifications** to the Angular scheduler. 

* When a template reads a signal (e.g., `{{ count() }}`), Angular registers that component's view as a dependent consumer of that signal.
* The moment you call `.set()` or `.update()` on that signal, it instantly **notifies the Angular scheduler**.
* Angular flags that exact view as dirty and schedules a change detection tick.

Because of this built-in notification engine, **signals will update the UI flawlessly anywhere they are changed**, whether inside a click handler, a `setInterval()`, a manual RxJS subscription, or an asynchronous HTTP response.

### Direct Technical Comparison

| Scenario | Normal Variable (`count = 0`) | Signal (`count = signal(0)`) |
| :--- | :--- | :--- |
| **Updated inside `(click)` event** | **Updates UI** (The click event itself schedules change detection) | **Updates UI** (The signal schedules change detection) |
| **Updated inside `setTimeout()`** | ❌ **Breaks UI** (Angular does not know the variable changed) | **Updates UI** (The `.set()` function directly notifies the scheduler) |
| **Updated inside manual `.subscribe()`** | ❌ **Breaks UI** (No Zone.js means async boundaries block updates) | **Updates UI** (Fully safe inside asynchronous streams) |
| **Framework Overhead** | Higher (Angular must check your entire object bindings to spot changes) | Extremely Low (Angular knows exactly which binding changed) |

### Practical Code Illustration

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-demo',
  template: `
    <p>Normal counter: {{ normalCount }}</p>
    <p>Signal counter: {{ signalCount() }}</p>
    <button (click)="triggerAsyncUpdates()">Start Async Tasks</button>
  `
})
export class DemoComponent {
  normalCount = 0;
  signalCount = signal(0);

  triggerAsyncUpdates() {
    // ASYNC TASK
    setTimeout(() => {
      this.normalCount++; // ❌ Updates in memory, but UI STAYS STALE
      this.signalCount.update(c => c + 1); //  UI UPDATES INSTANTLY!
    }, 1000);
  }
}
```

---

## 5. Framework Overhead: Deep Dive into Object Bindings

When you use a normal variable inside a template (e.g., `{{ user.name }}`), Angular has no way of knowing exactly *what* changed within that object. To guarantee the UI stays accurate, it must run a process called **Dirty Checking**. 

### The Architecture: How Angular Checks Normal Variables

Because plain JavaScript variables do not emit events when they change, Angular must manually compare the old value against the new value every single time change detection runs.

1. **The Initial Render:** Angular evaluates `{{ user.name }}` and stores the result (e.g., `"Alice"`) in a hidden internal memory record called a **binding**.
2. **The Event Trigger:** A user clicks a button, which triggers a change detection cycle.
3. **The Comparison Loop:** Angular loops through every single binding in that component's template, re-evaluates the JavaScript expression, and compares it to the stored record:
   * Is `currentRuntimeValue` strict-equal (`===`) to `previousStoredValue`?
4. **The DOM Update:** If they match, Angular skips it. If they don't match (e.g., `"Alice"` is now `"Bob"`), Angular updates the DOM and overwrites its internal memory record with the new value.

### The Overhead Problem: Why This Scales Poorly

The overhead comes from **work multiplication**. If you have a component displaying a large dashboard, table, or user profile, the framework wastes CPU cycles checking properties that haven't even changed.

* **Re-evaluating Everything:** If you have 50 normal variables bound to a template and you update just **one** of them, Angular must still re-evaluate and check all **50 expressions** during that cycle to make sure nothing else changed.
* **Component-Level Scope:** In Zoneless mode, when a normal variable changes via a click event, Angular flags the *entire component view* as dirty. It must traverse and re-check every single HTML binding inside that specific component template from top to bottom.
* **Deep Object Traversal:** If your template references nested properties like `{{ order.delivery.address.city }}`, Angular must safely navigate that entire object path on every single change detection tick just to see if the string changed.

### How Signals Eliminate This Overhead

Signals completely eliminate the need for Angular to guess or double-check your data. They change the architecture from **"pull and compare"** to **"push and notify."**

```typescript
// Angular doesn't know when this changes until it checks everything
user = { name: 'Alice' }; 

// This object actively tells Angular precisely when it changes
userSignal = signal({ name: 'Alice' }); 
```

1. **Dependency Tracking:** When Angular initially reads `{{ userSignal().name }}` in the template, the signal adds that specific HTML block to its private list of "subscribers" (consumers).
2. **Direct Notification:** The moment you run `userSignal.set({ name: 'Bob' })`, the signal directly messages the Angular scheduler. It says: *"Hey, I just changed, and Component X is rendering me."*
3. **Targeted Updates:** Angular does not need to run a loop to scan your other 49 variables or re-evaluate unchanged properties. It knows exactly which component node is dirty based entirely on the signal's message, bypassing structural guesswork entirely.