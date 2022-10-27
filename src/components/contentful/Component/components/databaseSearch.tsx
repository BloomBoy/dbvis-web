import type { ComponentProps } from '..';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeEntryFields } from 'src/utils/contentful';
import getFetchKey from 'src/utils/getFetchKey';
import { useRouter } from 'next/router';
import useCollectedData from 'src/hooks/useCollectedData';
import {
  getAllDatabaseListEntries,
  getDatabaseListEntries,
  getDatabasePage,
  listFields,
  parseListItem,
} from 'src/utils/contentful/databasePage';
import ShowDatabases, { DatabaseListEntry } from 'src/components/ShowDatabases';
import { getExtraDatabaseSearchResultEntries } from 'src/utils/contentful/extraDatabaseSearchResult';

type DatabaseSearchData = {
  count?: SafeEntryFields.Integer;
};

const DEFAULT_COUNT = 12;

interface CollectedData {
  items: DatabaseListEntry[];
  fallback: DatabaseListEntry | null;
}

function databaseFetchKey(
  { data: { count = DEFAULT_COUNT }, type }: ComponentProps<DatabaseSearchData>,
  preview: boolean,
) {
  return getFetchKey(type, { preview }, count);
}

function DatabaseSearchComponent(
  props: ComponentProps<DatabaseSearchData>,
): JSX.Element | null {
  const { isPreview } = useRouter();
  const key = databaseFetchKey(props, isPreview);
  const [loadAll, setLoadAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialDatabases = useCollectedData<DatabaseListEntry[]>(key);
  const [allDatabases, setAllDatabases] = useState<DatabaseListEntry[]>();
  const router = useRouter();
  useEffect(() => {
    if (allDatabases != null || !loadAll) return;
    let mounted = true;
    setIsLoading(true);
    getAllDatabaseListEntries({
      locale: router.locale,
      preview: router.isPreview,
    })
      .then(() => {
        if (!mounted) return;
        setAllDatabases(allDatabases);
      })
      .catch(console.error)
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => {
      setIsLoading(false);
      mounted = false;
    };
  }, [allDatabases, loadAll, router.isPreview, router.locale]);
  useEffect(() => {
    return () => {
      setAllDatabases(undefined);
    };
  }, [router.isPreview, router.locale]);

  const [searchValue, rawSetSearchValue] = useState('');

  const setSearchValue = useMemo(() => {
    if (!loadAll) {
      return (
        ...args: Parameters<typeof rawSetSearchValue>
      ): ReturnType<typeof rawSetSearchValue> => {
        setLoadAll(true);
        return rawSetSearchValue(...args);
      };
    }
    return rawSetSearchValue;
  }, [loadAll]);
  const triggerLoadAll = useCallback(() => setLoadAll(true), []);
  if (initialDatabases == null) return null;
  return (
    <ShowDatabases
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      isLoading={isLoading}
      initialDatabases={initialDatabases}
      allDatabases={allDatabases}
      loadAll={triggerLoadAll}
    />
  );
}

const databaseSearch = Object.assign(DatabaseSearchComponent, {
  registerDataCollector(
    props: ComponentProps<DatabaseSearchData>,
    preview: boolean,
  ) {
    const {
      data: { count = DEFAULT_COUNT },
    } = props;
    return {
      fetchKey: databaseFetchKey(props, preview),
      async collect(): Promise<CollectedData> {
        const [
          { databasePageListEntries },
          { extradatabaseSearchResultListEntries },
          fallbackEntry,
        ] = await Promise.all([
          getDatabaseListEntries({
            count,
            skip: 0,
            preview,
          }),
          getExtraDatabaseSearchResultEntries({
            count,
            skip: 0,
            preview,
          }),
          getDatabasePage({ slug: 'generic', preview }, listFields).then(
            ({ page }) => page && parseListItem(page),
          ),
        ]);
        const items = [
          ...databasePageListEntries,
          ...extradatabaseSearchResultListEntries,
        ].sort(
          (
            { weight: weightA, title: titleA },
            { weight: weightB, title: titleB },
          ) => {
            if (weightA === weightB) {
              return titleA.localeCompare(titleB);
            } else {
              return weightB - weightA;
            }
          },
        );
        items.length = Math.min(count, items.length);
        return {
          items,
          fallback: fallbackEntry,
        };
      },
    };
  },
});

export default databaseSearch;
