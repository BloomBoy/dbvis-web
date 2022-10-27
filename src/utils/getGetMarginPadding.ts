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

export default function getMarginPadding({
  size = '0' as Size,
  type = 'padding' as 'padding' | 'margin',
  direction = 'horizontal' as 'horizontal' | 'vertical',
}) {
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

  return null;
}
