import type { ComponentType } from 'react';

export default function componentDisplayName(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any> | string,
) {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component(anonymous)';
}
