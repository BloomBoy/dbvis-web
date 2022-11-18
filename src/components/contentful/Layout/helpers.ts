import {
  LayoutLinkProps,
  LayoutListEntryProps,
  SavedLayoutLink,
  SavedLayoutListEntry,
} from './types';
import { SafeValue } from 'src/utils/contentful';
import LayoutLink from './LayoutLink';
import { layoutHeaders } from './LayoutRenderers';
import useCollectedData from 'src/hooks/useCollectedData';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import usePageContext from 'src/hooks/usePageContex';
import { isNonNull } from 'src/utils/filters';

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

export function useHeaderEntries(
  layouts: SavedLayoutListEntry[],
  startMainHeaderIndex?: number,
) {
  const collectedData = useCollectedData();
  const { isPreview } = useRouter();
  const context = usePageContext();
  const headerEntries = useMemo(() => {
    return layouts
      .flatMap((entry) => {
        if (isLinkProps(entry)) {
          return LayoutLink.headers(
            entry,
            collectedData,
            startMainHeaderIndex ?? 0,
            isPreview,
            context,
          );
        }
        return layoutHeaders(
          entry,
          collectedData,
          startMainHeaderIndex ?? 0,
          isPreview,
          context,
        );
      })
      .filter(isNonNull);
  }, [layouts, collectedData, startMainHeaderIndex, isPreview, context]);
  return headerEntries;
}
