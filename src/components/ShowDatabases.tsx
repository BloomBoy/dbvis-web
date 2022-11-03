import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SafeEntryFields } from 'src/utils/contentful';
import Badge from './Badge';

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
        <Badge
          key={id}
          href={url}
          icon={{ url: logo.src, alt: logo.alt || title }}
          className="px-4 py-5"
          text={title}
        />
      ))}
    </div>
  );
}

function ThrobbingButton({
  className,
  isLoading,
  children,
  delay = 0,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & {
  isLoading: boolean;
  delay?: number;
}): JSX.Element | null {
  const [isThrobbing, setIsThrobbing] = useState(false);
  useEffect(() => {
    if (delay === 0) return;
    if (isLoading) {
      const timeout = setTimeout(() => setIsThrobbing(true), delay);
      return () => clearTimeout(timeout);
    }
    setIsThrobbing(false);
  }, [isLoading, delay]);
  const clickHandler = isLoading ? undefined : onClick;
  if (delay === 0 ? isLoading : isLoading && isThrobbing) {
    return (
      <div className={className}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
      </div>
    );
  }
  if (isLoading) return null;
  return (
    <button
      className="text-[#BFD6E2] font-mono mt-10 h-12 border border-grey-300 rounded-lg"
      onClick={clickHandler}
      {...props}
    >
      {children}
    </button>
  );
}

function SearchBadge({ isLoading }: { isLoading: boolean }) {
  const [throbberVisible, setThrobberVisible] = useState(isLoading);
  const throbberVisibleRef = useRef(throbberVisible);
  throbberVisibleRef.current = throbberVisible;
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  const [animationEl, setAnimationEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    function transitionEndHandler() {
      if (!isLoadingRef.current) setThrobberVisible(false);
    }
    function transitionStartHandler() {
      if (isLoadingRef.current) setThrobberVisible(true);
    }
    if (animationEl) {
      animationEl.addEventListener('transitionend', transitionEndHandler);
      animationEl.addEventListener('transitionstart', transitionStartHandler);
    }
    return () => {
      if (animationEl) {
        animationEl.removeEventListener('transitionend', transitionEndHandler);
        animationEl.removeEventListener(
          'transitionstart',
          transitionStartHandler,
        );
      }
    };
  }, [animationEl]);

  return (
    <div className="absolute right-2 items-stretch place-content-stretch text-white flex">
      {throbberVisible && (
        <div
          className={classNames(
            'absolute z-10 animate-spin rounded-full top-2 left-2 h-4 w-4 border-b-2 border-current mr-2',
          )}
        />
      )}
      <div
        className={classNames(
          'relative pl-4 py-2 rounded-l-full leading-none uppercase font-mono bg-grey-600 transition-transform duration-150 translate-x-full',
          isLoading ? 'translate-x-0' : 'translate-x-4',
        )}
        ref={setAnimationEl}
      >
        <div className="h-4 w-4"></div>
      </div>
      <div className="relative py-2 leading-none uppercase font-mono bg-grey-600">
        <p className="hidden sm:block font-thin">Search for database</p>
        <p className="sm:hidden">Search</p>
      </div>
      <div className="w-4 bg-grey-600 rounded-r-full" />
    </div>
  );
}

export default function ShowDatabases({
  searchValue,
  setSearchValue,
  allDatabases,
  initialDatabases,
  fallback,
  loadAll,
  isLoading,
}: {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  initialDatabases: DatabaseListEntry[];
  allDatabases?: DatabaseListEntry[];
  fallback: DatabaseListEntry | null;
  loadAll?: () => void;
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
    if (correctedDatabases == null) return;
    if (searchValue.length > 0) {
      const f = correctedDatabases.filter((db) =>
        db.title.toUpperCase().includes(searchValue.toUpperCase()),
      );
      if (f.length > 0 || fallback == null) {
        setFilteredDatabases(f);
      } else {
        setFilteredDatabases([fallback]);
      }
    } else {
      setFilteredDatabases(null);
    }
  }, [correctedDatabases, searchValue, fallback]);

  const toggleShowAll = useCallback(() => {
    loadAll?.();
    setShowAll((old) => !old);
  }, [loadAll]);

  const renderList = showAll
    ? correctedDatabases ?? initialDatabases
    : initialDatabases;

  const searchLoading = !true || (isLoading && searchValue.length > 0);
  const showAllLoading = isLoading && showAll;

  return (
    <>
      <div className="relative flex w-full items-center mb-10">
        <input
          className="uppercase w-full py-3 pl-6 pr-28 sm:pr-60 border-grey-300 border rounded-full font-mono outline-none placeholder:text-[#BFD6E2]"
          type="text"
          value={searchValue}
          onChange={({ target }) => setSearchValue(target.value)}
          onFocus={loadAll}
          placeholder="Enter database Name"
        />
        <SearchBadge isLoading={searchLoading} />
      </div>
      <div className="overflow-hidden relative flex items-start">
        <DatabaseList
          databases={filteredDatabases != null ? initialDatabases : renderList}
          className={classNames(
            filteredDatabases != null &&
              'invisible pointer-events-none select-none',
            searchLoading && 'opacity-40',
          )}
        />
        {filteredDatabases && (
          <DatabaseList
            databases={filteredDatabases}
            className="relative right-full visible"
          />
        )}
      </div>
      {searchValue === '' && (
        <ThrobbingButton
          isLoading={showAllLoading}
          className="text-[#BFD6E2] font-mono mt-5 p-5 self-center"
          onClick={toggleShowAll}
          delay={300}
        >
          {showAll && correctedDatabases != null ? 'SHOW' : 'LOAD'}{' '}
          {showAll && correctedDatabases != null ? 'LESS -' : 'MORE +'}
        </ThrobbingButton>
      )}
    </>
  );
}
