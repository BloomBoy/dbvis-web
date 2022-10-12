import { HeaderData, LayoutHeader } from '../common';
import Component from '../../Component';
import { EntryFields } from 'contentful';
import type { LayoutProps } from '..';
import RichText from 'src/components/RichText';

interface Data extends HeaderData {
  colorScheme?: 'light' | 'dark';
}

interface SlotData {
  button: EntryFields.RichText;
}

function SelectButtons({ slots }: LayoutProps<Data, SlotData>) {
  return (
    <div className="flex justify-center items-stretch">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="px-14 py-9 rounded-2xl border border-neutral-200"
        >
          <RichText className="w-72" content={slot.data.button} />
        </div>
      ))}
    </div>
  );
}

export default function ColumnLayout(
  props: LayoutProps<Data, SlotData>,
): JSX.Element {
  const { slots, data } = props;
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
      <SelectButtons {...props} />
      {columns}
    </>
  );
}
