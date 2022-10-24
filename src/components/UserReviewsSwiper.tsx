import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, type Swiper as SwiperType } from 'swiper';

import 'swiper/css';

const reviews = [
  {
    name: 'Tim S',
    role: 'VP',
    score: 4,
    maxScore: 5,
    review:
      'I use DBVisualizer for all sorts of tasks, from managing and maintaining production Postgres databases to connecting and managing local and containerized databases. I love the ability to manage many different RDBMSs from the same interface, as well as the ability to generate diagrams and models from existing databases. I use DBVisualizer for all sorts of tasks, from managing and maintaining production Postgres databases to connecting and managing local and containerized databases. I love the ability to manage many different RDBMSs from the same interface, as well as the ability to generate diagrams and models from existing databases.',
  },
  {
    name: 'Test 2',
    score: 90,
    maxScore: 100,
    review: 'A text 2',
  },
  {
    name: 'Test 3',
    score: 2,
    maxScore: 5,
    review: 'A text 3',
  },
  {
    name: 'Test 4',
    score: 2,
    maxScore: 5,
    review: 'A text 4',
  },
  {
    name: 'Test 5',
    score: 5,
    maxScore: 5,
    review: 'A text 5',
  },
];

export default function UserReviewsSwiper() {
  const swiperRef = React.useRef<SwiperType | null>(null);
  return (
    <div>
      <button
        type="button"
        className="ml-8 font-mono border border-spacing-5 p-3 bg-white rounded-md border-black hover:opacity-75"
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
      <Swiper
        onInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mt-8"
        spaceBetween={20}
        slidesPerView={1}
        // centeredSlides
        breakpoints={{
          840: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 3,
          },
          1680: {
            slidesPerView: 4,
          },
        }}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        style={{ overflow: 'visible' }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.name}>
            <div className="flex justify-center align-center">
              <div className="w-[400px] px-10 py-6 bg-[#252525] text-[#BFD6E2] font-mono font-light rounded-xl min-h-[623px] max-h-[623px] flex flex-col">
                <div>
                  <span className="text-[#AFAFAF] mr-4">Name:</span>
                  <span>{review.name}</span>
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
                        width: `${(review.score / review.maxScore) * 100}%`,
                      }}
                    >
                      *****
                    </div>
                  </span>
                </div>
                <div className="flex-1 mt-4 text-ellipsis overflow-y-auto">
                  {/* <span className="text-ellipsis overflow-hidden"> */}
                  {review.review}
                  {/* </span> */}
                </div>
                <div className="mt-8">
                  <span>Review Source</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
