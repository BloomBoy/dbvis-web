import React from 'react';
import MaybeLink from 'src/components/contentful/MaybeLink';
// import EmailSignupForm from 'src/components/contentful/Component/components/emailSignupForm';

type ReleaseNotesPageProps = {
  id: string;
  title: string;
  releaseDate: string;
  slug: string;
};

const XMLData = [
  {
    id: 'a-string-1',
    title: 'DbVisualizer  14.0 - 14.0.1',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-1',
    title: 'DbVisualizer  13.0 - 13.0.6',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-1',
    title: 'DbVisualizer  12.1 - 12.1.9',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-2',
    title: 'DbVisualizer  12.0 - 12.0.9',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-3',
    title: 'DbVisualizer  11.0 - 11.0.7',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-4',
    title: 'DbVisualizer  10.0 - 10.0.27',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-5',
    title: 'DbVisualizer  9.5 - 9.5.8',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-6',
    title: 'DbVisualizer  9.2 - 9.2.17',
    releaseDate: '2022-10-14',
    slug: '/',
  },
  {
    id: 'a-string-7',
    title: 'DbVisualizer  9.1 - 9.1.13',
    releaseDate: '2022-10-14',
    slug: '/',
  },
];
const latestVersion = XMLData.shift();

export default function ReleaseNotesPage({}: ReleaseNotesPageProps): JSX.Element {
  return (
    <>
      <div className="mx-auto p-8 rounded-3xl max-w-7xl">
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
        >
          All Version List
        </h3>
        <h1 className="text-6xl font-bold">Release notes.</h1>
        <hr className="border-dashed border-grey-500 mt-16 mb-8 opacity-20" />
        <h3
          className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
        >
          All Version Quick Links
        </h3>
        <ul className="flex felx-row gap-6">
          <li>
            <MaybeLink href="a-link">WHAT&apos;S NEW -&gt;</MaybeLink>
          </li>
          <li>
            <MaybeLink href="a-link">RELEASE NOTES -&gt;</MaybeLink>
          </li>
          <li>
            <MaybeLink href="a-link">DOWNLOADS -&gt;</MaybeLink>
          </li>
        </ul>
      </div>
      <div
        className="width-full py-2"
        style={{ backgroundColor: 'rgb(43, 43, 43)' }}
      >
        <div className="mx-auto my-16 p-8 rounded-3xl max-w-7xl">
          <h3
            className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
          >
            LATEST VERSION
          </h3>
          <table className="">
            <thead className="">
              <tr className="">
                <th>Version</th>
                <th>Release Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td>{latestVersion?.title}</td>
                <td className="text-grey-400">{latestVersion?.releaseDate}</td>
                <td>
                  <MaybeLink href={latestVersion?.slug} className="underline">
                    Release Notese -&gt;
                  </MaybeLink>
                </td>
              </tr>
            </tbody>
          </table>
          <h3
            className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
          >
            PREVIOUS VERSIONS
          </h3>
          <table className="">
            <thead className="">
              <tr className="">
                <th>Version</th>
                <th>Release Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {XMLData.map((item) => (
                <tr className="" key={item.id}>
                  <td>{item?.title}</td>
                  <td className="text-grey-400">{item?.releaseDate}</td>
                  <td>
                    <MaybeLink href={item?.slug} className="underline">
                      Release Notese -&gt;
                    </MaybeLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-8 mx-auto">
        <div
          className="rounded-3xl py-20 px-11"
          style={{ backgroundColor: '#FFFFCC' }}
        >
          <h3
            className={`font-mono font-light quote-decoration uppercase text-grey-500 mb-8`}
          >
            NOTIFY ME WHEN NEW FEATURES ARE ANNOUNCED
          </h3>

          {/* <EmailSignupForm
            data={{}}
            id={''}
            type={'emailSignupFormComponent'}
          /> */}
        </div>
      </div>
    </>
  );
}
