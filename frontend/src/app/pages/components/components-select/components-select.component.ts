import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Select2Data, Select2UpdateEvent } from '@vrsoftbr/vr-components';

import { MarkdownCommon } from '../../../shared/models/markdown.common';
import { data1, data2, data3, data5 } from './select.data';

interface ISelectConfiguration {
  maxDisplayed: number;
  multiple: boolean;
  required: boolean;
  placeholder: string;
  isCheckbox: boolean;
  hasMainSelector: boolean;
  placeHolderSearch: string;
}

@Component({
  selector: 'vr-components-select',
  templateUrl: './components-select.component.html',
  styleUrls: ['./components-select.component.scss'],
})
export class ComponentsSelectComponent extends MarkdownCommon {
  multipleSelectionConfiguration: ISelectConfiguration = {
    maxDisplayed: 1,
    multiple: true,
    required: true,
    placeholder: 'Selecione',
    isCheckbox: true,
    hasMainSelector: true,
    placeHolderSearch: 'Buscar',
  };

  data1 = data1;
  data2 = data2;
  data3 = data3;
  data4 = JSON.parse(JSON.stringify(data1)) as Select2Data;
  data5 = data5;

  minCountForSearch = Infinity;

  ctrlForm!: FormGroup;
  ctrlForm2: FormGroup;

  value1 = 'CA';
  value2 = 'CA';
  value3 = 'foo';

  limitSelection = 0;

  fg: FormGroup = new FormGroup({
    state: new FormControl(),
  });

  maskAlphaNumeric = { mask: /^[A-Za-z0-9 ]*$/i };

  constructor(private fb: FormBuilder) {
    super();
    this.ctrlForm = this.fb.group({
      test11: new FormControl(null, Validators.required),
    });

    this.ctrlForm2 = this.fb.group({
      test5: new FormControl(null, Validators.required),
    });

    this.fg.patchValue(this.formData());
  }

  update1(event: Select2UpdateEvent<string>): void {
    console.log('update1', event);
  }
  change1(event: Event): void {
    console.log('change1', event);
  }
  focus1(event: Event): void {
    console.log('focus1', event);
  }
  blur1(event: Event): void {
    console.log('blur1', event);
  }
  open1(event: Event): void {
    console.log('open1', event);
  }
  close1(event: Event): void {
    console.log('close1', event);
  }
  search1(event: Event): void {
    console.log('search1', event);
  }

  update2(event: Select2UpdateEvent<string>): void {
    this.value2 = event.value;
  }

  update3(event: Select2UpdateEvent<string>): void {
    this.value3 = event.value;
  }

  isError = true;

  resetForm(): void {
    this.fg.reset(this.formData());
  }
  print(): void {
    console.log('FormControl', this.fg.value);
  }

  formData(): { state: string[] } {
    return {
      state: ['CA', 'NV'],
    };
  }

  onSubmit(): void {
    if (this.ctrlForm2.valid) {
      console.log('submit!');
    } else {
      this.isFormValid(this.ctrlForm2);
    }
  }

  private isFormValid(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      if (controle) {
        controle.markAsDirty();
        controle.markAsTouched();
        if (controle instanceof FormGroup || controle instanceof FormArray) {
          this.isFormValid(controle);
        }
      }
    });
  }

  externalSearchEvent(): void {
    console.log('externalSearchEvent');
  }

  searchMasked(evt: unknown): void {
    console.log('search (masked):', evt);
  }
}
