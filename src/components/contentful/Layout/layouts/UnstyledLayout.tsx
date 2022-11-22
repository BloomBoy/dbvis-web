import Component from '../../Component';
import type { LayoutProps } from '..';
import React from 'react';
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
  selfHeaderCount() {
    return 0;
  },
  headerCount(
    props: LayoutProps<ColumnLayoutData, ColumnData>,
    collectedData: Record<string, unknown>,
  ) {
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
      componentCounts.flat().reduce((a, b) => a + b, 0),
    );
  },
  async headers(
    props: LayoutProps<ColumnLayoutData, ColumnData>,
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

export default ColumnLayout;
