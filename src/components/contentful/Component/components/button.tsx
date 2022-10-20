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
    <MaybeLink
      href={props.data.target}
      className="bg-black self-center text-white rounded-3xl p-3 px-8 font-mono font-light uppercase"
    >
      {props.data.buttonText}
    </MaybeLink>
  );
}
