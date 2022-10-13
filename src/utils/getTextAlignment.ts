export default function getTextAlignment(alignment = 'center') {
  let textAlign = 'text-center';
  switch (alignment) {
    case 'left':
      textAlign = 'text-start';
      break;
    case 'right':
      textAlign = 'text-end';
      break;
    default:
      textAlign = 'text-center';
  }
  return textAlign;
}
