import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, type Swiper as SwiperType } from 'swiper';
import { ContentfulFields, SafeValue } from 'src/utils/contentful';

import RichText from './RichText';
import 'swiper/css';

const defaultSlidesPerViewViews = 1;

const breakpoints = {
  840: {
    slidesPerView: 2,
  },
  1280: {
    slidesPerView: 3,
  },
  1680: {
    slidesPerView: 4,
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

  return (
    <div className="w-full overflow-hidden">
      <div className="mx-auto px-8">
        <button
          type="button"
          className="font-mono border border-spacing-5 p-3 bg-white rounded-md border-black hover:opacity-75"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          {'<-'}
        </button>
        <button
          type="button"
          className="font-mono text-white bg-black p-3 ml-2 rounded-md border hover:opacity-75"
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
        onReachEnd={() => {
          if (!isLoading) {
            onEndReached?.();
          }
        }}
        style={{ overflow: 'visible' }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="flex justify-center align-center">
              <div className="w-[400px] px-10 py-6 bg-[#252525] text-[#BFD6E2] font-mono font-light rounded-xl min-h-[623px] max-h-[623px] flex flex-col">
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
                  <span className="text-[#AFAFAF] inline-block relative text-[24px] font-light">
                    *****
                    <div
                      className="absolute top-0 left-0 bottom-0 text-[#FFD80C] text-[24px] font-light overflow-hidden"
                      style={{
                        width: `${
                          (review.score /
                            (review.source?.fields.reviewMaxScore ??
                              review.score)) *
                          100
                        }%`,
                      }}
                    >
                      *****
                    </div>
                  </span>
                </div>
                <div className="flex-1 mt-4 text-ellipsis overflow-y-auto">
                  <RichText
                    content={review.review}
                    className="text-[#BFD6E2]"
                  />
                </div>
                <div className="mt-8 flex flex-row">
                  <img
                    src={review.source?.fields.logo.fields.file.url}
                    alt={review.source?.fields.logo.fields.title}
                  />
                  <div className="ml-4 flex flex-col text-gray-500">
                    <span>Verified user</span>
                    <span>Review from {review.source?.fields.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
