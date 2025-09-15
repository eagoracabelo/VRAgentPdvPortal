import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
} from 'rxjs/operators';
import { IModalDataShortcut } from '../interfaces/modal-data.interface';
import { IShortcut } from '../interfaces/shortcut.interface';
import { VrcModalService } from './../../../../services/vrc-modal.service';

@Component({
  selector: 'vr-shortcuts-modal',
  templateUrl: './shortcuts-modal.component.html',
  styleUrls: ['./shortcuts-modal.component.scss'],
})
export class ShortcutsModalComponent implements OnInit, OnDestroy {
  filterControl = new UntypedFormControl('');
  unsubscribe$ = new Subject();

  shortcuts: IShortcut[] = [];

  filter = '';

  constructor(private readonly _modalService: VrcModalService) {
    this.loadModalOptions();
  }

  ngOnInit(): void {
    this.checkChangedFilter();
  }

  protected loadModalOptions(): void {
    this._modalService.options$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values: unknown) => {
        this.shortcuts = (values as IModalDataShortcut).data.shortcuts;
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscClick(event: KeyboardEvent): void {
    event.preventDefault();
    this.onClose();
  }

  private checkChangedFilter(): void {
    this.filterControl.valueChanges
      .pipe(
        filter((value: string) => this.checkFilterLength(value)),
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((value: string) => {
        this.filter = value;
      });
  }

  private checkFilterLength(value: string | undefined): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    return value.length >= 1 || value.length === 0;
  }

  onClose(): void {
    this._modalService.onClose();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
