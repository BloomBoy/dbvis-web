import { SafeEntryFields } from 'src/utils/contentful';
import type { ComponentProps } from '..';
import classNames from 'classnames';
import { layoutHeaderCount } from '../../Layout/LayoutRenderers';
import { useMemo } from 'react';
import useCollectedData from 'src/hooks/useCollectedData';

export type TitleData = {
  title: SafeEntryFields.Symbol;
  subTitle: SafeEntryFields.Symbol;
  classes?: SafeEntryFields.Symbol[];
};

function TitleComponent({
  data: { title, subTitle, classes },
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
    return (layout.mainHeaderIndex ?? 0) + layoutHeaders;
  }, [collectedData, id, layout]);
  const HeaderComp = mainHeaderIndex === 0 ? 'h1' : 'h2';
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
});

export default title;
