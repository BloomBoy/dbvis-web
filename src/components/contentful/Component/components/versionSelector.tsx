import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';

const XMLListData = [
  {
    id: 'a-string-1',
    latest: true,
    title: 'DbVisualizer  14.0 - 14.0.1',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-2',
    latest: false,
    title: 'DbVisualizer  13.0 - 13.0.6',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-3',
    latest: false,
    title: 'DbVisualizer  12.1 - 12.1.9',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-4',
    latest: false,
    title: 'DbVisualizer  12.0 - 12.0.9',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-5',
    latest: false,
    title: 'DbVisualizer  11.0 - 11.0.7',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-7',
    latest: false,
    title: 'DbVisualizer  10.0 - 10.0.27',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-8',
    latest: false,
    title: 'DbVisualizer  9.5 - 9.5.8',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-9',
    latest: false,
    title: 'DbVisualizer  9.2 - 9.2.17',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
  {
    id: 'a-string-10',
    latest: false,
    title: 'DbVisualizer  9.1 - 9.1.13',
    releaseDate: '2022-10-14',
    slug: '/a-string-1',
  },
];

function VersionSelectorComponent(): JSX.Element | null {
  const [selectedVersion, setSelectedVersion] = useState(XMLListData[0]);

  return (
    <div className="">
      <div className="text-sm md:text-base top-16 w-full font-mono">
        <Listbox value={selectedVersion} onChange={setSelectedVersion}>
          <div className="relative mt-1 z-10">
            <Listbox.Button
              className="relative w-full cursor-default rounded-full bg-white py-3 pl-6 pr-10 text-left border border-grey-200"
              style={{ boxShadow: '0px 0px 18px rgba(0, 0, 0, 0.02)' }}
            >
              <span className="block truncate uppercase">
                Version: {selectedVersion.title}
                {selectedVersion.latest ? (
                  <span className="text-primary ml-2">[Latest]</span>
                ) : (
                  ''
                )}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 py-2 m-2 text-white bg-grey-600 rounded-full">
                <span>CHANGE</span>
                <span className="hidden md:inline-block ml-2">VERSION</span>
                <span className="ml-2">▼</span>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 border border-grey-200"
                style={{ boxShadow: '0px 0px 18px rgba(0, 0, 0, 0.02)' }}
              >
                {XMLListData.map((version) => (
                  <Listbox.Option
                    key={version.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-grey-600 text-white' : 'text-gray-600'
                      }`
                    }
                    value={version}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {version.title}
                          {version.latest ? (
                            <span className="text-primary ml-2">[Latest]</span>
                          ) : (
                            ''
                          )}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                            <CheckIcon
                              className="h-5 w-5 text-primary"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
}

const versionSelector = Object.assign(VersionSelectorComponent);

export default versionSelector;
