import React from 'react';
import buttonComponent from './components/button';
import imageComponent from './components/image';
import textComponent from './components/text';
import userReviewsComponent from './components/userReviews';

export interface ComponentProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data extends Record<string, unknown> = Record<string, any>,
> {
  id: string;
  type: `${string}Component`;
  data: Partial<Data>;
}

interface ComponentRenderer<Props> extends React.FC<Props> {
  headerCount?: number | ((props: Props) => number);
  registerDataCollector?: (props: Props) => {
    id: string;
    collect: () => unknown | Promise<unknown>;
  };
}

const components: Record<
  `${string}Component`,
  ComponentRenderer<ComponentProps> | undefined
> = {
  textComponent,
  buttonComponent,
  imageComponent,
  userReviewsComponent,
};

function ComponentComp(props: ComponentProps): JSX.Element | null {
  const { type } = props;
  const Comp = components[type];
  if (Comp == null) {
    return null;
  }
  return <Comp {...props} />;
}

const Component = Object.assign(ComponentComp, {
  headerCount(props: ComponentProps) {
    const { type } = props;
    const Comp = components[type];
    if (Comp == null) {
      return 0;
    }
    if (typeof Comp.headerCount === 'function') {
      return Comp.headerCount(props);
    }
    return Comp.headerCount ?? 0;
  },
});

export default Component;
