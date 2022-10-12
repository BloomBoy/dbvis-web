import { HeaderData, LayoutHeader } from '../common';
import Component from '../../Component';
import type { LayoutProps } from '..';

type Data = HeaderData;

type SlotData = Record<string, never>;

export default function ColumnLayout({
  slots,
  data,
}: LayoutProps<Data, SlotData>): JSX.Element {
  const columnCount = slots.length;

  const columns =
    columnCount > 1 ? (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
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
        <div>
          {slots[0].components.map((componentProps) => (
            <Component key={componentProps.id} {...componentProps} />
          ))}
        </div>
      )
    );

  return (
    <>
      {data.renderHeader && <LayoutHeader {...data} />}
      {columns}
    </>
  );
}
