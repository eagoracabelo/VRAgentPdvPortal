import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ITooltip } from '@vrsoftbr/vr-components';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

interface Gender {
  value: string;
  description: string;
}

@Component({
  selector: 'vr-components-radio-button',
  templateUrl: './components-radio-button.component.html',
  styleUrls: ['./components-radio-button.component.scss'],
})
export class ComponentsRadioButtonComponent
  extends MarkdownCommon
  implements OnInit
{
  formGroup!: FormGroup;
  place = 'Casa';
  genders: Gender[] = [
    { value: 'M', description: 'Masculino' },
    { value: 'F', description: 'Feminino' },
    { value: 'O', description: 'Outro' },
  ];

  tooltip: ITooltip = {
    message: ['Radio com Tooltip'],
  };
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  getField(field: string): AbstractControl | null {
    return this.formGroup.get(field);
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      gender: [null, Validators.required],
    });
  }
}
