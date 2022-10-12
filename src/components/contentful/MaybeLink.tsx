import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import Link from 'next/link';

export default function MaybeLink({
  children,
  href,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  if (!href) {
    return <span {...props}>{children}</span>;
  }
  if (href.startsWith('//') || /^[a-zA-Z_-]+:/.test(href)) {
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href}>
      <a {...props}>{children}</a>
    </Link>
  );
}
