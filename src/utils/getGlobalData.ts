import { GetStaticPropsContext } from 'next';
import { getAllStringTokens } from './contentful/content/stringTokens';
import { WithGlobals } from './types';

export async function getGlobalData(
  ctx: GetStaticPropsContext,
): Promise<WithGlobals<unknown>> {
  if (ctx.preview == null) {
    return {
      preview: false,
    };
  }
  return {
    preview: true,
    stringSymbols: await getAllStringTokens({
      locale: ctx.locale,
      preview: ctx.preview,
    }),
  };
}
