import Footer from './navigation/Footer';
import Header from './navigation/Header';
import React from 'react';
import usePageConfig from 'src/hooks/usePageConfig';
import { SubHeaderProvider } from './navigation/Header/SubHeader';
import { useRouter } from 'next/router';
import MaybeLink from '../contentful/MaybeLink';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { headerMode } = usePageConfig();
  const { isPreview } = useRouter();

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
          {isPreview && (
            <MaybeLink href="/api/exit-preview">
              <div className="fixed bottom-2 right-2 bg-primary rounded-full p-4 flex flex-col text-center text-xs hover:font-bold h-20 w-20 shadow-md hover:shadow-lg">
                <div>LEAVE</div>
                <div>PREVIEW MODE</div>
              </div>
            </MaybeLink>
          )}
        </div>
      </SubHeaderProvider>
    </>
  );
}
