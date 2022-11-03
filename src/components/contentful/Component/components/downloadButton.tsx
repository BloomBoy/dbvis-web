import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import Button, { ButtonData } from './button';
import { useMemo } from 'react';
import DropDownButton from 'src/components/DropDownButton';

type DownloadButtonData = Omit<ButtonData, 'target'> & {
  hoverWidget: SafeEntryFields.Boolean;
  classes?: Contentful.EntryFields.Symbol[];
};

export default function DownloadButton(
  props: ComponentProps<DownloadButtonData>,
): JSX.Element | null {
  const buttonData = useMemo(
    () => ({
      ...props.data,
      target: '/download',
    }),
    [props.data],
  );

  if (!props.data.hoverWidget) {
    return <Button {...props} data={buttonData} />;
  }

  return (
    <DropDownButton classes={props.data.classes}>
      {props.data.buttonText || 'Download for free'}
    </DropDownButton>
  );
}
