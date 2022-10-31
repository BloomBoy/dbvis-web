import React, { Fragment, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import MaybeLink from './contentful/MaybeLink';

function DropDownButton() {
  let timeout = undefined as NodeJS.Timeout | undefined; // NodeJS.Timeout
  const timeoutDuration = 200;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    return buttonRef.current?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
  };

  const onMouseEnter = (open: boolean) => {
    clearTimeout(timeout);
    if (open) return;
    return buttonRef.current?.click();
  };

  const onMouseLeave = (open: boolean) => {
    if (!open) return;
    timeout = setTimeout(() => closePopover(), timeoutDuration);
  };

  return (
    <Popover as="div" className="relative hidden md:flex justify-center">
      {({ open }) => (
        <div
          onMouseLeave={onMouseLeave.bind(null, open)}
          className="flex justify-center"
        >
          <Popover.Button ref={buttonRef} className="absolute outline-none" />
          <MaybeLink
            className="bg-black self-center text-white rounded-3xl p-3 px-8 font-mono uppercase outline-none"
            onMouseEnter={onMouseEnter.bind(null, open)}
            onMouseLeave={onMouseLeave.bind(null, open)}
            href="/downloads"
          >
            Download for free ↓
          </MaybeLink>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 translate-y-1"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 translate-y-1"
          >
            <Popover.Panel
              className="absolute top-12 pt-2"
              onMouseEnter={onMouseEnter.bind(null, open)}
              onMouseLeave={onMouseLeave.bind(null, open)}
            >
              <div className="rounded-xl overflow-hidden shadow-imageShadow">
                <div className="font-mono font-light quote-decoration uppercase text-grey-500 text-start pb-3 pt-4 bg-buttonBackground px-6 text-xs">
                  Recommended installer
                </div>
                <div className="px-6 bg-buttonBackground">
                  <div className="flex py-5">
                    <div className="flex mr-28">
                      <img
                        src="/images/apple_logo.png"
                        alt="apple logo"
                        className="mr-3.5 self-center"
                      />
                      <div>
                        <span className="block text-xs font-mono">
                          macOS Intel
                        </span>
                        <span className="block text-xs font-mono text-grey-500">
                          with Java
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="uppercase font-light font-mono text-xs rounded-3xl py-1 px-5 bg-primary-500 self-center"
                    >
                      Download setup ↓
                    </button>
                  </div>
                  <div className="flex justify-center -mx-2 py-4 border-t border-dashed border-grey-500">
                    <MaybeLink
                      className="font-mono text-[10px] uppercase text-primary-500 underline"
                      href="/"
                    >
                      View other installers {'->'}
                    </MaybeLink>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
}

export default DropDownButton;
