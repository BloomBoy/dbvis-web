/* eslint-disable @typescript-eslint/ban-types */
import { ComponentType } from 'react';

type HOC = <Props extends {}>(
  Comp: ComponentType<Props>,
) => ComponentType<Props>;

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
export default function composeHOCs(...HOCs: HOC[]) {
  return function ComposeComp<Props extends {}>(
    Comp: ComponentType<Props>,
  ): ComponentType<Props> {
    const composedHOC = HOCs.reduceRight<ComponentType<Props>>(
      (acc, HOC) => HOC(acc),
      Comp,
    );
    return composedHOC;
  };
}
