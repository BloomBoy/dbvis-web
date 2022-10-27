import {
  Container,
  HeaderData,
  LayoutHeader,
  ThemeData,
  Wrapper,
  canRenderMainHeader,
} from '../common';
import Component from '../../Component';
import type { LayoutProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';

type Data = HeaderData & ThemeData;

type SlotData = {
  title?: SafeEntryFields.Symbol;
  subTitle?: SafeEntryFields.Symbol;
  backgroundColor?: SafeEntryFields.Symbol;
  textColor?: SafeEntryFields.Symbol;
};

function ColumnLayoutComp({
  slots,
  data,
  mainHeaderIndex,
}: LayoutProps<Data, SlotData>): JSX.Element {
  const columnCount = slots.length;
  const columns =
    columnCount > 1 ? (
      <div
        className={`flex flex-col md:grid gap-x-28`}
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
            }}
          >
            {slot.components.map((componentProps) => (
              <Component key={componentProps.id} {...componentProps} />
            ))}
          </div>
        ))}
      </div>
    ) : (
      columnCount === 1 && (
        <div className="flex flex-col">
          {slots[0].components.map((componentProps) => (
            <Component key={componentProps.id} {...componentProps} />
          ))}
        </div>
      )
    );

  return (
    <Wrapper data={data}>
      <Container data={data}>
        {data.renderHeader && (
          <LayoutHeader {...data} mainHeaderIndex={mainHeaderIndex} />
        )}
        {columns}
      </Container>
    </Wrapper>
  );
}

const ColumnLayout = Object.assign(ColumnLayoutComp, {
  headerCount(props: LayoutProps<Data, SlotData>) {
    let count = 0;
    if (canRenderMainHeader(props.data)) count += 1;
    props.slots.forEach((slot) => {
      if (slot.data.title) count += 1;
      slot.components.forEach((component) => {
        count += Component.headerCount(component);
      });
    });
    return count;
  },
});

export default ColumnLayout;
