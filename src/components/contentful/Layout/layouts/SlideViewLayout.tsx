import * as Contentful from 'contentful';
import { HeaderData, LayoutHeader } from '../common';
import type { LayoutProps } from '..';

type Data = HeaderData;

type SlotData = {
  button: Contentful.EntryFields.RichText;
};

export default function SlideViewLayout({
  data,
}: LayoutProps<Data, SlotData>): JSX.Element {
  return (
    <>
      {data.renderHeader && <LayoutHeader {...data} />}
      <div>SlideView Layout</div>
    </>
  );
}
