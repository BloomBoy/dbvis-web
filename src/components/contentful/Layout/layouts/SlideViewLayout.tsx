import {
  Container,
  HeaderData,
  ThemeData,
  Wrapper,
  canRenderMainHeader,
} from '../common';
import { Disclosure, Transition } from '@headlessui/react';
import React, { useCallback, useState } from 'react';
import Component from '../../Component';
import { EntryFields } from 'contentful';
import type { LayoutProps, SlotProps } from '..';
import RichText from 'src/components/RichText';
import classNames from 'classnames';
import LayoutTitle from '../../Component/components/layoutTitle';

type Data = HeaderData & ThemeData;

type SlotData = {
  button: EntryFields.RichText;
};

function SlotImage({
  slot,
  layout,
}: {
  slot: SlotProps<SlotData>;
  layout: LayoutProps<Data, SlotData>;
}) {
  return (
    <div
      className={classNames(
        'absolute top-0 bottom-0 left-0 right-0 flex py-10 md:px-24 lg:px-36 items-center',
      )}
    >
      {slot.components.map((componentProps) => (
        <Component
          {...componentProps}
          key={componentProps.id}
          layout={layout}
        />
      ))}
    </div>
  );
}

function SelectButtons(
  props: LayoutProps<Data, SlotData> & {
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  },
) {
  const { slots, selectedIndex, setSelectedIndex } = props;
  const onClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
      if (ev.defaultPrevented) return;
      if (ev.target === ev.currentTarget) {
        setSelectedIndex(index);
      }
      if (ev.target instanceof HTMLElement) {
        let curEl = ev.target;
        while (curEl.parentElement != null) {
          if (curEl.parentElement === ev.currentTarget) {
            setSelectedIndex(index);
            return;
          }
          if (
            curEl instanceof HTMLAnchorElement ||
            curEl instanceof HTMLButtonElement
          ) {
            return;
          }
          curEl = curEl.parentElement;
        }
        setSelectedIndex(index);
      }
    },
    [setSelectedIndex],
  );
  return slots.length > 0 ? (
    <div className="flex flex-wrap justify-center lg:grid lg:grid-cols-3 gap-6 mb-12">
      {slots.map((slot, index) => (
        <Disclosure key={slot.id}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={classNames(
                  'px-14 py-8 rounded-2xl border border-neutral-200 text-left self-center w-full md:w-96 lg:w-auto h-full',
                  open && 'bg-neutral-200',
                  selectedIndex === index &&
                    'md:bg-neutral-200 md:cursor-default',
                  selectedIndex !== index &&
                    'md:bg-transparent hover:bg-neutral-100',
                )}
                onClick={(
                  ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => onClick(ev, index)}
              >
                {slot.data.button && (
                  <RichText className="text-base" content={slot.data.button} />
                )}
                <Transition
                  show={open}
                  enter="transition-all ease duration-500 transform"
                  enterFrom="opacity-0 -translate-y-12 max-h-0"
                  enterTo="opacity-100 translate-y-0 max-h-screen"
                  leave="transition-all ease duration-300 transform"
                  leaveFrom="opacity-100 translate-y-0 max-h-screen"
                  leaveTo="opacity-0 -translate-y-12 max-h-0"
                  className="w-full overflow-hidden md:hidden"
                >
                  <Disclosure.Panel
                    className="relative my-3 w-full flex md:hidden flex-nowrap overflow-hidden h-[300px]"
                    static
                  >
                    <SlotImage slot={slot} layout={props} />
                  </Disclosure.Panel>
                </Transition>
              </Disclosure.Button>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  ) : null;
}

function CrossFadeViewLayoutComp(
  props: LayoutProps<Data, SlotData>,
): JSX.Element {
  const { slots, data, id } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Wrapper data={data}>
      <Container data={data}>
        {data.renderHeader && (
          <LayoutTitle
            data={{ alignment: data.alignment }}
            id={`${id}-header`}
            layout={props}
            type="layoutTitleComponent"
          />
        )}
        <SelectButtons
          {...props}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
        <div className="relative my-3 w-full hidden md:flex flex-nowrap rounded-2xl bg-gray-300 overflow-hidden h-[300px] md:h-[500px] lg:h-[725px]">
          {slots.map((slot, index) => (
            <Transition
              key={slot.id}
              show={selectedIndex === index}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <SlotImage slot={slot} layout={props} />
            </Transition>
          ))}
        </div>
      </Container>
    </Wrapper>
  );
}

const CrossFadeViewLayout = Object.assign(CrossFadeViewLayoutComp, {
  headerCount(
    props: LayoutProps<Data, SlotData>,
    collectedData: Record<string, unknown>,
  ) {
    let count = 0;
    if (canRenderMainHeader(props.data)) count += 1;
    props.slots.forEach((slot) => {
      slot.components.forEach((component) => {
        count += Component.headerCount(
          {
            ...component,
            layout: props,
          },
          collectedData,
        );
      });
    });
    return count;
  },
});

export default CrossFadeViewLayout;
