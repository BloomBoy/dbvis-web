import * as Contentful from 'contentful';
import type { ComponentProps } from '..';
import getTextAlignment from 'src/utils/getTextAlignment';
import classNames from 'classnames';
import { layoutHeaderCount } from '../../Layout/LayoutRenderers';
import { useMemo } from 'react';
import useCollectedData from 'src/hooks/useCollectedData';

export type TitleData = {
  title: Contentful.EntryFields.Symbol;
  subTitle: Contentful.EntryFields.Symbol;
  alignment?: Contentful.EntryFields.Symbol;
};

function TitleComponent({
  data: { alignment, title, subTitle },
  id,
  layout,
}: ComponentProps<TitleData>): JSX.Element | null {
  const collectedData = useCollectedData();
  const mainHeaderIndex = useMemo(() => {
    let foundSelf = false;
    const layoutHeaders = layoutHeaderCount(
      {
        ...layout,
        slots: layout.slots.map((slot) => ({
          ...slot,
          components: foundSelf
            ? []
            : slot.components.filter(({ id: searchId }) => {
                if (foundSelf === true) return false;
                if (searchId === id) {
                  foundSelf = true;
                  return false;
                }
                return true;
              }),
        })),
      },
      collectedData,
    );
    return layout.mainHeaderIndex + layoutHeaders;
  }, [collectedData, id, layout]);
  const HeaderComp = mainHeaderIndex === 0 ? 'h1' : 'h2';
  const textAlign = getTextAlignment(alignment);
  const hasTitle = title != null && title !== '';
  const hasSubTitle = subTitle != null && subTitle !== '';
  if (!hasTitle && !hasSubTitle) return null;
  return (
    <div className="flex flex-col">
      {hasSubTitle && (
        <h3
          className={classNames(
            'font-mono font-light quote-decoration uppercase text-grey-500 mb-6',
            textAlign,
          )}
        >
          {subTitle}
        </h3>
      )}
      {hasTitle && (
        <HeaderComp
          className={classNames(
            HeaderComp === 'h1'
              ? 'text-5xl md:text-8xl'
              : 'text-5xl md:text-7xl',
            'font-normal text-gray-900',
            textAlign,
          )}
        >
          {title}
        </HeaderComp>
      )}
    </div>
  );
}

const title = Object.assign(TitleComponent, {
  headerCount(props: ComponentProps<TitleData>) {
    return props.data.title != null && props.data.title !== '' ? 1 : 0;
  },
});

export default title;
