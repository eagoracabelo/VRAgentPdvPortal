import { FormArray, FormControl, FormGroup } from '@angular/forms';

export class FormValidations {
  static requiredMinChebox(min = 1): object | null {
    const validator = (
      formArray: FormArray<FormControl<number>>,
    ): object | null => {
      const totalChecked = formArray.controls
        ?.map((v) => v.value)
        .reduce((total, current) => (current ? total + current : total), 0);

      return totalChecked >= min ? null : { required: true };
    };

    return validator;
  }

  static emailValidator(control: FormControl<string>): object | null {
    const validEmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    const email = control?.value ?? null;
    return !email
      ? null
      : validEmail.test(email)
        ? null
        : { invalidfield: true };
  }

  static cepValidator(control: FormControl<string>): object | null {
    const cep = control.value?.replace(/[^\d]+/g, '');

    if (cep && cep !== '') {
      const validCep = /[0-9]{5}[\d]{3}/;
      return validCep.test(cep) ? null : { invalidfield: true };
    }

    return null;
  }

  static cnpjValidator(control: FormControl<string>): object | null {
    const cnpj = control.value?.replace(/[^\d]+/g, '');

    if (cnpj) {
      if (cnpj === '') {
        return { invalidfield: true };
      }

      if (cnpj?.length !== 14) {
        return { invalidfield: true };
      }

      if (FormValidations.isInvalidCNPJRecognized(cnpj)) {
        return { invalidfield: true };
      }

      if (!FormValidations.isValidDVs(cnpj)) {
        return { invalidfield: true };
      }
    }

    return null;
  }

  private static isInvalidCNPJRecognized(cnpj: string): boolean {
    return (
      cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999'
    );
  }

  private static isValidDVs(cnpj: string): boolean {
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numeros.charAt(tamanho - i), 10) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== Number.parseInt(digitos.charAt(0), 10)) {
      return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numeros.charAt(tamanho - i), 10) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== Number.parseInt(digitos.charAt(1), 10)) {
      return false;
    }

    return true;
  }

  static validarCpf(cpf: string): object | null {
    let soma = 0;
    let resto = 0;

    if (cpf === '00000000000') {
      return { cpfInvalid: true };
    }

    for (let i = 1; i <= 9; i++) {
      soma += Number.parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== Number.parseInt(cpf.substring(9, 10))) {
      return { cpfInvalid: true };
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += Number.parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== Number.parseInt(cpf.substring(10, 11))) {
      return { cpfInvalid: true };
    }

    return null;
  }

  static equalsTo(otherFild: string): object | null {
    const validator = (formControl: FormControl): object | null => {
      if (otherFild == null) {
        throw new Error('É necessário informar um campo.');
      }

      if (!formControl.root || !(formControl.root as FormGroup).controls) {
        return null;
      }

      const field = (formControl.root as FormGroup).get(otherFild);

      if (!field) {
        throw new Error('É necessário informar um campo válido.');
      }

      if (field.value !== formControl.value) {
        return { equalsTo: otherFild };
      }

      return null;
    };
    return validator;
  }
}
