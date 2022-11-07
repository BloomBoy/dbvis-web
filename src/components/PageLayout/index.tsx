import Footer from './navigation/Footer';
import Header from './navigation/Header';
import React from 'react';
import usePageConfig from 'src/hooks/usePageConfig';
import { SubHeaderProvider } from './navigation/Header/SubHeader';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { headerMode } = usePageConfig();
  return (
    <>
      <Header
        behavior={headerMode ?? 'sticky'}
        className="relative z-10 h-20 lg:h-32"
      />
      <SubHeaderProvider>
        <div className="min-h-screen flex flex-col items-stretch overflow-hidden">
          <main className="flex-grow flex-shrink-0">{children}</main>
          <Footer className="flex-grow-0 flex-shrink-0" />
        </div>
      </SubHeaderProvider>
    </>
  );
}
