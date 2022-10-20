import Bars3Icon from './Bars3Icons';
import HeaderLogo from './HeaderLogo';
import MaybeLink from '../../contentful/MaybeLink';
import NavLinks from './NavLinks';
import SideBar from './SideBar';
import XMarkIcon from './XMarkIcon';

import { Popover } from '@headlessui/react';
import React from 'react';
import getMenu from '../../../utils/menus';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigation = getMenu('main-menu');

export default function Header() {
  return (
    <div className="h-20">
      <Popover className="fixed top-0 left-0 right-0 z-40 bg-white">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between px-4 h-20 sm:px-6 mx-auto max-w-[calc(1300px)] lg:justify-start md:space-x-10">
              <div>
                <MaybeLink href="/" aria-label="Home">
                  <HeaderLogo className="h-12 md:h-13 lg:h-20 w-auto" />
                </MaybeLink>
              </div>

              <div
                className={classNames(
                  open ? 'hidden' : '',
                  '-my-2 -mr-2 lg:hidden',
                )}
              >
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-black hover:text-gray-900">
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-8 w-8" aria-hidden="true" />
                </Popover.Button>
              </div>
              <div
                className={classNames(
                  open ? '' : 'hidden',
                  '-my-2 -mr-2 lg:hidden',
                )}
              >
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
          </>
        )}
      </Popover>
    </div>
  );
}
