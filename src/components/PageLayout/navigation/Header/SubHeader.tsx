import MaybeLink from '../../../contentful/MaybeLink';

import React from 'react';
import { Popover } from '@headlessui/react';
import classNames from 'classnames';

type PopoverProps = Parameters<typeof Popover<'div'>>[0];

export interface PopoverProviderProps {
  children: PopoverProps['children'];
}

function Content() {
  return (
    <div
      className={classNames(
        'h-12 bg-grey-900 text-white text-xs font-mono px-4 sm:px-6 lg:px-16',
      )}
    >
      <div
        className={classNames(
          'flex h-full max-w-7xl mx-auto items-center bg-grey-900 text-white text-xs font-mono justify-between',
        )}
      >
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md mr-3 flex justify-center items-center border border-[rgba(0,0,0,0.25)]">
            <img
              src="/images/image 39.png"
              alt="postgreSQL"
              className="h-4 w-4"
            />
          </div>
          <div className="font-sans font-bold mr-3">PostgreSQL</div>
          <div className="text-grey-500 hidden sm:block">
            {'/* TESTED FOR VERSION 8-11 */'}
          </div>
        </div>
        <div className="uppercase flex gap-x-9">
          <MaybeLink className="text-grey-500">[ overview ]</MaybeLink>
          <MaybeLink className="hidden xl:block">
            Supported objects {'->'}
          </MaybeLink>
          <MaybeLink className="hidden xl:block">fatures {'->'}</MaybeLink>
          <MaybeLink className="hidden xl:block">Jdbc drivers {'->'}</MaybeLink>
          <MaybeLink className="text-primary-500">download ↓</MaybeLink>
        </div>
      </div>
    </div>
  );
}

function StickyWrapper({ children }: PopoverProviderProps) {
  return <Popover className="sticky top-0 w-full z-20">{children}</Popover>;
}

export default function SubHeader() {
  return (
    <StickyWrapper>
      <Content />
    </StickyWrapper>
  );
}
