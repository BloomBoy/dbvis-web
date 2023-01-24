import MaybeLink from '../../../contentful/MaybeLink';

import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

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
  title,
  subTitle,
  icon,
  links,
}: {
  title: string;
  subTitle?: string;
  icon?: {
    src: string;
    alt: string;
  };
  links: {
    id: string;
    href?: string;
    text: string;
    suffix?: string;
    className?: string;
  }[];
}) {
  const asPath = useRouter().asPath;
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
            {icon != null && (
              <div className="h-8 w-8 rounded-md mr-3 flex justify-center items-center border border-[rgba(0,0,0,0.25)]">
                <img src={icon.src} alt={icon.alt} className="h-4 w-4" />
              </div>
            )}
            <div className="font-sans font-bold mr-3">{title}</div>
            {subTitle ? (
              <div className="text-grey-500 uppercase hidden sm:block quote-decoration">
                {subTitle}
              </div>
            ) : null}
          </div>
          <div className="uppercase flex gap-x-9">
            {links.map((link) => (
              <MaybeLink
                key={link.id}
                href={
                  link.href == null || asPath !== link.href
                    ? link.href
                    : undefined
                }
                className={classNames(
                  link.href != null && asPath === link.href && 'text-grey-500',
                  link.className,
                )}
              >
                {link.href != null && asPath === link.href && ' ['}
                {link.text}
                {(link.href == null || asPath !== link.href) &&
                  ` ${link.suffix}`}
                {link.href != null && asPath === link.href && ' ]'}
              </MaybeLink>
            ))}
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
