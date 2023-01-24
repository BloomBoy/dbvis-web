import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import Link from 'next/link';
import classNames from 'classnames';

export default function MaybeLink({
  children,
  href,
  className,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  const fullClassNames = classNames(
    'uppercase font-mono font-normal decoration-from-font underline-offset-4',
    className,
  );
  if (!href) {
    return (
      <span className={fullClassNames} {...props}>
        {children}
      </span>
    );
  }
  if (href.startsWith('//') || /^[a-zA-Z_-]+:/.test(href)) {
    return (
      <a
        className={fullClassNames}
        href={href}
        {...props}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href}>
      <a className={fullClassNames} {...props}>
        {children}
      </a>
    </Link>
  );
}
