import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ITreeSelect,
  Select2Option,
  Select2Value,
} from '@vrsoftbr/vr-components';
import { ColumnMode, SelectionType } from '@vrsoftbr/vrc-datatables';
import lojaInputDataJson from './../../../../../public/datatables/data/loja-input.json';

interface ISelectMapped<T = unknown> extends Select2Option {
  label: string;
  value: Select2Value;
  main?: boolean;
  data?: T;
  children?: ITreeSelect[];
  descricao?: string;
}

interface IDivisaoFornecedorItem {
  frequenciaVisita: string;
  prazoEntrega: string;
  prazoSeguranca: string;
  idLoja: number;
  lojas?: ISelectMapped[];
  descricaoLoja?: string;
  idEmpresa?: number;
  descricaoEmpresa?: string;
}

@Component({
  selector: 'vr-datatable-input',
  templateUrl: './datatable-input.component.html',
  styleUrl: './datatable-input.component.scss',
})
export class DatatableInputComponent implements OnInit {
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  formGroup!: FormGroup;
  rows = [...lojaInputDataJson] as unknown as IDivisaoFornecedorItem[];
  selected = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      divisaoFornecedorItems: this.formBuilder.array([]),
    });
    this.setDivisaoFornecedorItems(this.rows);
    this.formGroup.markAllAsTouched();
  }

  get divisaoFornecedorItems(): FormArray {
    return this.formGroup.controls['divisaoFornecedorItems'] as FormArray;
  }

  setDivisaoFornecedorItems(rows: IDivisaoFornecedorItem[]): void {
    this.divisaoFornecedorItems.clear();
    this.addDivisaoFornecedorItemsForm(rows);
  }

  addDivisaoFornecedorItemsForm(rows: IDivisaoFornecedorItem[]): void {
    rows.forEach((row) => {
      const form = this.formBuilder.group({
        idLoja: [{ value: row.idLoja, disabled: false }, Validators.required],
        idEmpresa: [{ value: row.idEmpresa, disabled: false }],
        descricaoEmpresa: [{ value: row.descricaoEmpresa, disabled: false }],
        descricaoLoja: [{ value: row.descricaoLoja, disabled: false }],
        frequenciaVisita: [
          { value: row.frequenciaVisita, disabled: false },
          [Validators.min(0), Validators.max(365)],
        ],
        prazoEntrega: [
          { value: row.prazoEntrega, disabled: false },
          [Validators.min(0), Validators.max(365)],
        ],
        prazoSeguranca: [
          { value: row.prazoSeguranca, disabled: false },
          [Validators.min(0), Validators.max(365)],
        ],
      });
      this.divisaoFornecedorItems.push(form);
    });
  }

  onSelect(item: { selected: [] }): void {
    this.selected.splice(0, this.selected.length);
    if (item?.selected) {
      this.selected.push(...item.selected);
    }
  }
}
