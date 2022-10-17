import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Documents', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ISideBar {
  sidebar: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
}

const SideBar: React.FC<ISideBar> = ({ sidebar }) => {
  return (
    <>
      <div className={classNames(sidebar ? 'hidden' : '', 'z-40 lg:hidden')}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />

        <div className="absolute right-0 top-0 left-auto flex h-screen w-full md:w-5/12">
          <div className="flex w-full flex-1 flex-col bg-white">
            <div className="h-0 flex flex-col flex-1 items-center justify-center overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 space-y-1 px-2 flex flex-col items-center">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-3xl md:text-2xl font-medium rounded-md',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 items-center justify-center border-t border-gray-200 p-4">
              {/* ----------DOWNLOAD LINK START  ----------*/}
              <Link href="/" aria-label="Home">
                <a className="group block flex-shrink-0 w-full border border-transparent px-4 py-2 text-lg rounded-full text-white text-center bg-black">
                  DOWNLOAD FOR FREE
                </a>
              </Link>
              {/* ----------DOWNLOAD LINK END  ----------*/}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
