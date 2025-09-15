import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IFireEventButton } from '../../interfaces/fire-event-button.interface';
import { SelectionType } from './../../../../types/selection.type';

@Component({
  selector: 'fire-event-selected',
  templateUrl: './fire-event-selected.component.html',
  styleUrls: ['./fire-event-selected.component.scss'],
})
export class FireEventSelectedComponent implements OnInit, OnDestroy {
  @Input() selectedCount = 0;
  @Input() fireEventButtons: IFireEventButton[] = [];
  @Input() fixedFireEventButtons = false;
  @Output() resetSelected = new EventEmitter();
  @Input() selectionType!: SelectionType;

  private readonly _subs: Subscription[] = [];

  ngOnInit(): void {
    this.buildInternalProperties();
  }

  fireEvent(event: CustomEvent, alwaysActive: boolean): void {
    if (
      this.selectedCount === 0 &&
      this.selectionType === 'checkbox' &&
      !alwaysActive
    )
      return;

    if (event) {
      window.dispatchEvent(event);
    }
  }

  onResetSelected(): void {
    this.resetSelected.emit();
  }

  toggleDropdown(button: IFireEventButton): void {
    button.isOpen = !button.isOpen;
  }

  shouldDisableButton(button: IFireEventButton): boolean {
    return (
      (this.selectedCount === 0 &&
        this.selectionType === 'checkbox' &&
        !button.alwaysActive) ||
      !!button.disabled
    );
  }

  private buildInternalProperties(): void {
    this.fireEventButtons.forEach((button) => {
      if (button.dropdown) {
        Object.assign(button, { isOpen: false });
      }
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
