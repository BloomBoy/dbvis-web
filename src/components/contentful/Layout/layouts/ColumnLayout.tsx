import {
  Container,
  HeaderData,
  ThemeData,
  Wrapper,
  canRenderMainHeader,
} from '../common';
import Component from '../../Component';
import type { LayoutProps, SlotProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';
import getMarginPadding, { Size } from 'src/utils/getGetMarginPadding';
import LayoutTitle from '../../Component/components/layoutTitle';
import React from 'react';
import { isNonNull } from 'src/utils/filters';
import { PageContext } from 'src/utils/contentful/pageContext';

export type ColumnLayoutData = HeaderData &
  ThemeData & {
    hGapSize?: Size;
    vGapSize?: Size;
  };

export type ColumnData = {
  title?: SafeEntryFields.Symbol;
  subTitle?: SafeEntryFields.Symbol;
  backgroundColor?: SafeEntryFields.Symbol;
  textColor?: SafeEntryFields.Symbol;
  inlineComponents?: SafeEntryFields.Boolean;
  classes?: SafeEntryFields.Symbol[];
};

function renderSlot({
  id,
  components,
  data,
  layout,
}: SlotProps<ColumnData> & {
  layout: LayoutProps<ColumnLayoutData, ColumnData>;
}) {
  const style =
    data.backgroundColor || data.textColor || data.inlineComponents
      ? {
          backgroundColor: data.backgroundColor,
          color: data.textColor,
          display: data.inlineComponents ? 'flex' : undefined,
        }
      : undefined;
  const className =
    data.classes != null && data.classes.length > 0 ? data.classes : undefined;

  return (
    <div key={id} className={classNames(className) || undefined} style={style}>
      {components.map((componentProps) => (
        <Component
          {...componentProps}
          key={componentProps.id}
          layout={layout}
        />
      ))}
    </div>
  );
}

function ColumnLayoutComp(
  props: LayoutProps<ColumnLayoutData, ColumnData>,
): JSX.Element {
  const { id, slots, data } = props;
  const gapX = getMarginPadding({
    size: data.hGapSize,
    type: 'gap',
    direction: 'horizontal',
  });
  const gapY = getMarginPadding({
    size: data.vGapSize,
    type: 'gap',
    direction: 'vertical',
  });

  const columnCount = slots.length;
  const columns = (
    <div
      className={classNames(
        'flex flex-wrap md:grid',
        gapX ? gapX : 'gap-x-28',
        gapY ? gapY : '',
      )}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {slots.map((slot) => renderSlot({ ...slot, layout: props }))}
    </div>
  );

  return (
    <Wrapper data={data}>
      <Container data={data}>
        {data.renderHeader && (
          <LayoutTitle
            data={{}}
            id={`${id}-header`}
            layout={props}
            type="layoutTitleComponent"
          />
        )}
        {columns}
      </Container>
    </Wrapper>
  );
}

const ColumnLayout = Object.assign(ColumnLayoutComp, {
  headerCount(
    props: LayoutProps<ColumnLayoutData, ColumnData>,
    collectedData: Record<string, unknown>,
  ) {
    let count = 0;
    if (canRenderMainHeader(props.data)) count += 1;
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
    const componentHeaders = props.slots
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
