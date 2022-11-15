import Footer from './navigation/Footer';
import Header from './navigation/Header';
import React, { useEffect, useState } from 'react';
import usePageConfig from 'src/hooks/usePageConfig';
import { SubHeaderProvider } from './navigation/Header/SubHeader';
import { useRouter } from 'next/router';
import MaybeLink from '../contentful/MaybeLink';
import classNames from 'classnames';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { headerMode } = usePageConfig();
  const { isPreview } = useRouter();
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsShrunk((is) => {
        if (
          !is &&
          (document.body.scrollTop > 20 ||
            document.documentElement.scrollTop > 20)
        ) {
          return true;
        }

        if (
          is &&
          document.body.scrollTop < 4 &&
          document.documentElement.scrollTop < 4
        ) {
          return false;
        }

        return is;
      });
    };
    addEventListener('scroll', handler);
    return () => {
      removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <>
      <Header
        behavior={headerMode ?? 'sticky'}
        className={classNames(
          isShrunk ? 'lg:h-16' : 'lg:h-32',
          'relative z-10 h-20 transition-all duration-300',
        )}
        isShrunk={isShrunk}
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
