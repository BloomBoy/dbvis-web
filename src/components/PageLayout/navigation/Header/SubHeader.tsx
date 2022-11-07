import MaybeLink from '../../../contentful/MaybeLink';

import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import { DatabasePageEntry } from 'src/utils/contentful/databasePage';

const context = createContext<HTMLElement | null>(null);

export function SubHeaderProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [state, setState] = useState<HTMLElement | null>(null);

  return (
    <context.Provider value={state}>
      <div className="inline" ref={setState}></div>
      {children}
    </context.Provider>
  );
}

export default function SubHeader({
  fields,
}: {
  fields: DatabasePageEntry['fields'];
}) {
  const { listTitle, logo, slug } = fields;
  const el = (
    <Popover className="sticky top-0 w-full z-20">
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
                src={logo?.fields.file.url}
                alt="postgreSQL"
                className="h-4 w-4"
              />
            </div>
            <div className="font-sans font-bold mr-3">{listTitle}</div>
            <div className="text-grey-500 hidden sm:block">
              {'/* TESTED FOR VERSION 8-11 */'}
            </div>
          </div>
          <div className="uppercase flex gap-x-9">
            <MaybeLink href={`/database/${slug}`} className="text-grey-500">
              [ overview ]
            </MaybeLink>
            <MaybeLink
              href={`/database/${slug}/support`}
              className="hidden xl:block"
            >
              Supported objects {'->'}
            </MaybeLink>
            <MaybeLink
              href={`/database/${slug}/features`}
              className="hidden xl:block"
            >
              features {'->'}
            </MaybeLink>
            <MaybeLink
              href={`/database/${slug}/driver`}
              className="hidden xl:block"
            >
              Jdbc drivers {'->'}
            </MaybeLink>
            <MaybeLink className="text-primary-500" href="/download">
              download ↓
            </MaybeLink>
          </div>
        </div>
      </div>
    </Popover>
  );

  const portalRoot = useContext(context);
  if (portalRoot === null) {
    return el;
  }
  return ReactDOM.createPortal(el, portalRoot);
}
