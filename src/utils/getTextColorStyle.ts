import { CSSProperties } from 'react';

export function getTextColorStyle(
  color: string | null | undefined,
): CSSProperties | null {
  return color
    ? ({
        color,
        '--contentful-text-color': 'currentColor',
        '--title-main-color': 'currentColor',
      } as CSSProperties)
    : null;
}
