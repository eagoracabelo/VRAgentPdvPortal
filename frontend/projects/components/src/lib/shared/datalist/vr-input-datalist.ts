import {
  ContentChildren,
  Directive,
  EventEmitter,
  Output,
  QueryList,
} from '@angular/core';

import { VrcOptionComponent } from '../../components/vrc-option/vrc-option.component';
import { KeyboardCode } from '../keyboard/keyboard-code';
import { VrInputField } from '../vr-element-field/vr-input-field';
import { Option } from './../../components/vrc-option/models/option';
import { IDatalist } from './idatalist';

@Directive()
export abstract class VrInputDatalist
  extends VrInputField
  implements IDatalist
{
  @ContentChildren(VrcOptionComponent) options!: QueryList<VrcOptionComponent>;
  @Output() update = new EventEmitter<unknown>();

  abstract onOpen(): void;
  abstract onClose(): void;
  abstract isCurrentInit(): void;
  abstract isSelected(index: number): void;
  abstract scrollIntoView(): void;

  protected get maxIndex(): number {
    const max = this.options.length;
    const maxIndex = max - 1;
    return maxIndex < 0 ? 0 : maxIndex;
  }

  protected get isCurrent(): number {
    let isFind = false;
    let index!: number;
    this.options.find((op, i) => {
      index = i;
      isFind = op.isCurrent;
      return op.isCurrent;
    });

    if (!isFind) {
      throw new Error('not found "isCurrent"!');
    }

    return index;
  }

  protected set isCurrent(index: number) {
    this.options.map((op, i) => {
      if (index === i) {
        op.isCurrent = true;
      } else {
        op.isCurrent = false;
      }
    });
  }

  setClass(option: Option): { current: boolean | undefined } {
    return { current: option.isCurrent };
  }

  onClicked(index: number): void {
    this.getSelected(index);
  }

  onKeyEvent(keyEvent: KeyboardEvent): void {
    if (this.options?.length !== 0) {
      this.action(keyEvent);
    }
  }

  protected action(keyEvent: KeyboardEvent): void {
    switch (keyEvent.code) {
      case KeyboardCode.DOWN_ARROW:
        this.setDown();
        break;

      case KeyboardCode.UP_ARROW:
        keyEvent.preventDefault();
        this.setUp();
        break;

      case KeyboardCode.ENTER:
      case KeyboardCode.NUMPAD_ENTER:
        keyEvent.preventDefault();
        this.getSelected();
        break;
    }
  }

  private setDown(): void {
    try {
      let index = this.isCurrent;
      if (index < this.maxIndex) {
        index++;
      } else {
        index = 0;
      }
      this.isCurrent = index;
    } catch (_: unknown) {
      this.isCurrent = 0;
    } finally {
      this.scrollIntoView();
    }
  }

  private setUp(): void {
    try {
      let index = this.isCurrent;
      if (index >= 1) {
        index--;
      } else {
        index = this.maxIndex;
      }
      this.isCurrent = index;
    } catch (_: unknown) {
      this.isCurrent = this.maxIndex;
    } finally {
      this.scrollIntoView();
    }
  }

  private getSelected(index = this.isCurrent): void {
    try {
      this.onClose();
      this.isSelected(index);
    } catch (_: unknown) {
      console.info('selecione um item por favor.');
    }
  }
}
