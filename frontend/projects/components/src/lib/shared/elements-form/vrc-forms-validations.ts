import { ValidationErrors } from '@angular/forms';
import { get } from 'lodash';

export class VrcFormValidations {
  static getErrorMsg<T = ValidationErrors | null>(
    fieldName: string,
    validatorName: string,
    validatorValue?: { [key: string]: string },
  ): T {
    const config = {
      required: `Campo obrigatório`,
      max: `${fieldName} deve ser menor ou igual a ${validatorValue?.['max'] ?? ''}`,
      min: `${fieldName} deve ser maior ou igual a ${validatorValue?.['min'] ?? ''}`,
      minlength: `Precisa ter no mínimo ${validatorValue?.['requiredLength'] ?? ''} caractere(s)`,
      maxlength: `Precisa ter no máximo ${validatorValue?.['requiredLength'] ?? ''} caractere(s)`,
      invalidfield: `${fieldName} inválido`,
      startAndEndDateRequired: `É necessário inserir a data inicial e a data final`,
      startAndEndDateInvalid: `Data inicial deve ser menor ou igual que data final`,
    };

    return get(config, validatorName) as T;
  }
}
