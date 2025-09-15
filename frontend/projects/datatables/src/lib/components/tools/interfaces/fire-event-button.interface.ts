export interface IFireEventButton {
  label: string;
  icon: string;
  event?: CustomEvent;
  alwaysActive?: boolean;
  dropdown?: IFireEventButtonDropdown[];
  isOpen?: boolean;
  disabled?: boolean;
}

export interface IFireEventButtonDropdown {
  label: string;
  event?: CustomEvent;
}
