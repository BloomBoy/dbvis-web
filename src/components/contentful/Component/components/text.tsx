import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import RichText from 'src/components/RichText';
import classNames from 'classnames';

type TextData = {
  text: SafeEntryFields.RichText;
  classes: SafeEntryFields.Symbol[];
};

export default function Text(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const { text } = props.data;
  if (text == null) return null;

  return (
    <div className="pb-12">
      <RichText
        content={text}
        className={classNames(...(props.data?.classes || []))}
      />
    </div>
  );
}
