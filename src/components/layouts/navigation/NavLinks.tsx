import MaybeLink from '../../contentful/MaybeLink';
import type { Menu } from '../../../utils/menus';

interface INavLinks {
  navigation: Menu;
}

const NavLinks: React.FC<INavLinks> = ({ navigation }) => {
  return (
    <>
      {navigation &&
        navigation?.menuItems?.map((menuItem) => (
          <MaybeLink
            key={menuItem?.id}
            href={menuItem?.targetUrl}
            className="relative z-10 hidden lg:inline-flex flex-auto -my-2 -mx-3 rounded-lg px-3 py-2 text-base md:text-xs lg:text-xs xl:text-base 2xl:text-lg text-gray-700 hover:text-gray-900"
          >
            {menuItem?.title}
          </MaybeLink>
        ))}
    </>
  );
};

export default NavLinks;
