import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ExpandMode,
  ITreeSelect,
  SelectableItem,
} from '@vrsoftbr/vr-components';

import { MarkdownCommon } from '../../../shared/models/markdown.common';
import { Data } from './data';

interface ITreeSelectConfiguration {
  items: unknown[];
  allowParentSelection: boolean;
  showFilter: boolean;
  disabled: boolean;
  filterPlaceholder: string;
  placeholder: string;
  maxDisplayed: number;
  multiple: boolean;
  required: boolean;
  expandMode: ExpandMode;
  resetAllSelected: boolean;
  resetAllSelectedLabel?: string;
  filterCaseSensitive?: boolean;
  minLevelToSelect?: number;
}

@Component({
  selector: 'vr-components-tree-select',
  templateUrl: './components-tree-select.component.html',
  styleUrls: ['./components-tree-select.component.scss'],
})
export class ComponentsTreeSelectComponent extends MarkdownCommon {
  configMinimaSelecionado: SelectableItem[] = [];
  configMinLevelSelecionado: SelectableItem[] = [];
  singleSelectionConfiguration: ITreeSelectConfiguration = {
    items: Data,
    allowParentSelection: false,
    showFilter: false,
    disabled: false,
    filterPlaceholder: 'Filtrar',
    placeholder: 'Selecionar',
    maxDisplayed: 1,
    multiple: false,
    required: false,
    expandMode: ExpandMode.None,
    resetAllSelected: false,
  };

  multipleSelectionConfiguration: ITreeSelectConfiguration = {
    items: Data,
    allowParentSelection: false,
    showFilter: false,
    disabled: false,
    filterPlaceholder: 'Filtrar',
    placeholder: 'Selecionar',
    maxDisplayed: 1,
    multiple: true,
    required: true,
    expandMode: ExpandMode.None,
    resetAllSelected: false,
  };

  singleSelectionMinLevelConfiguration: ITreeSelectConfiguration = {
    items: Data,
    allowParentSelection: false,
    showFilter: false,
    disabled: false,
    filterPlaceholder: 'Filtrar',
    placeholder: 'Selecionar',
    maxDisplayed: 1,
    multiple: false,
    required: false,
    expandMode: ExpandMode.None,
    resetAllSelected: false,
    resetAllSelectedLabel: 'Limpar Seleção',
    filterCaseSensitive: false,
    minLevelToSelect: 2,
  };

  formGroup1!: FormGroup;
  formGroup2!: FormGroup;

  treeSelect1Control!: AbstractControl;
  treeSelect2Control!: AbstractControl;

  constructor(private _fb: FormBuilder) {
    super();
    this.buildFormGroups();
    this.buildFormControls();
  }

  toggleShowFilter1(): void {
    this.singleSelectionConfiguration.showFilter =
      !this.singleSelectionConfiguration.showFilter;
  }

  toggleShowFilterMinLevel(): void {
    this.singleSelectionMinLevelConfiguration.showFilter =
      !this.singleSelectionMinLevelConfiguration.showFilter;
  }

  toggleDisabled1(): void {
    this.singleSelectionConfiguration.disabled =
      !this.singleSelectionConfiguration.disabled;
  }

  toggleResetAllSelectedSelection2(): void {
    this.multipleSelectionConfiguration.resetAllSelected =
      !this.multipleSelectionConfiguration.resetAllSelected;
  }

  toggleResetAllSelectedSelectionMinLevel(): void {
    this.singleSelectionMinLevelConfiguration.resetAllSelected =
      !this.singleSelectionMinLevelConfiguration.resetAllSelected;
  }

  toggleAllowParentSelection2(): void {
    this.multipleSelectionConfiguration.allowParentSelection =
      !this.multipleSelectionConfiguration.allowParentSelection;
    this.reset2();
  }

  toggleShowFilter2(): void {
    this.multipleSelectionConfiguration.showFilter =
      !this.multipleSelectionConfiguration.showFilter;
  }

  toggleDisabled2(): void {
    this.multipleSelectionConfiguration.disabled =
      !this.multipleSelectionConfiguration.disabled;
  }

  toggleRequired(): void {
    this.singleSelectionConfiguration.required =
      !this.singleSelectionConfiguration.required;
  }

  toggleRequiredMinLevel(): void {
    this.singleSelectionMinLevelConfiguration.required =
      !this.singleSelectionMinLevelConfiguration.required;
  }

  reset1(): void {
    const test1 = this.formGroup1.get('treeSelect1');
    if (test1) {
      test1.reset();
    }
  }

  reset2(): void {
    const test2 = this.formGroup2.get('treeSelect2');
    if (test2) {
      test2.reset();
    }
  }

  onSubmit1(): void {
    if (this.formGroup1.valid) {
      console.log('submit 1!');
    } else {
      this.isFormValid(this.formGroup1);
    }
  }

  onSubmit2(): void {
    if (this.formGroup2.valid) {
      console.log('submit 2!');
    } else {
      this.isFormValid(this.formGroup2);
    }
  }

  update(item: SelectableItem[]): void {
    console.log('updated value: ', item);
  }

  updateChildrenAndParents(items: ITreeSelect[]): void {
    console.log('selected children and parents value: ', items);
  }

  updateMin(item: SelectableItem[]): void {
    this.configMinimaSelecionado = item;
  }

  updateMinLevel(item: SelectableItem[]): void {
    this.configMinLevelSelecionado = item;
  }

  onExpandMode1(value: string): void {
    this.singleSelectionConfiguration.expandMode = value;
  }

  onExpandMode2(value: string): void {
    this.multipleSelectionConfiguration.expandMode = value;
  }

  private buildFormGroups(): void {
    this.formGroup1 = this._fb.group({
      treeSelect1: new FormControl(
        {
          value: 10,
          label: 'Loja 01 - VR Software com um nome muito grande',
          level: 2,
        },
        Validators.required,
      ),
    });

    this.formGroup2 = this._fb.group({
      treeSelect2: new FormControl(null, Validators.required),
    });
  }

  private buildFormControls(): void {
    this.treeSelect1Control = this.formGroup1.get(
      'treeSelect1',
    ) as AbstractControl;

    this.treeSelect2Control = this.formGroup2.get(
      'treeSelect2',
    ) as AbstractControl;
  }

  private isFormValid(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      if (controle) {
        controle.markAsDirty();
        controle.markAsTouched();
        if (controle instanceof FormGroup) {
          this.isFormValid(controle);
        }
      }
    });
  }
}
