import React, { useEffect, useRef } from 'react';
import { Popover } from '@headlessui/react';
import type { PopoverProviderProps } from './Header';

export interface Props extends PopoverProviderProps {
  scrollbackMargin?: number;
  stickyUntil?: number;
}

type PopoverRenderingProps = PopoverProviderProps['children'] extends
  | React.ReactNode
  | ((bag: infer props) => void)
  ? props
  : never;

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

function ScrollbackHeaderContainer({
  popoverProps,
  children,
  wrapperEl,
  scrollbackMargin = 20,
  stickyUntil = 0,
}: {
  wrapperEl: HTMLDivElement | null;
  popoverProps: PopoverRenderingProps;
} & Props) {
  const { open } = popoverProps;
  const [topBarRef, setTopBarRef] = React.useState<HTMLDivElement | null>(null);

  const lastScrollRef = useRef(
    typeof window !== 'undefined' ? window.scrollY : 0,
  );
  const lastHeightRef = useRef(stickyUntil);
  const scrollbackMarginRef = useRef(scrollbackMargin);
  scrollbackMarginRef.current = scrollbackMargin;

  useEffect(() => {
    if (!wrapperEl || !topBarRef || open) return;
    lastHeightRef.current = Math.max(stickyUntil, lastHeightRef.current);
    wrapperEl.style.setProperty('height', `${lastHeightRef.current}px`);
    const scrollHandler = (ev: Event) => {
      if (ev.target != window.document) return;
      if (window.scrollY > lastScrollRef.current) {
        const newHeight = Math.max(
          lastHeightRef.current,
          window.scrollY - topBarRef.clientHeight - scrollbackMarginRef.current,
          stickyUntil,
        );
        if (newHeight !== lastHeightRef.current) {
          wrapperEl.style.setProperty('height', `${newHeight}px`);
          lastHeightRef.current = newHeight;
        }
      } else if (window.scrollY < lastScrollRef.current) {
        const newHeight = Math.max(
          Math.min(
            lastHeightRef.current,
            window.scrollY + topBarRef.clientHeight,
          ),
          stickyUntil,
        );
        if (newHeight !== lastHeightRef.current) {
          wrapperEl.style.setProperty('height', `${newHeight}px`);
          lastHeightRef.current = newHeight;
        }
      }
      lastScrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      wrapperEl.style.removeProperty('height');
    };
  }, [wrapperEl, topBarRef, open, stickyUntil]);
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
    <div className="top-0 sticky ui-open:static" ref={setTopBarRef}>
      {typeof children === 'function' ? children(popoverProps) : children}
    </div>
  );
}

export default function ScrollbackHeaderWrapper({ children, ...props }: Props) {
  const [wrapperEl, setWrapperEl] = React.useState<HTMLDivElement | null>(null);
  return (
    <Popover ref={setWrapperEl} className="absolute ui-open:fixed top-0 w-full">
      {(popoverProps) => (
        <ScrollbackHeaderContainer
          {...props}
          wrapperEl={wrapperEl}
          popoverProps={popoverProps}
        >
          {children}
        </ScrollbackHeaderContainer>
      )}
    </Popover>
  );
}
