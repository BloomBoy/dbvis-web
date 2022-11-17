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
  pageLayout: SavedLayoutListEntry[];
  title: SafeEntryFields.Symbol;
};

export interface SavedLayout<
  Data extends Record<string, unknown> = Record<string, any>,
  SlotData extends Record<string, unknown> = Record<string, any>,
> {
  data: Partial<Data>;
  type: `${string}Layout`;
  slots: SlotProps<SlotData>[];
  id: string;
}

export interface LayoutProps<
  Data extends Record<string, unknown> = Record<string, any>,
  SlotData extends Record<string, unknown> = Record<string, any>,
> extends SavedLayout<Data, SlotData> {
  mainHeaderIndex: number;
}

export interface SavedLayoutLink {
  target: SafeEntryFields.SafeEntry<BlockFields>;
  type: `${string}Link`;
  id: string;
}

export interface LayoutLinkProps extends SavedLayoutLink {
  mainHeaderIndex: number;
}

export type SavedLayoutListEntry<
  Data extends Record<string, unknown> = Record<string, any>,
  SlotData extends Record<string, unknown> = Record<string, any>,
> = SafeValue<SavedLayout<Data, SlotData>> | SafeValue<SavedLayoutLink>;

export type LayoutListEntryProps<
  Data extends Record<string, unknown> = Record<string, any>,
  SlotData extends Record<string, unknown> = Record<string, any>,
> = SafeValue<LayoutProps<Data, SlotData>> | SafeValue<LayoutLinkProps>;
