import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { getPageSizeStorage, setLocalStorage } from '../utils/storage-helper';

@Directive({ selector: '[pageSize]' })
export class PageSizeDirective implements OnInit, AfterViewInit {
  @Input() storageKeyPageSize!: string;
  @Input() pageSizeOptions!: number[];

  @Output() pageSizeChange = new EventEmitter<number | string>();

  @Input()
  set selectedPageSize(value: number) {
    if (value) {
      this.setSelectedValue(value);
    }
  }

  storageSelectedValue!: number | string;

  constructor(private readonly _elRef: ElementRef) {}

  ngOnInit(): void {
    this.checkStorage();
  }

  @HostListener('change', ['$event'])
  pageSizeChanged(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedOptions = target?.selectedOptions;
    if (selectedOptions) {
      const selectedValue = selectedOptions[0]?.value;
      if (this.storageKeyPageSize && selectedValue) {
        setLocalStorage(this.storageKeyPageSize, selectedValue);
        this.pageSizeChange.emit(selectedValue);
      }
    }
  }

  private checkStorage(): void {
    if (this.storageKeyPageSize && this.pageSizeOptions) {
      this.storageSelectedValue = getPageSizeStorage(
        this.storageKeyPageSize,
        this.pageSizeOptions,
      );
    }
  }

  ngAfterViewInit(): void {
    if (
      this.storageSelectedValue &&
      this._elRef.nativeElement instanceof HTMLSelectElement
    ) {
      this.setSelectedValue(this.storageSelectedValue);
    }
  }

  private setSelectedValue(value: number | string): void {
    if (this._elRef.nativeElement instanceof HTMLSelectElement) {
      this._elRef.nativeElement.value = value.toString();
    }
  }
}
