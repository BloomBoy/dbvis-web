/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import React, { ComponentType } from 'react';

type HOC<Props extends {}> = (
  Comp: ComponentType<Props>,
) => ComponentType<Props>;

type UnifiedProps<HOCs extends readonly HOC<any>[]> = {
  [key in keyof HOCs]: (
    props: React.ComponentPropsWithoutRef<ReturnType<HOCs[key]>>,
  ) => void;
}[number] extends (props: infer Q) => void
  ? {
      [key in keyof Q]: Q[key];
    }
  : never;

/**
 * Composes multiple HOCs into a single HOC
 *
 * The first specified HOC will be the outermost HOC
 * and the last specified HOC will be the innermost HOC
 *
 * order of the HOCs is important if you need
 * contexts to be available to the inner HOCs
 *
 * @param HOCs The HOCs to be composed
 * @returns A single HOC that composes all the specified HOCs
 */
export default function composeHOCs<HOCs extends HOC<any>[]>(...hocs: HOCs) {
  return function ComposeComp(
    Comp: ComponentType<UnifiedProps<HOCs>>,
  ): ComponentType<UnifiedProps<HOCs>> {
    const composedHOC = hocs.reduceRight<ComponentType<UnifiedProps<HOCs>>>(
      (acc, HOC) => HOC(acc),
      Comp,
    );
    return composedHOC;
  };
}
