import { ComponentProps } from '../Component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlotProps<Data = any> = {
  components: ComponentProps[];
  id: string;
  data: Partial<Data>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayoutProps<Data = any, SlotData = any> = {
  data: Partial<Data>;
  type: string;
  slots: SlotProps<SlotData>[];
  id: string;
  mainHeaderIndex?: number;
};
