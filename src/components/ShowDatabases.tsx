import React, { useState } from 'react';

export default function ShowDatabases(): JSX.Element {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const databases = [
    { label: 'oracle', imageUrl: 'some url' },
    { label: 'sql', imageUrl: 'some url' },
    { label: 'AZURE SQL DB', imageUrl: 'some url' },
    { label: 'mysql', imageUrl: 'some url' },
    { label: 'mongo db', imageUrl: 'some url' },
    { label: 'db2', imageUrl: 'some url' },
    { label: 'postgresql', imageUrl: 'some url' },
    { label: 'oracle cloud', imageUrl: 'some url' },
    { label: 'derby', imageUrl: 'some url' },
    { label: 'microsoft sql server', imageUrl: 'some url' },
    { label: 'amazon redshift', imageUrl: 'some url' },
    { label: 'elasticsearch', imageUrl: 'some url' },
  ];
  return (
    <div className="flex flex-wrap">
      <div className="relative flex w-full items-center mb-10">
        <input
          className="uppercase w-full py-3 px-6 border-zinc-300 border rounded-full font-mono"
          type="text"
          value={searchValue || ''}
          onChange={({ target }) => setSearchValue(target.value)}
          placeholder="Enter database Name"
        />
        <button
          className="absolute right-2 py-2 px-4 rounded-full text-white leading-none uppercase font-mono"
          style={{ backgroundColor: '#3B3F42' }}
          onClick={() => console.log('now search')}
        >
          Search for database
        </button>
      </div>
      <div className="w-full grid gap-4 grid-cols-4">
        {databases.map(({ label }) => (
          <button
            key={label}
            className="w-full flex justify-between px-4 py-5 rounded-lg shadow-imageShadow border border-grey-300 bg-buttonBackground font-mono uppercase cursor-pointer"
            onClick={() => {
              console.log('click item');
            }}
          >
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-[5px] bg-buttonBackground border px-1 flex items-center">
                <img src={'/images/azure.png'} alt={label} />
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
