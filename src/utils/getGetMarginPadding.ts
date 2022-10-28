export type Size =
  | '0'
  | 'px'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '80'
  | '96';

export type Margin = Size | `-${Size}` | 'auto';

export default function getMarginPadding(options: {
  size?: Size;
  type: 'gap';
  direction?: 'horizontal' | 'vertical';
}): string | null;
export default function getMarginPadding(options: {
  size?: Size;
  type: 'padding';
  direction?: 'horizontal' | 'vertical';
}): string | null;
export default function getMarginPadding(options: {
  size?: Margin;
  type: 'margin';
  direction?: 'horizontal' | 'vertical';
}): string | null;
export default function getMarginPadding({
  size,
  type,
  direction,
}: {
  size?: Margin | Size;
  type: 'padding' | 'margin' | 'gap';
  direction?: 'horizontal' | 'vertical';
}) {
  if (size) {
    if (type == 'padding') {
      if (direction === 'horizontal') {
        return `px-${size}`;
      }
      if (direction === 'vertical') {
        return `py-${size}`;
      }
    }
    if (type == 'margin') {
      if (direction === 'horizontal') {
        return `mx-${size}`;
      }
      if (direction === 'vertical') {
        return `my-${size}`;
      }
    }
    if (type == 'gap') {
      if (direction === 'horizontal') {
        return `gap-x-${size}`;
      }
      if (direction === 'vertical') {
        return `gap-y-${size}`;
      }
    }
  }

  return null;
}
