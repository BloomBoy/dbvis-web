import type { ComponentType } from 'react';

export default function componentDisplayName(
  Component: ComponentType | string,
) {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component(anonymous)';
}
