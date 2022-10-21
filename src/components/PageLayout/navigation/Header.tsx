import Bars3Icon from './Bars3Icons';
import HeaderLogo from './HeaderLogo';
import MaybeLink from '../../contentful/MaybeLink';
import NavLinks from './NavLinks';
import SideBar from './SideBar';
import XMarkIcon from './XMarkIcon';

import React, { useEffect, useRef } from 'react';
import { Popover } from '@headlessui/react';
import getMenu from '../../../utils/menus';

type PopoverRenderingProps = Parameters<
  typeof Popover<'div'>
>[0]['children'] extends React.ReactNode | ((bag: infer props) => void)
  ? props
  : never;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigation = getMenu('main-menu');

const MARGIN = 50;

function getScrollState(node: Element) {
  const isRootElement = node === document.firstElementChild;
  let overflowY = window.getComputedStyle(node).getPropertyValue('overflow-y');
  let overflowX = window.getComputedStyle(node).getPropertyValue('overflow-x');
  overflowY = isRootElement && overflowY === 'visible' ? 'auto' : overflowY;
  overflowX = isRootElement && overflowX === 'visible' ? 'auto' : overflowX;
  return {
    verticalScrollable:
      (overflowY === 'scroll' || overflowY === 'auto') &&
      node.scrollHeight > node.clientHeight,
    verticalScrollVisible:
      overflowY === 'scroll' ||
      (overflowY === 'auto' && node.scrollHeight > node.clientHeight),
    horizontalScrollable:
      (overflowX === 'scroll' || overflowX === 'auto') &&
      node.scrollWidth > node.clientWidth,
    horizontalScrollVisible:
      overflowX === 'scroll' ||
      (overflowX === 'auto' && node.scrollWidth > node.clientWidth),
  };
}

function HeaderContent({
  wrapperRef,
  open,
}: {
  wrapperRef: HTMLElement | null;
} & PopoverRenderingProps) {
  const [topBarRef, setTopBarRef] = React.useState<HTMLDivElement | null>(null);

  const lastScrollRef = useRef(
    typeof window !== 'undefined' ? window.scrollY : 0,
  );
  const lastHeightRef = useRef(0);

  useEffect(() => {
    if (!wrapperRef || !topBarRef || open) return;
    wrapperRef.style.setProperty('height', `${lastHeightRef.current}px`);
    const scrollHandler = (ev: Event) => {
      if (ev.target != window.document) return;
      if (window.scrollY > lastScrollRef.current) {
        const newHeight = Math.max(
          lastHeightRef.current,
          window.scrollY - topBarRef.clientHeight - MARGIN,
        );
        if (newHeight !== lastHeightRef.current) {
          wrapperRef.style.setProperty('height', `${newHeight}px`);
          lastHeightRef.current = newHeight;
        }
      } else if (window.scrollY < lastScrollRef.current) {
        const newHeight = Math.min(
          lastHeightRef.current,
          window.scrollY + topBarRef.clientHeight,
        );
        if (newHeight !== lastHeightRef.current) {
          wrapperRef.style.setProperty('height', `${newHeight}px`);
          lastHeightRef.current = newHeight;
        }
      }
      lastScrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      wrapperRef.style.removeProperty('height');
    };
  }, [wrapperRef, topBarRef, open]);
  useEffect(() => {
    const element = document.firstElementChild;
    if (
      !topBarRef ||
      !open ||
      element == null ||
      !(element instanceof HTMLElement)
    ) {
      return undefined;
    }
    const scrollState = getScrollState(element);
    const offsetY = element.scrollTop;
    const offsetX = element.scrollLeft;
    const oldPosition = element.style.getPropertyValue('position');
    const oldTop = element.style.getPropertyValue('top');
    const oldLeft = element.style.getPropertyValue('left');
    const oldHeight = element.style.getPropertyValue('height');
    const oldWidth = element.style.getPropertyValue('width');
    let oldScrollOverflowY: string | null = null;
    let oldScrollOverflowX: string | null = null;

    element.style.setProperty('position', 'fixed');
    element.style.setProperty('top', `-${offsetY}px`);
    element.style.setProperty('left', `-${offsetX}px`);
    element.style.setProperty('height', '100%');
    element.style.setProperty('width', '100%');

    if (scrollState.verticalScrollVisible) {
      oldScrollOverflowY = element.style.getPropertyValue('overflow-y');
      element.style.setProperty('overflow-y', 'scroll');
    }
    if (scrollState.horizontalScrollVisible) {
      oldScrollOverflowX = element.style.getPropertyValue('overflow-x');
      element.style.setProperty('overflow-x', 'scroll');
    }

    return () => {
      if (oldScrollOverflowY != null) {
        if (oldScrollOverflowY === '') {
          element.style.removeProperty('overflow-y');
        } else {
          element.style.setProperty('overflow-y', oldScrollOverflowY);
        }
      }
      if (oldScrollOverflowX != null) {
        if (oldScrollOverflowX === '') {
          element.style.removeProperty('overflow-x');
        } else {
          element.style.setProperty('overflow-x', oldScrollOverflowX);
        }
      }
      if (oldPosition === '') {
        element.style.removeProperty('position');
      } else {
        element.style.setProperty('position', oldPosition);
      }
      if (oldTop === '') {
        element.style.removeProperty('top');
      } else {
        element.style.setProperty('top', oldTop);
      }
      if (oldLeft === '') {
        element.style.removeProperty('left');
      } else {
        element.style.setProperty('left', oldLeft);
      }
      if (oldHeight === '') {
        element.style.removeProperty('height');
      } else {
        element.style.setProperty('height', oldHeight);
      }
      if (oldWidth === '') {
        element.style.removeProperty('width');
      } else {
        element.style.setProperty('width', oldWidth);
      }
      element.scrollTop = offsetY;
      element.scrollLeft = offsetX;
      lastScrollRef.current = offsetY;
      lastHeightRef.current = offsetY + topBarRef.clientHeight;
    };
  }, [open, topBarRef]);
  return (
    <div className="bg-white top-0 sticky ui-open:static" ref={setTopBarRef}>
      <div className="flex items-center justify-between px-4 h-20 sm:px-6 mx-auto max-w-[calc(1300px)] lg:justify-start md:space-x-10">
        <div>
          <MaybeLink href="/" aria-label="Home">
            <HeaderLogo className="h-12 md:h-13 lg:h-20 w-auto" />
          </MaybeLink>
        </div>

        <div
          className={classNames(open ? 'hidden' : '', '-my-2 -mr-2 lg:hidden')}
        >
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-black hover:text-gray-900">
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-8 w-8" aria-hidden="true" />
          </Popover.Button>
        </div>
        <div
          className={classNames(open ? '' : 'hidden', '-my-2 -mr-2 lg:hidden')}
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
    </div>
  );
}

export default function Header() {
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>(
    null,
  );

  return (
    <Popover
      ref={setWrapperRef}
      className="absolute ui-open:fixed top-0 w-full"
    >
      {(childProps) => (
        <HeaderContent {...childProps} wrapperRef={wrapperRef} />
      )}
    </Popover>
  );
}
