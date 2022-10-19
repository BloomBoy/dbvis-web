import MaybeLink from '../../contentful/MaybeLink';

import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { Menu } from '../../../utils/menus';

interface ISideBar {
  navigation: Menu;
}

const SideBar: React.FC<ISideBar> = ({ navigation }) => {
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
        <div className="absolute top-0 right-0 bg-white w-screen md:w-1/2 h-[calc(100vh-5rem)] rounded-lg">
          <div className="flex w-full h-full flex-1 flex-col justify-between bg-white">
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
