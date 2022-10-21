import { LayoutLinkProps, LayoutListEntryProps } from './types';
import { SafeValue } from 'src/utils/contentful';

export function isLinkProps(
  listEntry: LayoutListEntryProps,
): listEntry is SafeValue<LayoutLinkProps> {
  return listEntry.type.endsWith('Link');
}
