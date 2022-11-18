import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { KnownOS, knownOsNameMap } from 'src/utils/deviceSystemConstants';
import { SafeEntryFields } from 'src/utils/contentful';
import RichText from '../RichText';
import OSIcon, { hasOSIcon as osHasIcon } from '../Icon';

type InstructionTypeProp = {
  id: string;
  title: string;
  os: KnownOS;
  text: SafeEntryFields.RichText;
};

export default function InstallationInstructions({
  data,
}: {
  data: InstructionTypeProp[];
}): JSX.Element {
  return (
    <>
      <h3
        className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-6`}
      >
        Installation Instructions
      </h3>
      <div className="pb-16">
        {data.map((instruction) => (
          <Disclosure key={instruction.id}>
            {({ open }) => (
              <div
                className="rounded-lg bg-grey-300 p-3 mb-2 font-mono"
                style={{
                  background:
                    'linear-gradient(360deg, #252525 -48.75%, #2B2B2B 100%)',
                  boxShadow: '0px 0px 44px 0px rgba(0, 0, 0, 0.25)',
                }}
              >
                <Disclosure.Button className="py-2 px-3 w-full">
                  <div className="w-full flex flex-row gap-4 rounded-md">
                    {osHasIcon(instruction.os) && (
                      <div className="self-center w-4 text-center">
                        <OSIcon
                          os={instruction.os}
                          style={{ padding: '0px' }}
                          size={16}
                        />
                      </div>
                    )}
                    <div className="text-white self-center md:w-1/12 text-left">
                      {knownOsNameMap[instruction.os]}
                    </div>
                    <div className="text-white uppercase text-left grow self-center">
                      {instruction.title}
                    </div>
                    <div className="text-primary underline underline-offset-2 uppercase self-center">
                      {open ? <div>COLLAPSE ✕</div> : <div>EXPAND +</div>}
                    </div>
                  </div>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel
                    static
                    className="text-grey-400 md:w-1/2 ml-12 mt-12 mb-8"
                  >
                    <RichText content={instruction.text} />
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </>
  );
}
