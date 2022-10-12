import React from 'react';
import button from './components/button';
import image from './components/image';
import text from './components/text';

export type ComponentProps<Data = any> = {
  id: string;
  type: string;
  data: Data;
};

const layouts: Record<string, React.ComponentType<ComponentProps> | undefined> =
  {
    text,
    button,
    image,
  };

export default function Component(props: ComponentProps): JSX.Element | null {
  const { type } = props;
  const Comp = layouts[type];
  if (Comp == null) {
    return null;
  }
  return <Comp {...props} />;
}
