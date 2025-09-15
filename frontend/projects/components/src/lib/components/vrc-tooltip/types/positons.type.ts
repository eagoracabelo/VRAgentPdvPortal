import { EPositions } from '../enums/positions.enum';

export type TPositions =
  | EPositions.BottomRight
  | EPositions.BottomLeft
  | EPositions.TopRight
  | EPositions.TopLeft;
