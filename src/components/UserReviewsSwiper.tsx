import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, type Swiper as SwiperType } from 'swiper';
import { ContentfulFields, SafeValue } from 'src/utils/contentful';

import RichText from './RichText';
import 'swiper/css';
import StarScore from './StarScore';

const defaultSlidesPerViewViews = 1;

const breakpoints = {
  720: {
    slidesPerView: 2,
  },
  1280: {
    slidesPerView: 3,
  },
};

export default function UserReviewsSwiper({
  reviews,
  isLoading,
  onEndReached,
}: {
  isLoading: boolean;
  onEndReached?: () => void;
  reviews: SafeValue<(ContentfulFields<'userReview'> & { id: string })[]>;
}) {
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);

  return (
    <div className="w-full overflow pr-[5vw]">
      <div className="">
        <button
          type="button"
          disabled={isBeginning}
          className="font-mono text-white bg-black p-3 ml-2 rounded-md border hover:opacity-75 disabled:bg-white disabled:border-black disabled:text-black transition-colors"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          {'<-'}
        </button>
        <button
          type="button"
          disabled={isEnd}
          className="font-mono text-white bg-black p-3 ml-2 rounded-md border hover:opacity-75 disabled:bg-white disabled:border-black disabled:text-black transition-colors"
          onClick={() => swiperRef.current?.slideNext()}
        >
          {'->'}
        </button>
      </div>
      <Swiper
        onInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mt-8"
        spaceBetween={20}
        slidesPerView={defaultSlidesPerViewViews}
        breakpoints={breakpoints}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        onPaginationUpdate={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onResize={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onReachEnd={() => {
          if (!isLoading) {
            onEndReached?.();
          }
        }}
        style={{ overflow: 'visible' }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="px-10 py-6 bg-[#252525] text-[#BFD6E2] font-mono font-light rounded-xl min-h-[623px] max-h-[623px] flex flex-col">
              <div>
                <span className="text-[#AFAFAF] mr-4">Name:</span>
                <span>{review.firstName}</span>{' '}
                <span>{review.lastName?.slice(0, 1)}</span>
              </div>

              <div className="mt-1">
                <span className="text-[#AFAFAF] mr-4">Role:</span>
                <span>{review.role}</span>
              </div>
              <div className="mt-6">
                <StarScore
                  score={review.score}
                  maxScore={
                    review.source?.fields.reviewMaxScore ?? review.score
                  }
                />
              </div>

              <div className="flex-1 mt-4 text-ellipsis overflow-y-auto">
                <RichText content={review.review} className="text-[#BFD6E2]" />
              </div>
              <div className="mt-8 flex flex-row">
                <div className="w-10 h-10 flex items-center">
                  <img
                    src={review.source?.fields.logo?.fields?.file?.url}
                    alt={review.source?.fields.logo?.fields?.title}
                    width={
                      review.source?.fields.logo?.fields.file.details.image
                        ?.width
                    }
                    height={
                      review.source?.fields.logo?.fields.file.details.image
                        ?.height
                    }
                    loading="lazy"
                  />
                </div>
                <div className="ml-4 flex flex-col text-gray-500">
                  <span>Verified user</span>
                  <span>Review from {review.source?.fields.name}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
