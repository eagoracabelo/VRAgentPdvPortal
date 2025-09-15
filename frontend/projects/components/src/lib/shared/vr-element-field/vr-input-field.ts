import { Directive, Input } from '@angular/core';

import { VrcFormValidations } from '../elements-form/vrc-forms-validations';
import { VrElementField } from './vr-element-field';

@Directive()
export abstract class VrInputField<T = unknown> extends VrElementField<T> {
  @Input() placeholder = '';
  @Input() label!: string;
  @Input() autofocus = 'off';
  @Input() errorMessage: string | null | undefined = null;

  protected override resetStatusError(): void {
    this.showError(null);
    this.setError(false);
  }

  protected override actionsForError(): void {
    const msg = this.findErrorMessage();
    this.showError(msg);
    this.setError(!!msg);
  }

  private findErrorMessage(): string | undefined {
    const errors = this.control?.errors ?? {};

    for (const propertyName in errors) {
      if (Object.hasOwn(errors, propertyName)) {
        return VrcFormValidations.getErrorMsg(
          this.label,
          propertyName,
          errors[propertyName] as { [key: string]: string },
        );
      }
    }
    return undefined;
  }

  private showError(message: string | null | undefined): void {
    this.errorMessage = message;
  }

  private setError(isError: boolean): void {
    this.isError = isError;
  }
}
