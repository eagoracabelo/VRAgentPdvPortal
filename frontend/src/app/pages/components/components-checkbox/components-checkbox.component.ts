import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MarkdownCommon } from '../../../shared/models/markdown.common';
import { FormValidations } from '../shared/form/forms-validations';

@Component({
  selector: 'vr-components-checkbox',
  templateUrl: './components-checkbox.component.html',
  styleUrls: ['./components-checkbox.component.scss'],
})
export class ComponentsCheckboxComponent
  extends MarkdownCommon
  implements OnInit
{
  formGroup!: FormGroup;

  electronics = [
    { name: 'TV', value: true },
    { name: 'DVD', value: false },
    { name: 'Computador', value: true },
  ];

  frameworks = ['Angular', 'React', 'Vue'];
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get formFrameworks(): FormArray {
    return this.formGroup.get('frameworks') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  getField(field: string): AbstractControl | null {
    return this.formGroup.get(field);
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      frameworks: this.buildFrameworks(),
    });
  }

  private buildFrameworks(): FormArray {
    const values = this.frameworks.map((_) => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinChebox());
  }
}
