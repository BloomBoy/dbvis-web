import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import MaybeLink from 'src/components/contentful/MaybeLink';
import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';

export type ButtonData = {
  buttonText: SafeEntryFields.Symbol;
  target: SafeEntryFields.Symbol;
  classes: Contentful.EntryFields.Symbol[];
};

export default function Button(
  props: ComponentProps<ButtonData>,
): JSX.Element | null {
  return (
    <MaybeLink
      href={props.data.target}
      className={classNames(
        'mx-auto bg-black text-white rounded-full p-3 px-8 font-mono font-light uppercase',
        ...(props.data?.classes || []),
      )}
    >
      {props.data.buttonText}
    </MaybeLink>
  );
}
