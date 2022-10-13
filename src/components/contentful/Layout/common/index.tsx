import * as Contentful from 'contentful';
import getTextAlignment from 'src/utils/getTextAlignment';
export interface HeaderData {
  title: Contentful.EntryFields.Symbol;
  subTitle?: Contentful.EntryFields.Symbol;
  renderHeader: Contentful.EntryFields.Boolean;
  alignment?: Contentful.EntryFields.Symbol;
}

export function LayoutHeader({
  title,
  subTitle,
  alignment = 'center',
}: HeaderData) {
  const textAlign = getTextAlignment(alignment);
  return (
    <div className="flex flex-col">
      {subTitle && (
        <h2 className={`font-mono uppercase text-grey-500 ${textAlign}`}>
          {subTitle}
        </h2>
      )}
      <h1 className={`${textAlign}`}>{title}</h1>
    </div>
  );
}
