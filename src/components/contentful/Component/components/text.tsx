import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import RichText from 'src/components/RichText';
import getTextAlignment from 'src/utils/getTextAlignment';

type TextData = {
  text: Contentful.EntryFields.RichText;
  alignment?: Contentful.EntryFields.Symbol;
};

export default function text(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const textAlign = getTextAlignment(props.data.alignment);
  return (
    <RichText
      content={props.data.text}
      className={`${textAlign} self-center`}
    />
  );
}
