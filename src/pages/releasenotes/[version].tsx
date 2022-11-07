import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import MaybeLink from 'src/components/contentful/MaybeLink';
import { CheckIcon } from '@heroicons/react/20/solid';

type ReleaseNotesPageProps = {
  data: ReleaseNoteType;
};

type ReleaseNoteType = {
  id: string;
  title: string;
  version: string;
  releaseDate: string;
  slug: string;
};

const XMLData = {
  id: 'a-string-1',
  title: 'DbVisualizer',
  version: '14.0 - 14.0.1',
  releaseDate: '2022-10-14',
  slug: '/a-string-1',
  improvments: [
    {
      id: 'a-string-improvment-1',
      title: 'DbVisualizer  14.0 - 14.0.1',
      details: 'DbVisualizer  14.0 - 14.0.1',
    },
    {
      id: 'a-string-improvment-2',
      title: 'DbVisualizer  14.0 - 14.0.1',
      details: 'DbVisualizer  14.0 - 14.0.1',
    },
  ],
  bugfixes: [
    {
      id: 'a-string-bugfixes-1',
      title: 'DbVisualizer  14.0 - 14.0.1',
      details: 'DbVisualizer  14.0 - 14.0.1',
    },
    {
      id: 'a-string-bugfixes-2',
      title: 'DbVisualizer  14.0 - 14.0.1',
      details: 'DbVisualizer  14.0 - 14.0.1',
    },
  ],
};

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

export default function ReleaseNotesPage({}: ReleaseNotesPageProps): JSX.Element {
  const [selectedVersion, setSelectedVersion] = useState(XMLListData[0]);

  return (
    <>
      <div className="mx-auto p-8 max-w-7xl">
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
        >
          {XMLData.version} WAS RELEASED ON {XMLData.releaseDate}
        </h3>
        <h1 className="text-6xl font-bold">Release notes.</h1>
        <hr className="border-dashed border-grey-500 mt-16 mb-8 opacity-20" />
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
        >
          {XMLData.version} Quick Links
        </h3>
        <ul className="flex felx-row gap-6">
          <li>
            <MaybeLink href="a-link" className="text-primary">
              WHAT&apos;S NEW -&gt;
            </MaybeLink>
          </li>
          <li>
            <MaybeLink href="a-link" className="text-primary">
              RELEASE NOTES -&gt;
            </MaybeLink>
          </li>
          <li>
            <MaybeLink href="a-link" className="text-primary">
              USER GUIDE<sup>HTML</sup>;
            </MaybeLink>
          </li>
          <li>
            <MaybeLink href="a-link" className="text-primary">
              USER GUIDE<sup>PDF</sup>;
            </MaybeLink>
          </li>
        </ul>
        <hr className="border-dashed border-grey-500 mt-8 mb-16 opacity-20" />
      </div>

      <div
        className="width-full"
        style={{ backgroundColor: 'rgb(43, 43, 43)' }}
      >
        <div
          className="mx-auto p-8 w-full"
          style={{
            background:
              'linear-gradient(360deg, #252525 -48.75%, #2B2B2B 100%)',
          }}
        >
          <div className="mx-auto p-8 max-w-7xl">
            <h2 className="text-white font-semibold my-6 text-5xl">
              {XMLData.version} WAS RELEASED ON {XMLData.releaseDate}
            </h2>
            <h3
              className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
            >
              IMPROVMENTS
            </h3>
            <table className="">
              <thead className="">
                <tr className="">
                  <th className="max-w-[45%]">IMPROVEMENT</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {XMLData.improvments.map((improvment) => (
                  <tr key={improvment.id}>
                    <td className="max-w-[45%]">{improvment?.title}</td>
                    <td className="text-grey-400">{improvment?.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="mx-auto p-8 w-full"
          style={{
            background:
              'linear-gradient(360deg, #252525 -48.75%, #2B2B2B 100%)',
          }}
        >
          <div className="mx-auto p-8 max-w-7xl">
            <h3
              className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
            >
              BUGFIXES
            </h3>
            <table className="">
              <thead className="">
                <tr className="">
                  <th className="max-w-[45%]">BUGFIX</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {XMLData.bugfixes.map((bugfix) => (
                  <tr key={bugfix.id}>
                    <td className="max-w-[45%]">{bugfix?.title}</td>
                    <td className="text-grey-400">{bugfix?.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mx-auto p-8 max-w-7xl">
        <div className="w-1/2">
          <h3
            className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
          >
            System Requirements
          </h3>
          <h4 className="font-bold">OS Support:</h4>
          <div>
            RICH TEXT HERE. OS Support: Windows 64-bit 11/10/8/7 Linux macOS
            10.11+ Windows 64-bit: Java 17 is required macOS: Java 17 is
            required Linux: Java 17 is required The free Eclipse Temurin ↗ Java
            Runtime is bundled with installers marked With Java VM. Known Java
            issues for Windows, Linux, macOS users ↗
          </div>
        </div>
      </div>
      <div className="mx-auto p-8 max-w-7xl flex flex-col md:flex-row">
        <div className="w-1/2">Image</div>
        <div className="w-1/2">
          <h3 className="font-mono font-light quote-decoration uppercase text-grey-500 mb-8">
            Evaluate pro version
          </h3>
          <h2 className="text-4xl font-bold mb-4">
            DbVisualizer Pro evaluation.
          </h2>
          <div>
            RICH TEXT HERE. OS Support: Windows 64-bit 11/10/8/7 Linux macOS
            10.11+ Windows 64-bit: Java 17 is required macOS: Java 17 is
            required Linux: Java 17 is required The free Eclipse Temurin ↗ Java
            Runtime is bundled with installers marked With Java VM. Known Java
            issues for Windows, Linux, macOS users ↗
          </div>
        </div>
      </div>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
        >
          Change version
        </h3>
        <div className="">
          <div className="text-sm md:text-base top-16 w-full font-mono">
            <Listbox value={selectedVersion} onChange={setSelectedVersion}>
              <div className="relative mt-1">
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
                                <span className="text-primary ml-2">
                                  [Latest]
                                </span>
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
      </div>
    </>
  );
}
