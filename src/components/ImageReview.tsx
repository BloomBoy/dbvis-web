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
    <a href={reviewSource.url} className="flex">
      <div
        className="bg-grey-300 rounded-lg p-3 pr-7 flex flex-row justify-between items-center font-mono text-black text-xs uppercase"
        style={{ boxShadow: ' 0px 0px 12px rgba(0, 0, 0, 0.03)' }}
      >
        <div className="bg-[#FAFAFA] rounded-xl h-16 w-16 p-3 mr-4 flex justify-center items-center">
          <img
            src={reviewSource?.logo?.fields.file.url}
            alt={reviewSource?.logo?.fields.title}
            loading="lazy"
          />
        </div>
        <div>
          <StarScore
            score={reviewSource.averageScore ?? 0}
            maxScore={reviewSource.reviewMaxScore}
            color="#EDC90E"
            size={16}
          />
          <div>
            <span>{reviewSource?.averageScore}</span>
            <span className="mx-2">{'/'}</span>
            <span>{reviewSource?.reviewMaxScore}</span>
            <span className="text-grey-500"> (100+ reviews)</span>
          </div>
          <div className="font-bold">#1 highest rated</div>
          <div className="text-grey-500">in database management systems</div>
        </div>
      </div>
    </a>
  );
}
