/* eslint-disable @typescript-eslint/ban-types */
import { ComponentType, createElement, FC } from 'react';
import { AppProps } from 'next/app';
import componentDisplayName from './componentDisplayName';

export default function asNextHOC<PP extends {}, P extends {}>(
  ProviderComponent: ComponentType<PP & AppProps<P>>,
  providerProps: PP,
): <PageProps extends P, Props extends AppProps<PageProps>>(
  Comp: ComponentType<Props>,
) => ComponentType<Props>;
export default function asNextHOC<P extends {}>(
  ProviderComponent: ComponentType<P & AppProps<P>>,
): <PageProps extends P, Props extends AppProps<PageProps>>(
  Comp: ComponentType<Props>,
) => ComponentType<Props>;
export default function asNextHOC<PP extends {}, P extends {}>(
  ProviderComponent: ComponentType<(PP & AppProps<P>) | AppProps<P>>,
  providerProps?: PP,
): <PageProps extends P, Props extends AppProps<PageProps>>(
  Comp: ComponentType<Props>,
) => ComponentType<Props> {
  function Wrapper<Props extends AppProps<P>>(
    Comp: ComponentType<Props>,
  ): FC<Props> {
    function WrappedComponent(props: Props) {
      return createElement(
        ProviderComponent,
        providerProps == null ? props : { ...providerProps, ...props },
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
