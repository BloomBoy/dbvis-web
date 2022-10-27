import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeEntryFields } from 'src/utils/contentful';
import MaybeLink from './contentful/MaybeLink';

export interface DatabaseListEntry {
  id: SafeEntryFields.Symbol;
  url: SafeEntryFields.Symbol;
  title: SafeEntryFields.Symbol;
  logo: {
    src: string;
    alt?: string;
  };
  keywords: SafeEntryFields.Symbols;
  searchable: boolean;
  weight: number;
}

function DatabaseList({
  databases,
  className,
}: {
  databases: DatabaseListEntry[];
  className?: string;
}) {
  return (
    <div
      className={classNames(
        'w-full flex-shrink-0 flex-grow-0 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {databases.map(({ logo, title, url, id }) => (
        <MaybeLink
          key={id}
          className="w-full flex justify-between items-center px-4 py-5 rounded-lg shadow-imageShadow border border-grey-300 bg-buttonBackground font-mono uppercase cursor-pointer"
          href={url}
        >
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-[5px] bg-buttonBackground border px-1 flex items-center">
              <img src={logo.src} alt={logo.alt || title} />
            </div>
            <span className="ml-2">{title}</span>
          </div>
          <span className="text-primary-500 flex-shrink-0 whitespace-nowrap">
            -&gt;
          </span>
        </MaybeLink>
      ))}
    </div>
  );
}

export default function ShowDatabases({
  searchValue,
  setSearchValue,
  allDatabases,
  initialDatabases,
  loadAll,
  isLoading,
}: {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  initialDatabases: DatabaseListEntry[];
  allDatabases?: DatabaseListEntry[];
  loadAll: () => void;
}): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const [filteredDatabases, setFilteredDatabases] = useState<
    DatabaseListEntry[] | null
  >(null);

  // Ensure the order of the initial databases stay the same
  // even when we load in the rest.
  const correctedDatabases = useMemo(() => {
    if (!allDatabases) return allDatabases;
    const initialIds = initialDatabases.map(({ id }) => id);
    return [
      ...initialDatabases,
      ...allDatabases.filter(({ id }) => !initialIds.includes(id)),
    ];
  }, [allDatabases, initialDatabases]);

  useEffect(() => {
    if (allDatabases == null) return;
    if (searchValue.length > 0) {
      const f = allDatabases.filter((db) =>
        db.title.toUpperCase().match(searchValue.toUpperCase()),
      );
      setFilteredDatabases(f);
    } else {
      setFilteredDatabases(null);
    }
  }, [allDatabases, searchValue]);

  const renderList = showAll
    ? correctedDatabases ?? initialDatabases
    : initialDatabases;

  return (
    <>
      <div className="relative flex w-full items-center mb-10">
        <input
          className="uppercase w-full py-3 pl-6 pr-28 sm:pr-60 border-grey-300 border rounded-full font-mono outline-none placeholder:text-[#BFD6E2]"
          type="text"
          value={searchValue}
          onChange={({ target }) => setSearchValue(target.value)}
          onFocus={allDatabases == null && !isLoading ? loadAll : undefined}
          placeholder="Enter database Name"
        />
        <span className="absolute right-2 py-2 px-4 rounded-full text-white leading-none uppercase font-mono bg-grey-600">
          <p className="hidden sm:block font-thin">Search for database</p>
          <p className="sm:hidden">Search</p>
        </span>
      </div>
      <div className="overflow-hidden relative flex items-start">
        <DatabaseList
          databases={filteredDatabases != null ? initialDatabases : renderList}
          className={classNames(
            filteredDatabases != null &&
              'invisible pointer-events-none select-none',
            searchValue.length > 0 && isLoading && 'opacity-50',
          )}
        />
        {filteredDatabases && (
          <DatabaseList
            databases={filteredDatabases}
            className="relative right-full visible"
          />
        )}
      </div>
    </>
  );
}
