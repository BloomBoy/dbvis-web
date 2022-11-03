import * as Contentful from 'contentful';
import React, { Fragment, useCallback, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import MaybeLink from './contentful/MaybeLink';
import classNames from 'classnames';

const TIMEOUT_DURATION = 500;
function DropDownButton({
  children,
  classes,
}: {
  children?: React.ReactNode;
  classes?: Contentful.EntryFields.Symbol[];
}) {
  const timeoutRef = useRef<NodeJS.Timeout | number>(); // NodeJS.Timeout
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);

  const closePopover = () => {
    if (!openRef.current) return;
    return buttonRef.current?.dispatchEvent(
      new MouseEvent('click', {
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
  };

  const onMouseEnter = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (openRef.current) return;
    return buttonRef.current?.dispatchEvent(
      new MouseEvent('click', {
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!openRef.current) return;
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    timeoutRef.current = setTimeout(() => closePopover(), TIMEOUT_DURATION);
  }, []);

  // check if the classes contains any of the justify
  // classes so we can overwrte the positioning
  const containsPositioning = classes?.some((r) => /^justify-.+/.test(r));

  return (
    <Popover
      as="div"
      className={classNames(
        'relative hidden md:flex',
        !containsPositioning && 'justify-center',
        ...(classes || []),
      )}
    >
      {({ open }) => {
        openRef.current = open;
        return (
          <div
            className={classNames(
              'flex',
              !containsPositioning && 'justify-center',
              classes?.find((c) => /^justify-.+/.test(c)),
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Popover.Button ref={buttonRef} className="absolute outline-none" />
            <MaybeLink
              className="bg-black self-center text-white rounded-full p-3 px-8 font-mono uppercase outline-none justify"
              href="/download"
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
              <Popover.Panel className="absolute top-12 pt-2">
                <div className="rounded-xl overflow-hidden shadow-imageShadow">
                  <div className="font-mono font-light quote-decoration uppercase text-grey-500 text-start pb-3 pt-4 bg-badgeBackground px-6 text-xs">
                    Recommended installer
                  </div>
                  <div className="px-6 bg-badgeBackground">
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
                        {children}
                      </button>
                    </div>
                    <div className="flex justify-center -mx-2 py-4 border-t border-dashed border-grey-500">
                      <MaybeLink
                        className="font-mono text-[10px] uppercase text-primary-500 underline"
                        href="/download"
                      >
                        View other installers {'->'}
                      </MaybeLink>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        );
      }}
    </Popover>
  );
}

export default DropDownButton;
