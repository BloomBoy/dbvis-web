import { ComponentProps, ComponentType, FC, createElement } from 'react';
import componentDisplayName from './componentDisplayName';

export default function asHOC<
  T extends ComponentType | keyof JSX.IntrinsicElements,
  U extends ComponentType | keyof JSX.IntrinsicElements,
>(
  ProviderComponent: T,
  providerProps: ComponentProps<T>,
): (Comp: U) => FC<ComponentProps<U>> {
  function Wrapper(Comp: U) {
    function WrappedComponent(props: ComponentProps<U>) {
      return createElement(
        ProviderComponent,
        providerProps,
        createElement(Comp, props),
      );
    }
    WrappedComponent.displayName = `asHOC(${componentDisplayName(
      ProviderComponent,
    )})(${componentDisplayName(Comp)})`;
    return WrappedComponent;
  }
  return Wrapper;
}
