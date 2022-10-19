import MaybeLink from '../../../contentful/MaybeLink';
import type { Menu } from '../../../../utils/menus';

interface IFooterNavLinks {
  navigation: Menu;
}

const FooterNavLinks: React.FC<IFooterNavLinks> = ({ navigation }) => {
  return (
    <div className="mt-12 grid grid-cols-2 xl:grid-cols-4 gap-8 xl:col-span-2 lg:mt-0">
      {navigation &&
        navigation?.menuItems?.map((menuItem) => (
          <div key={menuItem?.id} className="md:grid md:grid-cols-1 md:gap-4">
            <div>
              <h3 className="text-base font-medium text-black">
                {menuItem?.title}
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {menuItem?.subItems?.map((subItem) => (
                  <li key={subItem?.id}>
                    <MaybeLink
                      href={subItem?.targetUrl}
                      className="text-base text-gray-900 hover:text-black"
                    >
                      {subItem.title}
                    </MaybeLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FooterNavLinks;
