import React from 'react';
import buttonComponent from './components/button';
import imageComponent from './components/image';
import textComponent from './components/text';
import userReviewsComponent from './components/userReviews';
import databaseSearchComponent from './components/databaseSearch';

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
  registerDataCollector?: (
    props: Props,
    preview: boolean,
  ) => {
    fetchKey: string;
    collect: () => unknown | Promise<unknown>;
  } | null;
}

export const components: Record<
  `${string}Component`,
  ComponentRenderer<ComponentProps> | undefined
> = {
  textComponent,
  buttonComponent,
  imageComponent,
  userReviewsComponent,
  databaseSearchComponent,
};

export function isComponent(obj: unknown): obj is ComponentProps {
  if (typeof obj !== 'object' || obj == null) return false;
  if (Array.isArray(obj)) return false;
  if (!('type' in obj) || !('id' in obj) || !('data' in obj)) return false;
  const { type, id, data } = obj as Record<string, unknown>;
  if (typeof type !== 'string' || !type.endsWith('Component')) return false;
  if (typeof id !== 'string') return false;
  if (typeof data !== 'object' || data == null || Array.isArray(data)) {
    return false;
  }
  return true;
}

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
