import { Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { VrcFormValidations } from '../elements-form/vrc-forms-validations';
import { VrElementField } from './vr-element-field';

@Directive()
export abstract class VrSelectField extends VrElementField {
  @ViewChild('label')
  set labelElement(v: ElementRef<HTMLSelectElement>) {
    const nativeElement = v?.nativeElement;
    if (nativeElement) {
      let label: string = nativeElement.innerText ?? 'Campo';
      label = label?.replace('*', '');
      label = label.trim();
      this.label = label;
    }
  }

  @Input() errorMessage: string | null | undefined = null;

  protected label = 'Campo';

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

  protected setError(isError: boolean): void {
    this.isError = isError;
  }
}
