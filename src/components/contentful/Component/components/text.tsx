import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import RichText from 'src/components/RichText';
import getTextAlignment from 'src/utils/getTextAlignment';

type TextData = {
  text: Contentful.EntryFields.RichText;
  alignment?: Contentful.EntryFields.Symbol;
};

export default function Text(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const { text } = props.data;
  if (text == null) return null;
  const textAlign = getTextAlignment(props.data.alignment);
  return (
    <RichText
      content={text}
      className={`${textAlign} self-center mb-12 max-w-[612px]`}
    />
  );
}
