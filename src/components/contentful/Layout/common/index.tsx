import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';
import { CSSProperties } from 'react';
import { getTextColorStyle } from 'src/utils/getTextColorStyle';

export type HeaderData = {
  title?: SafeEntryFields.Symbol;
  subTitle?: SafeEntryFields.Symbol;
  renderHeader: SafeEntryFields.Boolean;
};

export function canRenderMainHeader(data: Partial<HeaderData>): boolean {
  return data.renderHeader === true && data.title != null && data.title !== '';
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

  const color: CSSProperties | undefined = backgroundColor
    ? {
        backgroundColor,
      }
    : undefined;
  const image: CSSProperties | undefined = backgroundURL
    ? {
        backgroundImage: backgroundURL
          ? `url(${backgroundURL}?fm=webp&w=1440)`
          : undefined,
      }
    : undefined;

  if (image === null && color === null && !data.classes) {
    return <>{children}</>;
  }
  return (
    <div className={classNames(data.classes, 'relative')} style={color}>
      {image && (
        <div
          className="hidden lg:block absolute w-full h-full bg-contain bg-top z-[-1] bg-no-repeat"
          style={image}
        />
      )}
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

  return <div className="py-8 px-6 md:px-8 mx-auto max-w-7xl">{el}</div>;
}
