import type { ComponentProps } from '..';
import MaybeLink from 'src/components/contentful/MaybeLink';
import { SafeEntryFields } from 'src/utils/contentful';

type TextData = {
  buttonText: SafeEntryFields.Symbol;
  target: SafeEntryFields.Symbol;
};

export default function Button(
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
