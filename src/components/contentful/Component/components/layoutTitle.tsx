import type { ComponentProps } from '..';
import { useMemo } from 'react';
import Title, { TitleData } from './title';

type LayoutTitleData = Omit<TitleData, 'title' | 'subTitle'>;

function LayoutTitleComponent(
  props: ComponentProps<LayoutTitleData>,
): JSX.Element {
  const { layout } = props;
  const title =
    typeof layout.data.title === 'string' ? layout.data.title : undefined;
  const subTitle =
    typeof layout.data.subTitle === 'string' ? layout.data.subTitle : undefined;
  const mergedData = useMemo(
    () => ({
      ...props.data,
      title,
      subTitle,
    }),
    [props.data, subTitle, title],
  );
  return <Title {...props} data={mergedData} />;
}

const layoutTitle = Object.assign(LayoutTitleComponent, {
  headerCount(props: ComponentProps<LayoutTitleData>) {
    const { layout } = props;
    const title =
      typeof layout.data.title === 'string' ? layout.data.title : undefined;
    const subTitle =
      typeof layout.data.subTitle === 'string'
        ? layout.data.subTitle
        : undefined;
    return Title.headerCount({
      ...props,
      data: {
        ...props.data,
        title,
        subTitle,
      },
    });
  },
});

export default layoutTitle;
