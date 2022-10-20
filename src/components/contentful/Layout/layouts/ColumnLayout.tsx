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

interface Data extends HeaderData, ThemeData {}

type SlotData = Record<string, never>;

function ColumnLayoutComp({
  slots,
  data,
  mainHeaderIndex,
}: LayoutProps<Data, SlotData>): JSX.Element {
  const columnCount = slots.length;
  const columns =
    columnCount > 1 ? (
      <div className={`flex flex-col md:grid grid-cols-${columnCount}`}>
        {slots.map((slot) => (
          <div key={slot.id}>
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
  canRenderMainHeader(props: LayoutProps<Data, SlotData>) {
    return canRenderMainHeader(props.data);
  },
});

export default ColumnLayout;
