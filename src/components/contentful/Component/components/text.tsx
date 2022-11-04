import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import RichText from 'src/components/RichText';
import getTextAlignment from 'src/utils/getTextAlignment';
import classNames from 'classnames';

type TextData = {
  text: SafeEntryFields.RichText;
  alignment?: SafeEntryFields.Symbol;
  classes: SafeEntryFields.Symbol[];
};

export default function Text(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const { text } = props.data;
  if (text == null) return null;
  const textAlign = getTextAlignment(props.data.alignment);

  return (
    <div className={classNames(textAlign, 'pb-12')}>
      <RichText
        content={text}
        className={classNames(...(props.data?.classes || []))}
      />
    </div>
  );
}
