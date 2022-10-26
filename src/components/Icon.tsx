import React from 'react';
import Windows from './icons/Windows';
import Mac from './icons/Mac';
import Linux from './icons/Linux';

const OSComponent = {
  Windows: Windows,
  Mac: Mac,
  Linux: Linux,
};

export const OSList = ['Windows', 'Mac', 'Linux'];
export type OS = keyof typeof OSComponent;

type GetBrowser = {
  os: OS;
  className?: string;
  style?: React.CSSProperties;
  size: number | string;
};
export default function OSIcon({ os, className, style, size }: GetBrowser) {
  const Component = OSComponent[os] ?? Windows;

  return (
    <Component
      className={className}
      style={{
        ...style,
        minWidth: size,
        minHeight: size,
      }}
      height={size}
      width={size}
    />
  );
}
