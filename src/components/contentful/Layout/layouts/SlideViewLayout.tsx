import {
  Container,
  HeaderData,
  ThemeData,
  Wrapper,
  canRenderMainHeader,
} from '../common';
import { Disclosure, Transition } from '@headlessui/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Component from '../../Component';
import type { LayoutProps, SlotProps } from '..';
import RichText from 'src/components/RichText';
import classNames from 'classnames';
import LayoutTitle from '../../Component/components/layoutTitle';
import { SafeEntryFields } from 'src/utils/contentful';
import { PageContext } from 'src/utils/contentful/pageContext';

type Data = HeaderData &
  ThemeData & {
    buttonActiveBackgroundColor: SafeEntryFields.Symbol;
    buttonHoverBackgroundColor: SafeEntryFields.Symbol;
    buttonBorderColor: SafeEntryFields.Symbol;
  };

type SlotData = {
  button: SafeEntryFields.RichText;
  buttonActiveBackgroundColor: SafeEntryFields.Symbol;
  buttonHoverBackgroundColor: SafeEntryFields.Symbol;
  buttonBorderColor: SafeEntryFields.Symbol;
  buttonTextColor: SafeEntryFields.Symbol;
  buttonClases: SafeEntryFields.Symbol[];
  classes: SafeEntryFields.Symbol[];
  backgroundColor: SafeEntryFields.Symbol;
  backgroundImage: SafeEntryFields.Asset;
  textColor: string;
};

function SlotImage({
  slot,
  layout,
  zIndex,
}: {
  slot: SlotProps<SlotData>;
  layout: LayoutProps<Data, SlotData>;
  zIndex?: number;
}) {
  return (
    <div
      className={classNames(
        'absolute top-0 bottom-0 left-0 right-0 flex py-10 md:px-24 lg:px-36 items-center',
      )}
      style={{
        backgroundColor: slot.data.backgroundColor,
        zIndex,
      }}
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

function SlotButton({
  as: Comp,
  className,
  slot,
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'slot'> & {
  as: 'button' | typeof Disclosure.Button;
  slot: SlotProps<SlotData>;
}) {
  return (
    <Comp
      className={classNames(
        className,
        'px-14 py-8 rounded-2xl border border-tab-border-color text-left self-center h-full',
      )}
      style={
        {
          '--tab-active-color': slot.data.buttonActiveBackgroundColor,
          '--tab-hover-color':
            slot.data.buttonHoverBackgroundColor ||
            slot.data.buttonActiveBackgroundColor,
          '--tab-border-color':
            slot.data.buttonBorderColor ||
            slot.data.buttonActiveBackgroundColor,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {slot.data.button && (
        <RichText className="text-base" content={slot.data.button} />
      )}
    </Comp>
  );
}

function SelectButtons(
  props: LayoutProps<Data, SlotData> & {
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  },
) {
  const { slots, data, selectedIndex, setSelectedIndex } = props;
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
    <div
      className="md:flex flex-col flex-wrap lg:grid grid-cols-3 gap-6 mb-12"
      style={
        {
          '--tab-active-color': data.buttonActiveBackgroundColor,
          '--tab-hover-color':
            data.buttonHoverBackgroundColor || data.buttonActiveBackgroundColor,
          '--tab-border-color':
            data.buttonBorderColor || data.buttonActiveBackgroundColor,
        } as React.CSSProperties
      }
    >
      {slots.map((slot, index) => (
        <div className={classNames(slot.data.classes)} key={slot.id}>
          <Disclosure>
            {({ open }) => (
              <div className="md:hidden block">
                <SlotButton
                  as={Disclosure.Button}
                  className="w-full ui-open:bg-tab-active-color"
                  slot={slot}
                />
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
              </div>
            )}
          </Disclosure>
          <SlotButton
            as="button"
            className={classNames(
              'hidden md:flex w-96 lg:w-auto h-full',
              selectedIndex === index &&
                'bg-tab-active-color md:cursor-default',
              selectedIndex !== index && 'hover:bg-tab-hover-color',
            )}
            onClick={(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              onClick(ev, index)
            }
            slot={slot}
          />
        </div>
      ))}
    </div>
  ) : null;
}

function CrossFadeViewLayoutComp(
  props: LayoutProps<Data, SlotData>,
): JSX.Element {
  const { slots, data, id } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectStatusRef = useRef({ selectedIndex, prevSelectedIndex: -1 });
  if (selectStatusRef.current.selectedIndex !== selectedIndex) {
    selectStatusRef.current.prevSelectedIndex =
      selectStatusRef.current.selectedIndex;
    selectStatusRef.current.selectedIndex = selectedIndex;
  }

  const patchedData = useMemo(
    () => ({ ...data, contentBackgroundColor: undefined }),
    [data],
  );

  return (
    <Wrapper data={patchedData}>
      <Container data={patchedData}>
        {data.renderHeader && (
          <LayoutTitle
            data={{}}
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
        <div
          className="relative my-3 w-full hidden md:flex flex-nowrap rounded-2xl bg-gray-300 overflow-hidden h-[300px] md:h-[500px] lg:h-[725px]"
          style={{
            backgroundColor: data.contentBackgroundColor,
          }}
        >
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
              <SlotImage
                slot={slot}
                layout={props}
                zIndex={
                  selectStatusRef.current.selectedIndex === index
                    ? 2
                    : selectStatusRef.current.prevSelectedIndex === index
                    ? 1
                    : 0
                }
              />
            </Transition>
          ))}
        </div>
      </Container>
    </Wrapper>
  );
}

const CrossFadeViewLayout = Object.assign(CrossFadeViewLayoutComp, {
  selfHeaderCount(props: LayoutProps<Data, SlotData>) {
    return canRenderMainHeader(props.data) ? 1 : 0;
  },
  headerCount(
    props: LayoutProps<Data, SlotData>,
    collectedData: Record<string, unknown>,
  ) {
    let layoutCount = 0;
    if (canRenderMainHeader(props.data)) layoutCount += 1;
    return Promise.all(
      props.slots.flatMap((slot) =>
        slot.components.map((component) =>
          Component.headerCount(
            {
              ...component,
              layout: props,
            },
            collectedData,
          ),
        ),
      ),
    ).then((componentCounts) =>
      componentCounts.flat().reduce((a, b) => a + b, layoutCount),
    );
  },
  async headers(
    props: LayoutProps<Data, SlotData>,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) {
    const componentHeaders = await Promise.all(
      props.slots.flatMap((slot) =>
        slot.components.map((component) =>
          Component.headers(
            {
              ...component,
              layout: props,
            },
            collectedData,
            preview,
            context,
          ),
        ),
      ),
    ).then((headers) => headers.flat());
    return props.data.renderHeader
      ? [
          {
            id: `${props.id}-header`,
            ...(props.data.title != null && { mainTitle: props.data.title }),
            ...(props.data.subTitle != null && {
              subtitle: props.data.subTitle,
            }),
          },
          ...componentHeaders,
        ]
      : componentHeaders;
  },
});

export default CrossFadeViewLayout;
