import {
  ITreeSelect,
  Select2Option,
  Select2Value,
  VrcSelectComponent,
} from '@vrsoftbr/vr-components';

export interface ISelect2Option<T = unknown> extends Select2Option {
  data?: T;
}

export interface ISelectMapped<T = unknown> extends Select2Option {
  label: string;
  value: Select2Value;
  main?: boolean;
  data?: T;
  children?: ITreeSelect[];
  descricao?: string;
}

export interface ISelectUpdateEvent<V = unknown, T = unknown> {
  component: VrcSelectComponent;
  value: V;
  options: ISelect2Option<T>[];
}
