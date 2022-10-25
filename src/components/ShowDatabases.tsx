import React, { useState } from 'react';

const databases = [
  { label: 'oracle', imageUrl: '/images/azure.png' },
  { label: 'mysql', imageUrl: '/images/azure.png' },
  { label: 'postgresql', imageUrl: '/images/azure.png' },
  { label: 'microsoft sql server', imageUrl: '/images/azure.png' },
  { label: 'sqlite', imageUrl: '/images/azure.png' },
  { label: 'mongo db', imageUrl: '/images/azure.png' },
  { label: 'oracle cloud', imageUrl: '/images/azure.png' },
  { label: 'amazon redshift', imageUrl: '/images/azure.png' },
  { label: 'AZURE SQL DB', imageUrl: '/images/azure.png' },
  { label: 'db2', imageUrl: '/images/azure.png' },
  { label: 'derby', imageUrl: '/images/azure.png' },
  { label: 'elasticsearch', imageUrl: '/images/azure.png' },
];

export default function ShowDatabases(): JSX.Element {
  const [searchValue, setSearchValue] = useState('');
  const [filteredDatabases, setFilteredDatabases] = useState<
    typeof databases | null
  >(null);

  const filterData = () => {
    if (searchValue.length > 0) {
      const f = databases.filter((db) =>
        db.label.toUpperCase().match(searchValue.toUpperCase()),
      );
      setFilteredDatabases(f);
    } else {
      setFilteredDatabases(null);
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="relative flex w-full items-center mb-10">
        <input
          className="uppercase w-full py-3 pl-6 pr-28 sm:pr-60 border-zinc-300 border rounded-full font-mono"
          type="text"
          value={searchValue}
          onChange={({ target }) => setSearchValue(target.value)}
          placeholder="Enter database Name"
        />
        <button
          className="absolute right-2 py-2 px-4 rounded-full text-white leading-none uppercase font-mono"
          style={{ backgroundColor: '#3B3F42' }}
          onClick={filterData}
        >
          <p className="hidden sm:block">Search for database</p>
          <p className="sm:hidden">Search</p>
        </button>
      </div>
      <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(filteredDatabases || databases).map(({ label, imageUrl }) => (
          <button
            key={label}
            className="w-full flex justify-between px-4 py-5 rounded-lg shadow-imageShadow border border-grey-300 bg-buttonBackground font-mono uppercase cursor-pointer"
            onClick={() => {
              console.log('click item');
            }}
          >
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-[5px] bg-buttonBackground border px-1 flex items-center">
                <img src={imageUrl} alt={label} />
              </div>
              <label className="ml-2 cursor-pointer">{label}</label>
            </div>
            <label className="cursor-pointer text-primary-500">{'->'}</label>
          </button>
        ))}
      </div>
    </div>
  );
}
