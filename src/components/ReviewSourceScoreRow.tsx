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
    <div
      className="font-mono bg-grey-300 rounded-lg py-4 mb-4 flex flex-row justify-between items-center text-black px-6 md:px-6"
      style={{ boxShadow: ' 0px 0px 12px rgba(0, 0, 0, 0.03)' }}
    >
      <div className="flex flex-row gap-8 no-grow no-shrink w-[40%]">
        <span className="bg-[#FAFAFA] p-2 rounded-md">
          <img
            src={reviewSource?.logo?.fields.file.url}
            alt={reviewSource?.logo?.fields.title}
            className="w-8 h-8"
          />
        </span>
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
