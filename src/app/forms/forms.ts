import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {
  // checkoutForm!: FormGroup;

  // ngOnInit() {
  //   this.checkoutForm = new FormGroup({
  //     deliveryMode: new FormControl('pickup', [Validators.required]),
  //     address: new FormControl('')
  //   })
  // }

  // 1. Inject modern type-safe Form Builder
  private fb = inject(NonNullableFormBuilder);

  ngOnInit() {
    this.trackDeliveryMode();
    console.log(this.checkoutForm)
  }

  // 2. Initialize Form Group Structure
  checkoutForm = this.fb.group({
    deliveryMode: ['pickup', [Validators.required]],   // new FormControl('pickup', [Validators.required]),
    deliveryAddress: [''] // Starts optional
  });


  get deliveryModeControl(): FormControl<string | null> {
    return this.checkoutForm.controls['deliveryMode']
  }

  get addressControl(): FormControl<string> {
    // return this.checkoutForm.controls.deliveryAddress
    return this.checkoutForm.get('deliveryAddress') as FormControl<string>
  }

  private trackDeliveryMode() {
    console.log('trackDeliveryMode == ')
    this.deliveryModeControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(mode => {
      console.log(mode)
      this.updateAddressCtrl(mode || '')
    })
  }

  private updateAddressCtrl(mode: string) {
    const addctrl = this.addressControl;
    console.log('validators set ')
    if (mode === 'delivery') {
      console.log('validators set ')
      addctrl.setValidators([Validators.required, Validators.minLength(10)])
    } else {
      addctrl.clearValidators()
    }

    addctrl.updateValueAndValidity()
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log(' Form Submitted !!!')
    } else {
      this.checkoutForm.markAllAsTouched(); // Trigger validation styles visually
    }

  }
}
