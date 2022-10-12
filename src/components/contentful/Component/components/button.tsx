import * as Contentful from 'contentful';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import type { ComponentProps } from '..';
import Link from 'next/link';

type TextData = {
  buttonText: Contentful.EntryFields.Symbol;
  target: Contentful.EntryFields.Symbol;
};

function MaybeLink({
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

export default function button(
  props: ComponentProps<TextData>,
): JSX.Element | null {
  return (
    <MaybeLink href={props.data.target}>{props.data.buttonText}</MaybeLink>
  );
}
