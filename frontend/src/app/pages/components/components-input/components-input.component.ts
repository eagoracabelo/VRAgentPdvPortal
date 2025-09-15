import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-input',
  templateUrl: './components-input.component.html',
  styleUrls: ['./components-input.component.scss'],
})
export class ComponentsInputComponent extends MarkdownCommon implements OnInit {
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const form = {
      text: [
        { value: null, disabled: false },
        [Validators.required, Validators.minLength(3)],
      ],
    } as unknown as FormGroup;
    this.formGroup = this.formBuilder.group(form);
  }
}
