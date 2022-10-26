import React from 'react';
import RecommendedInstallers from 'src/components/download/RecommendedInstallers';
import AllInstallers from 'src/components/download/AllInstallers';
import InstallationInstructions from 'src/components/download/InstallationInstructions';

export default function DownloadPage(): JSX.Element {
  return (
    <>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <h1>Download</h1>
        <span>Here mail-signup component will be rendered</span>
      </div>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <RecommendedInstallers />
      </div>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <AllInstallers />
      </div>
      <div
        className="width-full"
        style={{ backgroundColor: 'rgb(43, 43, 43)' }}
      >
        <div className="mx-auto p-8 rounded-3xl max-w-7xl">
          <InstallationInstructions />
        </div>
      </div>
    </>
  );
}
