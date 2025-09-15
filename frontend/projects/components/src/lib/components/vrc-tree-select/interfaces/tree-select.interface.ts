export interface ITreeSelect {
  value: number;
  label: string;
  level?: number;
  children: ITreeSelect[];
}
