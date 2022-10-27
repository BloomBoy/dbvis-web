import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import RichText from 'src/components/RichText';
import getTextAlignment from 'src/utils/getTextAlignment';
import getMarginPadding, { Size } from 'src/utils/getGetMarginPadding';
import classNames from 'classnames';

type TextData = {
  text: Contentful.EntryFields.RichText;
  alignment?: Contentful.EntryFields.Symbol;
  hPadding?: Size;
  vPadding?: Size;
  hMargin?: Size;
  vMargin?: Size;
};

export default function Text(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  const { text } = props.data;
  if (text == null) return null;
  const textAlign = getTextAlignment(props.data.alignment);
  const paddingY = getMarginPadding({
    direction: 'vertical',
    size: props.data.vPadding,
    type: 'padding',
  });
  const paddingX = getMarginPadding({
    direction: 'horizontal',
    size: props.data.hPadding,
    type: 'padding',
  });
  const marginY = getMarginPadding({
    direction: 'vertical',
    size: props.data.vMargin,
    type: 'margin',
  });
  const marginX = getMarginPadding({
    direction: 'horizontal',
    size: props.data.hMargin,
    type: 'margin',
  });
  return (
    <RichText
      content={text}
      className={classNames(
        `${textAlign} self-center mb-12 max-w-[612px] text-inherit`,
        paddingX,
        paddingY,
        marginX,
        marginY,
      )}
    />
  );
}
