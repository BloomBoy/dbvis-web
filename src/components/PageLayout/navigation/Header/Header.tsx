import Bars3Icon from '../Bars3Icons';
import HeaderLogo from './HeaderLogo';
import MaybeLink from '../../../contentful/MaybeLink';
import NavLinks from '../NavLinks';
import SideBar from '../SideBar';
import XMarkIcon from '../XMarkIcon';

import React from 'react';
import { Popover } from '@headlessui/react';
import getMenu from '../../../../utils/menus';
import ScrollbackHeaderWrapper from './ScrollbackHeaderWrapper';
import classNames from 'classnames';

type PopoverProps = Parameters<typeof Popover<'div'>>[0];

export interface PopoverProviderProps {
  children: PopoverProps['children'];
}

type Props =
  | {
      behavior: 'sticky' | 'static';
      className?: string;
    }
  | {
      behavior: 'scrollup';
      scrollbackMargin?: number;
      stickyUntil?: number;
      className?: string;
    };

const navigation = getMenu('main-menu');

function Content({ className }: Props) {
  return (
    <div className={classNames(className, 'px-4 sm:px-6 lg:px-16 bg-white')}>
      <div className="max-w-7xl h-full mx-auto">
        <div className="h-full flex items-center justify-between md:space-x-10">
          <div className="">
            <MaybeLink href="/" aria-label="Home">
              <HeaderLogo className="h-12 md:h-13 lg:h-[72px]" />
            </MaybeLink>
          </div>

          <div className="ui-open:hidden -my-2 -mr-2 lg:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-black hover:text-gray-900">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-8 w-8" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="-my-2 -mr-2 lg:hidden ui-not-open:hidden">
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
                className={classNames(
                  'hidden lg:block border border-transparent rounded-full',
                  'lg:px-6 xl:px-8 lg:py-2',
                  'text-xs lg:text-sm xl:text-base text-white bg-black',
                )}
              >
                DOWNLOAD FOR FREE
              </MaybeLink>
            </div>
          </div>
        </div>
        <SideBar navigation={navigation} />
      </div>
    </div>
  );
}

function StickyWrapper({ children }: PopoverProviderProps) {
  return <Popover className="fixed top-0 w-full">{children}</Popover>;
}
function StaticWrapper({ children }: PopoverProviderProps) {
  return <Popover className="absolute w-full">{children}</Popover>;
}

function HeaderMode(props: Props) {
  switch (props.behavior) {
    case 'scrollup':
      return (
        <ScrollbackHeaderWrapper {...props}>
          <Content {...props} />
        </ScrollbackHeaderWrapper>
      );
    case 'sticky':
      return (
        <StickyWrapper {...props}>
          <Content {...props} />
        </StickyWrapper>
      );
    case 'static':
    default:
      return (
        <StaticWrapper {...props}>
          <Content {...props} />
        </StaticWrapper>
      );
  }
}

export default function Header(props: Props) {
  return (
    <div className={props.className}>
      <HeaderMode {...props} />
    </div>
  );
}
