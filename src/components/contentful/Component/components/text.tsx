import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import RichText from 'src/components/RichText';

type TextData = {
  text: Contentful.EntryFields.RichText;
};

export default function text(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  return (
    <div>
      <RichText content={props.data.text} />
    </div>
  );
}
