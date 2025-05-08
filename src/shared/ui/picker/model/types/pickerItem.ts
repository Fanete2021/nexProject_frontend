export interface PickerItem {
  label: string;
  value?: string;
  image?: React.ReactNode;
  canChoose?: boolean;
  onClick?: () => void;
}
