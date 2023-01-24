import React from 'react';

export type FontConfig = {
  family: string;
  [key: string]: string | string[] | undefined;
};

function doPreloadFonts(fontConfigs: FontConfig[]) {
  const fontArr = new Array<FontFace>(document.fonts.size);
  const iterator = document.fonts.values();
  for (let i = 0; i < fontArr.length; i++) {
    const it = iterator.next();
    if (it.done) {
      fontArr.length = i;
      break;
    }
    fontArr[i] = it.value;
  }
  fontArr.forEach((font) => {
    if (font.status !== 'unloaded') return;
    const matches = fontConfigs.some(({ family, ...params }) => {
      if (family !== font.family) return false;
      return Object.entries(params).every(([key, value]) => {
        if (value == null) return true;
        if (!(key in font)) return false;
        if (Array.isArray(value))
          return value.some((v) => v === font[key as keyof typeof font]);
        return value === font[key as keyof typeof font];
      });
    });
    if (matches) font.load().catch(console.error);
  });
}

export function preloadFont(...fontConfigs: FontConfig[]) {
  if (typeof window === 'undefined' || window.document.fonts == null) {
    return;
  }
  if (document.fonts.status === 'loaded') {
    doPreloadFonts(fontConfigs);
  } else {
    const onReady = () => {
      doPreloadFonts(fontConfigs);
      document.fonts.removeEventListener('loadingdone', onReady);
    };
    document.fonts.addEventListener('loadingdone', onReady);
  }
}

export default function PreloadFonts({
  children,
  fonts,
}: {
  children?: React.ReactNode;
  fonts: FontConfig[];
}) {
  React.useEffect(() => {
    try {
      preloadFont(...fonts);
    } catch (err) {
      // This is not a fatal error, and should be ignored
      console.warn('Failed to preload fonts:', err);
    }
  }, [fonts]);
  return React.createElement(React.Fragment, {}, children);
}
