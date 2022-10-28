import {
  Container,
  HeaderData,
  ThemeData,
  Wrapper,
  canRenderMainHeader,
} from '../common';
import Component from '../../Component';
import type { LayoutProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';
import getMarginPadding, { Size } from 'src/utils/getGetMarginPadding';
import LayoutTitle from '../../Component/components/layoutTitle';

type Data = HeaderData &
  ThemeData & {
    hGapSize?: Size;
    vGapSize?: Size;
  };

type SlotData = {
  title?: SafeEntryFields.Symbol;
  subTitle?: SafeEntryFields.Symbol;
  backgroundColor?: SafeEntryFields.Symbol;
  textColor?: SafeEntryFields.Symbol;
};

function ColumnLayoutComp(props: LayoutProps<Data, SlotData>): JSX.Element {
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
  const columns =
    columnCount > 1 ? (
      <div
        className={classNames(
          'flex flex-col md:grid',
          gapX ? gapX : 'gap-x-28',
          gapY ? gapY : '',
        )}
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="rounded-[30px]"
            style={{
              backgroundColor: slot.data.backgroundColor,
              color: slot.data.textColor,
            }}
          >
            {slot.components.map((componentProps) => (
              <Component
                {...componentProps}
                key={componentProps.id}
                layout={props}
              />
            ))}
          </div>
        ))}
      </div>
    ) : (
      columnCount === 1 && (
        <div
          className="flex flex-col"
          style={{
            backgroundColor: slots[0].data.backgroundColor,
            color: slots[0].data.textColor,
          }}
        >
          {slots[0].components.map((componentProps) => (
            <Component
              key={componentProps.id}
              {...componentProps}
              layout={props}
            />
          ))}
        </div>
      )
    );

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
        {columns}
      </Container>
    </Wrapper>
  );
}

const ColumnLayout = Object.assign(ColumnLayoutComp, {
  headerCount(
    props: LayoutProps<Data, SlotData>,
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
});

export default ColumnLayout;
