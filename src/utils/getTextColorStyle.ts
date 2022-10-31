import { CSSProperties } from 'react';

export function getTextColorStyle(
  color: string | null | undefined,
): CSSProperties | null {
  return color
    ? ({
        color,
        '--tw-prose-body': 'currentColor',
        '--tw-prose-bold': 'currentColor',
        '--tw-prose-headings': 'currentColor',
      } as CSSProperties)
    : null;
}
