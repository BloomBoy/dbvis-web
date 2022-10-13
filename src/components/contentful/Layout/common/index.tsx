import * as Contentful from 'contentful';
import classNames from 'classnames';
import getTextAlignment from 'src/utils/getTextAlignment';
export interface HeaderData {
  title?: Contentful.EntryFields.Symbol;
  subTitle?: Contentful.EntryFields.Symbol;
  renderHeader: Contentful.EntryFields.Boolean;
  alignment?: Contentful.EntryFields.Symbol;
}

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
          className={`font-mono quote-decoration uppercase text-grey-500 ${textAlign}`}
        >
          {subTitle}
        </h3>
      )}
      {hasTitle && (
        <HeaderComp
          className={classNames(
            mainHeaderIndex === 0 ? 'text-8xl' : 'text-7xl',
            'font-bold',
            textAlign,
          )}
        >
          {title}
        </HeaderComp>
      )}
    </div>
  );
}

export interface ThemeData {
  backgroundColor?: string;
  containerBgColor?: string;
  textColor?: string;
  sizing?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
}

export function Wrapper({
  data,
  children,
}: React.PropsWithChildren<{ data: Partial<ThemeData> }>): JSX.Element {
  const backgroundColor = data.backgroundColor?.startsWith('#')
    ? data.backgroundColor
    : undefined;
  const backgroundClass =
    data.backgroundColor && !data.backgroundColor.startsWith('#')
      ? `bg-${data.backgroundColor}`
      : undefined;

  const style = backgroundColor
    ? {
        backgroundColor,
      }
    : undefined;
  if (style == null && backgroundClass == null) {
    return <>{children}</>;
  }
  return (
    <div className={classNames('w-full', backgroundClass)} style={style}>
      {children}
    </div>
  );
}

export function Container({
  data,
  children,
}: React.PropsWithChildren<{ data: Partial<ThemeData> }>): JSX.Element {
  const color = data.textColor?.startsWith('#') ? data.textColor : undefined;
  const textClass =
    data.textColor && !data.textColor.startsWith('#')
      ? `text-${data.textColor}`
      : undefined;
  const backgroundColor = data.containerBgColor?.startsWith('#')
    ? data.containerBgColor
    : undefined;
  const backgroundClass =
    data.containerBgColor && !data.containerBgColor.startsWith('#')
      ? `bg-${data.containerBgColor}`
      : undefined;
  const style =
    backgroundColor || color
      ? {
          backgroundColor,
          color,
        }
      : undefined;
  const sizingClass = data.sizing
    ? (`max-w-${data.sizing}` as const)
    : 'max-w-7xl';
  return (
    <div
      className={classNames(
        'mx-auto p-8 rounded-3xl',
        sizingClass,
        textClass,
        backgroundClass,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
