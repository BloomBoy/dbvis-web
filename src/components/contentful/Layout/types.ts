/* eslint-disable @typescript-eslint/no-explicit-any */
import { SafeEntryFields, SafeValue } from 'src/utils/contentful';
import { SavedComponentProps } from '../Component';

export type SlotProps<
  Data extends Record<string, unknown> = Record<string, any>,
> = {
  components: SavedComponentProps[];
  id: string;
  data: Partial<Data>;
};

export type BlockFields = {
  pageLayout: LayoutListEntryProps[];
  title: SafeEntryFields.Symbol;
};

export interface LayoutProps<
  Data extends Record<string, unknown> = Record<string, any>,
  SlotData extends Record<string, unknown> = Record<string, any>,
> {
  data: Partial<Data>;
  type: `${string}Layout`;
  slots: SlotProps<SlotData>[];
  id: string;
  mainHeaderIndex?: number;
}

export interface LayoutLinkProps {
  target: SafeEntryFields.SafeEntry<BlockFields>;
  type: `${string}Link`;
  id: string;
  mainHeaderIndex?: number;
}

export type LayoutListEntryProps<
  Data extends Record<string, unknown> = Record<string, any>,
  SlotData extends Record<string, unknown> = Record<string, any>,
> = SafeValue<LayoutProps<Data, SlotData>> | SafeValue<LayoutLinkProps>;
