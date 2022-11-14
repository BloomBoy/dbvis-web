import getFetchKey from 'src/utils/getFetchKey';
import { SavedComponentProps } from '..';
import MaybeLink from '../../MaybeLink';

type ReleaseNotesData = {
  a?: unknown;
};

interface CollectedData {
  b?: unknown;
}

function databaseFetchKey(
  { data: {}, type }: SavedComponentProps<ReleaseNotesData>,
  preview: boolean,
) {
  return getFetchKey(type, { preview });
}

const XMLData = [
  {
    id: 'a-string-1',
    title: 'DbVisualizer  14.0 - 14.0.1',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-2',
    title: 'DbVisualizer  13.0 - 13.0.6',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-3',
    title: 'DbVisualizer  12.1 - 12.1.9',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-4',
    title: 'DbVisualizer  12.0 - 12.0.9',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-5',
    title: 'DbVisualizer  11.0 - 11.0.7',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-6',
    title: 'DbVisualizer  10.0 - 10.0.27',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-7',
    title: 'DbVisualizer  9.5 - 9.5.8',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-8',
    title: 'DbVisualizer  9.2 - 9.2.17',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
  {
    id: 'a-string-9',
    title: 'DbVisualizer  9.1 - 9.1.13',
    releaseDate: '2022-10-14',
    slug: 'a-string-1',
  },
];
const latestVersion = XMLData.shift();

function ReleaseNotesComponent() {
  return (
    <>
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
              <MaybeLink
                href={`/releasenotes/${latestVersion?.slug}`}
                className="underline text-primary"
              >
                Release Notes -&gt;
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
                <MaybeLink
                  href={`/releasenotes/${item?.slug}`}
                  className="underline text-primary"
                >
                  Release Notes -&gt;
                </MaybeLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const releaseNotes = Object.assign(ReleaseNotesComponent, {
  registerDataCollector(
    props: SavedComponentProps<ReleaseNotesData>,
    preview: boolean,
  ) {
    return {
      fetchKey: databaseFetchKey(props, preview),
      async collect(): Promise<CollectedData> {
        return {};
      },
    };
  },
});

export default releaseNotes;
