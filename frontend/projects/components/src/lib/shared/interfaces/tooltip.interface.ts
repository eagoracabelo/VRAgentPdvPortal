export interface ITooltip {
  message: string | string[];
  error?: boolean;
  small?: boolean;
  width?: number;
  bottomRight?: boolean;
  bottomLeft?: boolean;
  topRight?: boolean;
  topLeft?: boolean;
}
