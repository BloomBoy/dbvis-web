import * as Contentful from 'contentful';

export interface HeaderData {
  title: Contentful.EntryFields.Symbol;
  subTitle?: Contentful.EntryFields.Symbol;
  renderHeader: Contentful.EntryFields.Boolean;
}

export function LayoutHeader({ title, subTitle }: HeaderData) {
  return (
    <div className="flex flex-col-reverse">
      <h1>{title}</h1>
      {subTitle && <h2>{subTitle}</h2>}
    </div>
  );
}
