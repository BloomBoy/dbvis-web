import Image from 'next/image';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="px-8">
      <main className="min-h-screen py-16 flex flex-col justify-center items-center">
        <h1 className="m-0 text-6xl text-center">
          Welcome to{' '}
          <a
            className="text-primary no-underline hover:underline focus:underline active:underline"
            href="https://nextjs.org"
          >
            Next.js!
          </a>
        </h1>

        <p className="my-16 text-2xl text-center">
          Get started by editing{' '}
          <code className="rounded p-3 text-lg font-mono bg-neutral-100">
            pages/index.tsx
          </code>
        </p>

        <div className="flex items-center justify-center max-w-3xl flex-wrap w-full flex-col md:w-auto md:flex-row">
          <a
            href="https://nextjs.org/docs"
            className="m-4 p-6 text-left no-underline text-inherit border border-neutral-200 rounded-xl transition-colors max-w-xs w-full hover:text-primary focus:text-primary active:text-primary hover:border-primary focus:border-primary active:border-primary"
          >
            <h2 className="mb-4 text-2xl">Documentation &rarr;</h2>
            <p className="m-0 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="m-4 p-6 text-left no-underline text-inherit border border-neutral-200 rounded-xl transition-colors max-w-xs w-full hover:text-primary focus:text-primary active:text-primary hover:border-primary focus:border-primary active:border-primary"
          >
            <h2 className="mb-4 text-2xl">Learn &rarr;</h2>
            <p className="m-0 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className="m-4 p-6 text-left no-underline text-inherit border border-neutral-200 rounded-xl transition-colors max-w-xs w-full hover:text-primary focus:text-primary active:text-primary hover:border-primary focus:border-primary active:border-primary"
          >
            <h2 className="mb-4 text-2xl">Examples &rarr;</h2>
            <p className="m-0 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&amp;utm_medium=default-template&amp;utm_campaign=create-next-app"
            className="m-4 p-6 text-left no-underline text-inherit border border-neutral-200 rounded-xl transition-colors max-w-xs w-full hover:text-primary focus:text-primary active:text-primary hover:border-primary focus:border-primary active:border-primary"
          >
            <h2 className="mb-4 text-2xl">Deploy &rarr;</h2>
            <p className="m-0 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex flex-1 py-8 border-t border-neutral-200 justify-center items-center">
        <a
          href="https://vercel.com?utm_source=create-next-app&amp;utm_medium=default-template&amp;utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center flex-grow"
        >
          Powered by{' '}
          <span className="h-4 ms-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
