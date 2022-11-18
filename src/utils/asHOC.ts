/* eslint-disable @typescript-eslint/ban-types */
import { ComponentType, createElement } from 'react';
import componentDisplayName from './componentDisplayName';

/**
 * Turn a normal component into a HOC
 *
 * This works only if the props needed for the
 * do not depend on the react state.
 * and can be specified at the time of the HOC creation.
 *
 * @param ProviderComponent The component to be used as a HOC
 * @param providerProps The props to be passed to the ProviderComponent
 * @returns A function that takes a as an argument and returns
 * a new component that wraps the original component with the ProviderComponent
 */
export default function asHOC(
  ProviderComponent: ComponentType,
): <U extends {}>(Comp: ComponentType<U>) => ComponentType<U>;
export default function asHOC<P extends {}>(
  ProviderComponent: ComponentType<P>,
  providerProps: P,
): <U extends {}>(Comp: ComponentType<U>) => ComponentType<U>;
export default function asHOC<P extends {}>(
  ProviderComponent: ComponentType<P>,
  providerProps?: P,
): <U extends {}>(Comp: ComponentType<U>) => ComponentType<U> {
  function Wrapper<U extends {}>(Comp: ComponentType<U>) {
    function WrappedComponent(props: U) {
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
