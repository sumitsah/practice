import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { DYNAMIC_FORM_JSON, FormFieldMetadata } from '../model';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  // 1. Hold the raw configuration configuration map safely
  formConfig: FormFieldMetadata[] = DYNAMIC_FORM_JSON;

  // 2. Uninitialized master form tracker container
  dynamicForm!: FormGroup;

  ngOnInit() {
    this.createFormFromSchema();
  }

  private createFormFromSchema(): void {
    const formControlsGroup: { [key: string]: any } = {};

    this.formConfig.forEach(field => {
      const activeValidators: ValidatorFn[] = [];

      // Map JSON constraint configuration flags directly to Angular Core Validators
      if (field.required) {
        // Use true-value validator if dealing with boolean checkboxes
        activeValidators.push(field.type === 'checkbox' ? Validators.requiredTrue : Validators.required);
      }
      if (field.minLength) {
        activeValidators.push(Validators.minLength(field.minLength));
      }

      // Instantiate a distinct FormControl instance matching the JSON properties
      // formControlsGroup[field.key] = new FormControl(field.value ?? '', activeValidators);
      formControlsGroup[field.key] = [field.value ?? '', activeValidators];
      // console.log(formControlsGroup)
    });

    // Consolidate control pointers straight into a single reactive master group
    this.dynamicForm = this.fb.group(formControlsGroup);
  }

  // Helper method for template cleaner readability
  getControl(key: string): FormControl {
    return this.dynamicForm.get(key) as FormControl;
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      console.log('JSON Form Payload Transmitted Successfully:', this.dynamicForm.value);
    } else {
      this.dynamicForm.markAllAsTouched();
    }
  }
}
