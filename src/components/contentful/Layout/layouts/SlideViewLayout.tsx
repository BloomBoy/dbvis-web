import { HeaderData, LayoutHeader } from '../common';
import React, { useCallback, useEffect, useState } from 'react';
import Component from '../../Component';
import { EntryFields } from 'contentful';
import type { LayoutProps } from '..';
import RichText from 'src/components/RichText';
import classNames from 'classnames';

interface Data extends HeaderData {
  colorScheme?: 'light' | 'dark';
}

interface SlotData {
  button: EntryFields.RichText;
}

function SelectButtons({
  slots,
  selectedIndex,
  setSelectedIndex,
}: LayoutProps<Data, SlotData> & {
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const onClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
      console.log(ev.defaultPrevented);
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

  return (
    <div className="flex flex-wrap justify-center items-stretch -mx-3 -my-3">
      {slots.map((slot, index) => (
        <button
          key={slot.id}
          className={classNames(
            'px-14 py-9 rounded-2xl border border-neutral-200 text-left mx-3 my-3',
            selectedIndex === index && 'bg-neutral-200 cursor-default',
            selectedIndex !== index && 'hover:bg-neutral-100',
          )}
          onClick={(ev) => onClick(ev, index)}
        >
          <RichText className="w-72" content={slot.data.button} />
        </button>
      ))}
    </div>
  );
}

export default function ColumnLayout(
  props: LayoutProps<Data, SlotData>,
): JSX.Element {
  const { slots, data } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef == null) return;
    containerRef.scrollTo({
      top: 0,
      left: containerRef.clientWidth * selectedIndex,
      behavior: 'smooth',
    });
  }, [containerRef, selectedIndex]);

  return (
    <div className="px-10 w-full">
      {data.renderHeader && <LayoutHeader {...data} />}
      <SelectButtons
        {...props}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <div
        className="my-3 w-full flex flex-nowrap rounded-2xl bg-slate-500 overflow-hidden"
        ref={setContainerRef}
      >
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex-grow flex-shrink-0 w-full flex flex-col items-center justify-center p-10"
          >
            {slot.components.map((componentProps) => (
              <Component key={componentProps.id} {...componentProps} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
