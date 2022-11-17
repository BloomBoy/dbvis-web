import Component from '../../Component';
import type { LayoutProps } from '..';
import React from 'react';
import { isNonNull } from 'src/utils/filters';
import { PageContext } from 'src/utils/contentful/pageContext';

export type ColumnLayoutData = Record<string, never>;

export type ColumnData = Record<string, never>;

function UnstyledLayoutComp(
  props: LayoutProps<ColumnLayoutData, ColumnData>,
): JSX.Element {
  const { slots } = props;
  return (
    <>
      {slots.flatMap(({ components, id }) =>
        components.map((componentProps) => (
          <Component
            {...componentProps}
            key={`${id}-${componentProps.id}`}
            layout={props}
          />
        )),
      )}
    </>
  );
}

const ColumnLayout = Object.assign(UnstyledLayoutComp, {
  headerCount(
    props: LayoutProps<ColumnLayoutData, ColumnData>,
    collectedData: Record<string, unknown>,
  ) {
    let count = 0;
    props.slots.forEach((slot) => {
      if (slot.data.title) count += 1;
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
  headers(
    props: LayoutProps<ColumnLayoutData, ColumnData>,
    collectedData: Record<string, unknown>,
    preview: boolean,
    context: PageContext,
  ) {
    return props.slots
      .flatMap((slot) =>
        slot.components.flatMap((component) =>
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
      )
      .filter(isNonNull);
  },
});

export default ColumnLayout;
