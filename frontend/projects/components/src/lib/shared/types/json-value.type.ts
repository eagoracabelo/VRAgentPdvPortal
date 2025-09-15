export type TJSONValue =
  | string
  | number
  | boolean
  | TJSONValue[]
  | { [key: string]: TJSONValue };
