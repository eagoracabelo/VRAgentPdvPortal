import { QueryList } from '@angular/core';

import { VrcOptionComponent } from '../../components/vrc-option/vrc-option.component';
import { Option } from './../../components/vrc-option/models/option';

export interface IDatalist {
  options?: QueryList<VrcOptionComponent>;
  isOpen?: boolean;

  isCurrentInit(): void;
  isSelected(index: number): void;
  setClass(option: Option): unknown;
  onClicked(index: number): void;
  onKeyEvent(keyEvent: KeyboardEvent): void;
  onOpen(): void;
  onClose(): void;
}
