import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';
import getTextAlignment from 'src/utils/getTextAlignment';
import { CSSProperties } from 'react';
import { getTextColorStyle } from 'src/utils/getTextColorStyle';

export type HeaderData = {
  title?: SafeEntryFields.Symbol;
  subTitle?: SafeEntryFields.Symbol;
  renderHeader: SafeEntryFields.Boolean;
  alignment?: SafeEntryFields.Symbol;
};

export function canRenderMainHeader(data: Partial<HeaderData>): boolean {
  return data.renderHeader === true && data.title != null && data.title !== '';
}

export function LayoutHeader({
  title,
  subTitle,
  alignment = 'center',
  mainHeaderIndex,
}: Partial<HeaderData> & {
  mainHeaderIndex: number | undefined;
}) {
  const HeaderComp = mainHeaderIndex === 0 ? 'h1' : 'h2';
  const textAlign = getTextAlignment(alignment);
  const hasTitle = title != null && title !== '';
  const hasSubTitle = subTitle != null && subTitle !== '';
  if (!hasTitle && !hasSubTitle) return null;
  return (
    <div className="flex flex-col mb-10">
      {hasSubTitle && (
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 ${textAlign} mb-6`}
        >
          {subTitle}
        </h3>
      )}
      {hasTitle && (
        <HeaderComp
          className={classNames(
            mainHeaderIndex === 0
              ? 'text-5xl md:text-8xl'
              : 'text-5xl md:text-7xl',
            'font-normal px-5 md:px-10 lg:px-28 text-gray-900',
            textAlign,
          )}
        >
          {title}
        </HeaderComp>
      )}
    </div>
  );
}

export type ThemeData = {
  classes?: SafeEntryFields.Symbol;
  backgroundColor?: SafeEntryFields.Symbol;
  backgroundImage?: SafeEntryFields.Asset;
  textColor?: SafeEntryFields.Symbol;
  contentClasses?: SafeEntryFields.Symbol;
  contentBackgroundColor?: SafeEntryFields.Symbol;
  contentBackgroundImage?: SafeEntryFields.Asset;
};

export function Wrapper({
  data,
  children,
}: React.PropsWithChildren<{ data: Partial<ThemeData> }>): JSX.Element {
  const backgroundColor = data.backgroundColor?.startsWith('#')
    ? data.backgroundColor
    : undefined;
  const backgroundURL = data.backgroundImage?.fields.file.url;

  const style: CSSProperties | undefined =
    backgroundColor || backgroundURL != null
      ? {
          backgroundColor,
          backgroundImage: backgroundURL ? `url(${backgroundURL})` : undefined,
        }
      : undefined;
  if (style == null && !data.classes) {
    return <>{children}</>;
  }

  return (
    <div className={classNames(data.classes)} style={style}>
      {children}
    </div>
  );
}

export function Container({
  data,
  children,
}: React.PropsWithChildren<{ data: Partial<ThemeData> }>): JSX.Element {
  const textColor = data.textColor?.startsWith('#')
    ? data.textColor
    : undefined;
  const backgroundColor = data.contentBackgroundColor?.startsWith('#')
    ? data.contentBackgroundColor
    : undefined;
  const backgroundURL = data.contentBackgroundImage?.fields.file.url;

  const style: CSSProperties | undefined =
    backgroundColor || textColor || backgroundURL != null
      ? {
          backgroundColor,
          backgroundImage: backgroundURL ? `url(${backgroundURL})` : undefined,
          ...getTextColorStyle(textColor),
        }
      : undefined;

  let el = children;
  if (style != null || data.contentClasses) {
    el = (
      <div className={classNames(data.contentClasses)} style={style}>
        {children}
      </div>
    );
  }

  return <div className="p-8 mx-auto max-w-7xl">{el}</div>;
}
