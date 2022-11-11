import React from 'react';
import { Tab } from '@headlessui/react';
import OSIcon from '../Icon';
import MaybeLink from '../contentful/MaybeLink';

type InstallerTypeProp = {
  id: string | number;
  title: string;
  url: string;
  os: string;
  text: string;
};

export default function AllInstallers({
  data,
}: {
  data: InstallerTypeProp[];
}): JSX.Element {
  const byOS: Record<string, InstallerTypeProp[]> = {};

  data.forEach((entry) => {
    if (!byOS[entry.os]) {
      byOS[entry.os] = [];
    }
    byOS[entry.os].push(entry);
  });

  return (
    <>
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-6`}
      >
        All Installers - test
      </h3>
      <Tab.Group>
        <Tab.List>
          {Object.entries(byOS).map(([os]) => (
            <Tab
              key={os}
              className="text-base md:text-xl font-mono py-2 my-8 pr-6 ui-not-selected:text-primary ui-selected:text-black ui-selected:underline underline-offset-8"
            >
              {os}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full border-b border-dashed pb-10">
          {Object.entries(byOS).map(([os, installers]) => (
            <Tab.Panel
              key={os}
              className="flex flex-col md:flex-row gap-8 w-full"
            >
              {installers.map((installer) => (
                <div
                  className="flex flex-row gap-4 items-center justify-between w-full md:w-1/2 bg-grey-300 rounded-lg p-4 font-mono "
                  key={installer.id}
                  style={{ boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.05)' }}
                >
                  <OSIcon
                    os={installer.os}
                    className=""
                    style={{ padding: '0px' }}
                    size={30}
                  />
                  <div className="flex flex-row gap-4 grow items-center">
                    <div>{installer.title}</div>
                    <div className="text-grey-500">{installer.text}</div>
                  </div>
                  <MaybeLink
                    href={installer.url}
                    className="text-primary hover:text-primary-700 underline flex-grow-0 flex-shrink-0 basis-auto"
                  >
                    Download ↓
                  </MaybeLink>
                </div>
              ))}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
