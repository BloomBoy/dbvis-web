import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import MaybeLink from '../../contentful/MaybeLink';
import type { Menu } from '../../../utils/menus';
import classNames from 'classnames';

interface ISideBar {
  navigation: Menu;
}

const SideBar: React.FC<ISideBar> = ({ navigation }) => {
  const innherHeight = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  useEffect(() => {
    window.addEventListener('resize', innherHeight);

    return () => {
      window.removeEventListener('resize', innherHeight);
    };
  }, []);
  return (
    <Transition
      as={Fragment}
      enter="duration-200 ease-out"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="duration-100 ease-in"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Popover.Panel
        focus
        className="relative origin-right transform transition lg:hidden"
      >
        <div
          className={classNames(
            'sidebar-height',
            'absolute top-0 left-1/2 -translate-x-1/2 md:right-0 md:translate-x-0 bg-white w-screen md:w-1/2 rounded-lg',
          )}
        >
          <div className="flex w-full h-full flex-col justify-between bg-white">
            <div className="flex flex-col flex-1 items-center justify-center overflow-y-auto pb-4">
              <nav className="space-y-1 px-2 flex flex-col items-center justify-center">
                {navigation?.menuItems?.map((menuItem) => (
                  <MaybeLink
                    key={menuItem.id}
                    href={menuItem.targetUrl}
                    className="text-gray-900 group flex items-center px-2 py-2 text-2xl md:text-2xl font-medium rounded-md"
                  >
                    {menuItem.title}
                  </MaybeLink>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 items-center justify-center p-4">
              <MaybeLink
                href="/"
                aria-label="Home"
                className="group block flex-shrink-0 w-full mb-2 border border-transparent px-4 py-2 text-lg rounded-full text-white text-center bg-black"
              >
                DOWNLOAD FOR FREE
              </MaybeLink>
            </div>
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};

export default SideBar;
