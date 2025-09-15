import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { startWith, Subscription } from 'rxjs';
import { MarkdownCommon } from '../../../shared/models/markdown.common';
import { Estado } from '../shared/models/estado';
import { VrAutocompleteService } from '../shared/services/vr-autocomplete.service';

@Component({
  selector: 'vr-components-autocomplete',
  templateUrl: './components-autocomplete.component.html',
  styleUrls: ['./components-autocomplete.component.scss'],
})
export class ComponentsAutocompleteComponent
  extends MarkdownCommon
  implements OnInit, OnDestroy
{
  filteredOptions!: Estado[];

  estados: Estado[] = [];
  value!: unknown;

  formGroup!: FormGroup;

  private _sub!: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private service: VrAutocompleteService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getEstados();
  }

  getField(field: string): AbstractControl | null {
    return this.formGroup.get(field);
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      estado: [null, Validators.required],
    });
  }

  private getEstados(): void {
    this.service.getEstados().subscribe((estados) => {
      this.estados = estados;
      this.filterEstados();
    });
  }

  private filterEstados(): void {
    this._sub = this.getField('estado')
      ?.valueChanges.pipe(startWith(''))
      .subscribe((value: string) => {
        this.filteredOptions = this.filter(value);
      });
  }

  private filter(value: string): Estado[] {
    const normalize = (v: string): string =>
      v
        .toLowerCase()
        .normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '');

    const filterValue = normalize(value ?? '');

    return this.estados.filter((option) =>
      normalize(option.nome as string).includes(filterValue),
    );
  }

  log(value: unknown): void {
    console.dir('update', value);
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }
}
