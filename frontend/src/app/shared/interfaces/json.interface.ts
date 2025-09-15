import { JSONValue } from '../types/json.type';

export interface JSONObject {
  [key: string]: JSONValue;
  menu: JSONObject[];
}

export interface IShortcut {
  keys: string[];
  label: string;
}

export interface ISearch {
  menuLabel: string;
  subMenuLabel?: string;
  formularioLabel: string;
  formularioValue: number;
  rota: string;
  label?: string;
}
