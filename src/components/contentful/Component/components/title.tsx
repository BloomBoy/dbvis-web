import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import classNames from 'classnames';
import { layoutSelfHeaderCount } from '../../Layout/LayoutRenderers';
import { useMemo } from 'react';
import useCollectedData from 'src/hooks/useCollectedData';
import { useRouter } from 'next/router';
import usePageContext from 'src/hooks/usePageContex';

export type TitleData = {
  title: SafeEntryFields.Symbol;
  subTitle: SafeEntryFields.Symbol;
  linkText?: SafeEntryFields.Symbol;
  classes?: SafeEntryFields.Symbol[];
};

const titleComponentTypes = ['titleComponent', 'layoutTitleComponent'];

function TitleComponent({
  data: { title, subTitle, classes },
  id,
  layout,
}: ComponentProps<TitleData>): JSX.Element | null {
  const collectedData = useCollectedData();
  const { isPreview } = useRouter();
  const pageContext = usePageContext();
  const isMainHeader = useMemo(() => {
    const { mainHeaderIndex: startIndex, ...savedLayout } = layout;
    if (startIndex > 0) return false;
    const layoutHeaders = layoutSelfHeaderCount(
      {
        ...savedLayout,
      },
      collectedData,
      startIndex ?? 0,
      isPreview,
      pageContext,
    );
    if (layoutHeaders !== 0) return false;
    for (const slot of layout.slots) {
      for (const component of slot.components) {
        if (titleComponentTypes.includes(component.type)) {
          if (component.id === id) return true;
          return false;
        }
      }
    }
    return false;
  }, [collectedData, id, isPreview, layout, pageContext]);
  const HeaderComp = isMainHeader ? 'h1' : 'h2';
  const hasTitle = title != null && title !== '';
  const hasSubTitle = subTitle != null && subTitle !== '';
  if (!hasTitle && !hasSubTitle) return null;

  return (
    <div className="flex flex-col text-center" id={id}>
      <div className={classNames(...(classes || []))}>
        {hasSubTitle && (
          <span className="block quote-decoration uppercase title-sub mb-6">
            {subTitle}
          </span>
        )}
        {hasTitle && <HeaderComp className="title-main">{title}</HeaderComp>}
      </div>
    </div>
  );
}

const title = Object.assign(TitleComponent, {
  headerCount(props: ComponentProps<TitleData>) {
    return props.data.title != null && props.data.title !== '' ? 1 : 0;
  },
  headers(props: ComponentProps<TitleData>) {
    return props.data.title != null && props.data.title !== ''
      ? [
          {
            id: props.id,
            ...(props.data.title != null
              ? { mainTitle: props.data.title }
              : null),
            ...(props.data.subTitle != null
              ? { subTitle: props.data.subTitle }
              : null),
            ...(props.data.linkText != null
              ? { linkText: props.data.linkText }
              : null),
          },
        ]
      : undefined;
  },
});

export default title;
