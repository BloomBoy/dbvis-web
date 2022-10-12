import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import MaybeLink from 'src/components/contentful/MaybeLink';

type TextData = {
  buttonText: Contentful.EntryFields.Symbol;
  target: Contentful.EntryFields.Symbol;
};

export default function button(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  return (
    <MaybeLink href={props.data.target}>{props.data.buttonText}</MaybeLink>
  );
}
