import { IShortcut } from './shortcut.interface';

export interface IModalDataShortcut {
  data: IShortcuts;
}

export interface IShortcuts {
  shortcuts: IShortcut[];
}
