import {
  LayoutLinkProps,
  LayoutListEntryProps,
  SavedLayoutLink,
  SavedLayoutListEntry,
} from './types';
import { SafeValue } from 'src/utils/contentful';

export function isLinkProps(
  listEntry: LayoutListEntryProps,
): listEntry is SafeValue<LayoutLinkProps>;
export function isLinkProps(
  listEntry: SavedLayoutListEntry,
): listEntry is SafeValue<SavedLayoutLink>;
export function isLinkProps(
  listEntry: LayoutListEntryProps | SavedLayoutListEntry,
): listEntry is SafeValue<LayoutLinkProps | SavedLayoutLink>;
export function isLinkProps(
  listEntry: LayoutListEntryProps | SavedLayoutListEntry,
): listEntry is SafeValue<LayoutLinkProps | SavedLayoutLink> {
  return listEntry.type.endsWith('Link');
}
