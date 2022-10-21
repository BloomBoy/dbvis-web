import Footer from './navigation/Footer';
import Header from './navigation/Header';
import React from 'react';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <Header behavior="sticky" className="h-20" />
      <div className="min-h-screen flex flex-col items-stretch">
        <main className="flex-grow flex-shrink-0">{children}</main>
        <Footer className="flex-grow-0 flex-shrink-0" />
      </div>
    </>
  );
}
