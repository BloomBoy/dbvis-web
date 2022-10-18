import { useState } from 'react';

import HeaderLogo from './HeaderLogo';
import MaybeLink from '../contentful/MaybeLink';
import NavLinks from './NavLinks';
import SideBar from './SideBar';
import getMenu from '../../utils/menues';

interface IMenuIcon {
  className: string;
}

const navigation = getMenu('main-menu');

const MenuIcon: React.FC<IMenuIcon> = (props) => {
  return (
    <>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M5 6h14M5 18h14M5 12h14"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

const Header = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-0 lg:px-8">
        <div className="relative z-10 flex items-center justify-between bg-white lg:bg-transparent">
          <div className="lg:flex lg:gap-10 lg:items-center">
            <MaybeLink href="/" aria-label="Home">
              <HeaderLogo className="h-14 md:h-15 lg:h-20 w-auto" />
            </MaybeLink>
            <NavLinks navigation={navigation} />
          </div>
          <div className="lg:w-4/12 lg:flex lg:items-center lg:justify-end">
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
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
              onClick={() => setSidebar(!sidebar)}
            >
              <MenuIcon className="w-12 h-12" />
            </button>
          </div>
        </div>
      </div>
      <SideBar sidebar={sidebar} setSidebar={setSidebar} />
    </>
  );
};

export default Header;
