import axios from 'axios';

/**
 * convert HSL value to RGB value
 * @param {number} h Hue
 * @param {number} s Saturation
 * @param {number} l Lightness
 * @returns {[r: number, g: number, b: number]}
 */
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  let p = h / 60;
  sndComp = c * (1 - Math.abs((p % 2) - 1));
  p = Math.floor(p);

  let r, g, b;

  switch (p) {
    case 0:
      r = c;
      g = sndComp;
      b = 0;
      break;
    case 1:
      r = sndComp;
      g = c;
      b = 0;
      break;
    case 2:
      r = 0;
      g = c;
      b = sndComp;
      break;
    case 3:
      r = 0;
      g = sndComp;
      b = c;
      break;
    case 4:
      r = sndComp;
      g = 0;
      b = c;
      break;
    case 5:
      r = c;
      g = 0;
      b = sndComp;
      break;
    default:
      r = 0;
      g = 0;
      b = 0;
      break;
  }

  const m = l - c / 2;
  return [
    Math.round(255 * (r + m)),
    Math.round(255 * (g + m)),
    Math.round(255 * (b + m)),
  ];
}

/**
 * clamp number to 0-255 and convert to hex string
 *
 * @param {number} num number to convert
 * @returns {string} hex string
 */
function numberToClampedHex(num) {
  return Math.max(0, Math.min(255, Math.round(num)))
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

/**
 * Parse a string color into a color object
 *
 * @param {string} [str]
 * @returns {[
 *  color: string;
 *  alpha: string;
 * ]}
 */
function parseStringcolor(str) {
  if (!str) return null;
  const color = parseColor(str);
  if (color.type === 'hsl') {
    color.type = 'rgb';
    color.values = hslToRgb(...color.values);
  }
  let {
    values: [r, g, b],
    alpha: a,
  } = color;

  r = numberToClampedHex(r);
  g = numberToClampedHex(g);
  b = numberToClampedHex(b);
  a = numberToClampedHex(a * 255);
  if (a === 'FF') a = '';

  return [`${r}${g}${b}`, a];
}

/**
 * Tailwind CSS theme builder
 *
 * @param {string} primaryColor
 * @returns {object} Tailwind compatible color scheme
 */
export default function generateColorThemePalette(primaryColor) {
  const [primaryRGB, primaryAlpha] = parseStringcolor(primaryColor);

  return axios
    .get('https://app.uibakery.io/api/painter/support', {
      params: { primary: primaryRGB },
    })
    .then(({ data: { primary, ...data } }) => ({
      primary: primary.map((c) => `${c}${primaryAlpha}`),
      ...data,
    }))
    .then((res) =>
      Object.entries(res).reduce((acc, [key, val]) => {
        val.forEach((color, index) => {
          acc[`color-${key}-${(index + 1) * 100}`] = color;
        });
        return acc;
      }, {}),
    );
}
