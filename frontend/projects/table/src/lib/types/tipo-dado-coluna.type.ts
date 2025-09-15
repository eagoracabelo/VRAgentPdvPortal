import IMask, { FactoryOpts } from 'imask';

import {
  imaskDateOptions,
  imaskDateTimeOptions,
  imaskTimeOptions,
} from './../utils/date-imask-options';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export enum TipoDadoColunaEnum {
  id = 'id',
  numerico = 'numerico',
  texto = 'texto',
  inteiro = 'inteiro',
  cep = 'cep',
  cpf = 'cpf',
  cnpj = 'cnpj',
  ncm = 'ncm',
  mercadologico = 'mercadologico',
  data = 'data',
  hora = 'hora',
  dataHora = 'dataHora',
  telefone = 'telefone',
}

export interface ITipoDadoColuna {
  alinhamento: string;
  mascara: FactoryOpts;
  tipo: TipoDadoColunaEnum;
  texto: string;
  id: number;
}

export class TipoDadoColuna implements ITipoDadoColuna {
  private static _locale: string;

  private constructor(
    public alinhamento: string,
    public mascara: FactoryOpts,
    public tipo: TipoDadoColunaEnum,
    public texto: string,
    public id: number,
  ) {}

  static get locale(): string {
    return TipoDadoColuna._locale;
  }

  static set locale(locale: string) {
    TipoDadoColuna._locale = locale;
  }

  static pegarTipoDadoPeloTexto(
    texto: string,
    valor = '',
    locale = 'en-US',
  ): ITipoDadoColuna {
    TipoDadoColuna.locale = locale;
    const tipoDado =
      TipoDadoColuna.listarTodos().find((t) => t.texto === texto) ??
      TipoDadoColuna.texto;

    if (tipoDado.texto === TipoDadoColuna.telefone.texto) {
      tipoDado.mascara = this.definirMascaraTelefone(valor);
    }

    return tipoDado;
  }

  static aplicarMascara(valor: string, mascara: FactoryOpts): string {
    const novaMascara = IMask.createMask(mascara);
    novaMascara.resolve(`${valor}`);
    return novaMascara.value;
  }

  private static definirMascaraTelefone(valor: string): FactoryOpts {
    const mask: FactoryOpts = {
      mask: '(00) 0000-0000',
      autofix: true,
      lazy: true,
      overwrite: true,
    };

    if (valor.length === 11) {
      mask.mask = '(00) 0 0000-0000';
    }

    return mask;
  }

  static listarTodos(): ITipoDadoColuna[] {
    return [
      TipoDadoColuna.id,
      TipoDadoColuna.numerico,
      TipoDadoColuna.texto,
      TipoDadoColuna.inteiro,
      TipoDadoColuna.cep,
      TipoDadoColuna.cpf,
      TipoDadoColuna.cnpj,
      TipoDadoColuna.ncm,
      TipoDadoColuna.mercadologico,
      TipoDadoColuna.data,
      TipoDadoColuna.hora,
      TipoDadoColuna.dataHora,
      TipoDadoColuna.telefone,
    ];
  }

  static get numerico(): ITipoDadoColuna {
    return {
      id: 1,
      tipo: TipoDadoColunaEnum.numerico,
      texto: 'numerico',
      mascara: {
        mask: Number,
        scale: 2,
        thousandsSeparator: '.',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ',',
      },
      alinhamento: 'right',
    };
  }

  static get texto(): ITipoDadoColuna {
    return {
      id: 2,
      tipo: TipoDadoColunaEnum.texto,
      texto: 'texto',
      mascara: { mask: /.*/, autofix: true, lazy: true, overwrite: true },
      alinhamento: 'left',
    };
  }

  static get inteiro(): ITipoDadoColuna {
    return {
      id: 3,
      tipo: TipoDadoColunaEnum.inteiro,
      texto: 'inteiro',
      mascara: {
        mask: Number,
        scale: 0,
        thousandsSeparator: '.',
        padFractionalZeros: false,
        normalizeZeros: true,
        radix: ',',
      },
      alinhamento: 'right',
    };
  }

  static get cep(): ITipoDadoColuna {
    return {
      id: 4,
      tipo: TipoDadoColunaEnum.cep,
      texto: 'cep',
      mascara: {
        mask: '00000-000',
        autofix: true,
        lazy: true,
        overwrite: true,
      },
      alinhamento: 'right',
    };
  }

  static get cpf(): ITipoDadoColuna {
    return {
      id: 5,
      tipo: TipoDadoColunaEnum.cpf,
      texto: 'cpf',
      mascara: {
        mask: '000.000.000-00',
        autofix: true,
        lazy: true,
        overwrite: true,
      },
      alinhamento: 'right',
    };
  }

  static get cnpj(): ITipoDadoColuna {
    return {
      id: 6,
      tipo: TipoDadoColunaEnum.cnpj,
      texto: 'cnpj',
      mascara: {
        mask: '00.000.000/0000-00',
        autofix: true,
        lazy: true,
        overwrite: true,
      },
      alinhamento: 'right',
    };
  }

  static get ncm(): ITipoDadoColuna {
    return {
      id: 7,
      tipo: TipoDadoColunaEnum.ncm,
      texto: 'ncm',
      mascara: {
        mask: '0000.00.00',
        autofix: true,
        lazy: true,
        overwrite: true,
      },
      alinhamento: 'right',
    };
  }

  static get mercadologico(): ITipoDadoColuna {
    return {
      id: 8,
      tipo: TipoDadoColunaEnum.mercadologico,
      texto: 'mercadologico',
      mascara: {
        mask: '000.000.000',
        autofix: true,
        lazy: true,
        overwrite: true,
      },
      alinhamento: 'right',
    };
  }

  static get data(): ITipoDadoColuna {
    return {
      id: 9,
      tipo: TipoDadoColunaEnum.data,
      texto: 'data',
      mascara: imaskDateOptions(TipoDadoColuna.locale),
      alinhamento: 'left',
    };
  }

  static get hora(): ITipoDadoColuna {
    return {
      id: 10,
      tipo: TipoDadoColunaEnum.hora,
      texto: 'hora',
      mascara: imaskTimeOptions(TipoDadoColuna.locale),
      alinhamento: 'left',
    };
  }

  static get dataHora(): ITipoDadoColuna {
    return {
      id: 11,
      tipo: TipoDadoColunaEnum.dataHora,
      texto: 'dataHora',
      mascara: imaskDateTimeOptions(TipoDadoColuna.locale),
      alinhamento: 'left',
    };
  }

  static get telefone(): ITipoDadoColuna {
    return {
      id: 12,
      tipo: TipoDadoColunaEnum.telefone,
      texto: 'telefone',
      mascara: {
        mask: '(00) 0000-0000',
        autofix: true,
        lazy: true,
        overwrite: true,
      },
      alinhamento: 'left',
    };
  }

  static get id(): ITipoDadoColuna {
    return {
      id: 13,
      tipo: TipoDadoColunaEnum.id,
      texto: 'id',
      mascara: {
        mask: /^\w+$/,
        autofix: true,
        lazy: true,
        overwrite: true,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        commit: (value: string, masked: any): void => {
          masked._value = String(value).padStart(6, '0');
        },
      },
      alinhamento: 'left',
    };
  }
}
