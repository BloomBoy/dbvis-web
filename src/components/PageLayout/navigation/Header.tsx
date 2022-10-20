import Bars3Icon from './Bars3Icons';
import HeaderLogo from './HeaderLogo';
import MaybeLink from '../../contentful/MaybeLink';
import NavLinks from './NavLinks';
import SideBar from './SideBar';
import XMarkIcon from './XMarkIcon';

import React, { useEffect } from 'react';
import { Popover } from '@headlessui/react';
import getMenu from '../../../utils/menus';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigation = getMenu('main-menu');

const MARGIN = 50;

export default function Header() {
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>(
    null,
  );
  const [topBarRef, setTopBarRef] = React.useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef || !topBarRef) return;
    let lastScroll = window.scrollY;
    let lastDownHeight = window.scrollY;
    let lastUpHeight = window.scrollY;
    wrapperRef.style.setProperty('height', `${lastDownHeight}px`);
    const scrollHandler = (ev: Event) => {
      if (ev.target != window.document) return;
      if (window.scrollY > lastScroll) {
        const newHeight = Math.min(
          lastDownHeight,
          window.scrollY + topBarRef.clientHeight,
        );
        if (newHeight !== lastDownHeight) {
          wrapperRef.style.setProperty('height', `${newHeight}px`);
          lastDownHeight = window.scrollY;
          lastUpHeight = lastDownHeight - topBarRef.clientHeight + MARGIN;
        }
      } else if (window.scrollY < lastScroll) {
        const newHeight = Math.max(lastUpHeight, window.scrollY - MARGIN);
        if (newHeight !== lastUpHeight) {
          wrapperRef.style.setProperty('height', `${newHeight}px`);
          lastUpHeight = window.scrollY;
          lastDownHeight = lastUpHeight - topBarRef.clientHeight;
        }
      }
      lastScroll = window.scrollY;
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [wrapperRef, topBarRef]);
  return (
    <div className="absolute w-full" ref={setWrapperRef}>
      <Popover ref={setTopBarRef} className="sticky z-40 top-0 w-full bg-white">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between px-4 h-20 sm:px-6 mx-auto max-w-[calc(1300px)] lg:justify-start md:space-x-10 w-full">
              <div>
                <MaybeLink href="/" aria-label="Home">
                  <HeaderLogo className="h-12 md:h-13 lg:h-20 w-auto" />
                </MaybeLink>
              </div>

              <div className={classNames('-my-2 -mr-2 lg:hidden')}>
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-black hover:text-gray-900">
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-8 w-8" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div
              className={classNames(
                open ? '' : 'hidden',
                'absolute w-full top-0',
              )}
            >
              <div className="top-0 w-full fixed bg-white">
                <div className="flex items-center justify-between px-4 h-20 sm:px-6 mx-auto max-w-[calc(1300px)] lg:justify-start md:space-x-10 w-full">
                  <div>
                    <MaybeLink href="/" aria-label="Home">
                      <HeaderLogo className="h-12 md:h-13 lg:h-20 w-auto" />
                    </MaybeLink>
                  </div>
                  <div className="-my-2 -mr-2 lg:hidden">
                    <div>
                      <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-black hover:text-gray-900">
                        <span className="sr-only">Open menu</span>
                        <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                      </Popover.Button>
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
                      <Popover.Group as="nav" className="flex space-x-5">
                        <NavLinks navigation={navigation} />
                      </Popover.Group>

                      <div className="flex items-center lg:ml-12">
                        <MaybeLink
                          href="/download"
                          className="
                    hidden lg:block lg:px-4 xl:px-5 2xl:px-6 lg:py-1 xl:py-2 2xl:py-3 
                    border border-transparent text-xs xl:text-sm 2xl:text-base font-medium 
                    rounded-full text-white bg-black
                  "
                        >
                          DOWNLOAD FOR FREE
                        </MaybeLink>
                      </div>
                    </div>
                  </div>
                  <SideBar navigation={navigation} />
                </div>
              </div>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
}
