import React from 'react';
import { ContentfulFields, SafeValue } from 'src/utils/contentful';
import 'swiper/css';
import StarScore from './StarScore';

export default function ReviewSourceScoreRow({
  reviewSource,
}: {
  reviewSource: SafeValue<ContentfulFields<'reviewSource'>>;
}) {
  return (
    <div className="font-mono bg-grey-300 rounded-lg mt-8 py-4 flex flex-row justify-between items-center text-black px-6 md:px-10">
      <div className="flex flex-row gap-8">
        <img
          src={reviewSource?.logo.fields.file.url}
          alt={reviewSource?.logo.fields.title}
        />
        <span className="uppercase my-auto">{reviewSource?.name}</span>
      </div>
      <div>
        <span>{reviewSource?.averageScore}</span>
        <span className="mx-2">{'/'}</span>
        <span>{reviewSource?.reviewMaxScore}</span>
      </div>
      <div>
        <StarScore
          score={reviewSource.averageScore ?? 0}
          maxScore={reviewSource.reviewMaxScore}
          color="#EDC90E"
          size={16}
        />
      </div>
      <div>
        <span>
          <a
            className="uppercase underline text-product"
            href={reviewSource.url}
          >
            {'Reviews ->'}
          </a>
        </span>
      </div>
    </div>
  );
}
