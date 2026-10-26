import React from "react";

const reviews = [
  {
    id: 1,
    quote:
      "An exceptional experience from start to finish. The team's knowledge, transparency, and attention to detail gave me complete confidence in my purchase.",
    author: "Z. Rashid",
    role: "First-Time Collector",
  },
  {
    id: 2,
    quote:
      "An exceptional experience from start to finish. The team's knowledge, transparency, and attention to detail gave me complete confidence in my purchase.",
    author: "Z. Rashid",
    role: "First-Time Collector",
  },
  {
    id: 3,
    quote:
      "An exceptional experience from start to finish. The team's knowledge, transparency, and attention to detail gave me complete confidence in my purchase.",
    author: "Z. Rashid",
    role: "First-Time Collector",
  },
];

export default function ReviewsSection() {
  return (
    <section className="w-full bg-[#E7DDD2] py-14 sm:py-16 lg:py-20 relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* =========================================
            SECTION HEADER (Hidden on mobile)
            ========================================= */}
        <div className="hidden md:block text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-[#1C1A17] font-serif text-[32px] sm:text-[44px] md:text-[66px] lg:text-[75px] xl:text-[78px] tracking-tight leading-tight md:leading-[1.02] uppercase mb-2 sm:mb-3 md:mb-4">
            WORDS FROM OUR COLLECTORS.
          </h2>
          <p className="text-[13px] sm:text-[15px] md:text-[21px] lg:text-[23px] text-[#4A423A] font-sans font-normal tracking-normal">
            Trusted by those who appreciate what lies beyond the dial.
          </p>
        </div>

        {/* =========================================
            DESKTOP VIEW (hidden md:grid)
            ========================================= */}
        <div className="hidden md:grid grid-cols-4 gap-6 items-stretch md:-mt-[50px]">
          {/* Column 1: Hero Quote */}
          <div className="flex flex-col justify-between py-2 px-1">
            <h3 className="text-[#9D7E50] font-serif font-normal text-[25px] lg:text-[28px] xl:text-[30px] leading-[1.22] tracking-tight text-center uppercase">
              <span className="block">&ldquo;A TIMEPIECE IS</span>
              <span className="block">MORE THAN AN</span>
              <span className="block">ACQUISITION. IT</span>
              <span className="block">IS A PIECE OF</span>
              <span className="block">HISTORY.&rdquo;</span>
            </h3>
            <div className="text-right mt-6">
              <span className="block text-[15px] sm:text-[16px] text-[#3A332C] font-medium leading-snug font-sans">
                – Ameen Khan
              </span>
              <span className="block text-[13px] sm:text-[14px] text-[#4D443B] leading-snug font-sans">
                (Entrepreneur)
              </span>
            </div>
          </div>

          {/* Columns 2, 3, 4: Review Cards */}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#DDD2C3] p-6 sm:p-7 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center justify-center gap-1.5 mb-3 text-[#D9A742]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-[18px] h-[18px] fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Hairline Divider */}
                <div className="w-full h-[1px] bg-[#C4B7A5] mb-4" />

                {/* Body Quote */}
                <p className="text-[13px] sm:text-[14px] text-[#2E2822] leading-relaxed font-sans mb-6">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Author Attribution */}
              <div className="text-right mt-auto">
                <span className="block font-medium text-[13px] text-[#1C1A17] font-sans">
                  {review.author}
                </span>
                <span className="block text-[12px] text-[#4D443B] font-sans">
                  {review.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            MOBILE VIEW (block md:hidden)
            ========================================= */}
        <div className="block md:hidden max-w-[380px] mx-auto">
          {/* Hero Quote */}
          <div className="mb-10 text-center">
            <h3 
              className="text-[#9D7E50] font-serif font-normal text-[36px] sm:text-[38px] leading-[1.18] tracking-tight mb-4 text-center uppercase"
              style={{ fontSize: '36px', lineHeight: 1.18 }}
            >
              <span className="block">&ldquo;A TIMEPIECE IS</span>
              <span className="block">MORE THAN AN</span>
              <span className="block">ACQUISITION. IT</span>
              <span className="block">IS A PIECE OF</span>
              <span className="block">HISTORY.&rdquo;</span>
            </h3>
            <div className="text-right">
              <span className="block text-[15px] sm:text-[16px] text-[#3A332C] font-medium leading-snug font-sans">
                – Ameen Khan
              </span>
              <span className="block text-[13px] sm:text-[14px] text-[#4D443B] leading-snug font-sans">
                (Entrepreneur)
              </span>
            </div>
          </div>

          {/* Review Cards Stacked */}
          <div className="flex flex-col gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#DDD2C3] p-6 sm:p-7 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center justify-center gap-1.5 mb-3 text-[#D9A742]">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-[18px] h-[18px] fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Hairline Divider */}
                  <div className="w-full h-[1px] bg-[#C4B7A5] mb-4" />

                  {/* Body Quote */}
                  <p 
                    className="text-[#2E2822] font-sans mb-6 text-[16px] sm:text-[17px] leading-relaxed"
                    style={{ fontSize: '16px', lineHeight: 1.55 }}
                  >
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                {/* Author Attribution */}
                <div className="text-right mt-auto">
                  <span 
                    className="block font-medium text-[#1C1A17] font-sans text-[15px]"
                    style={{ fontSize: '15px' }}
                  >
                    {review.author}
                  </span>
                  <span 
                    className="block text-[#4D443B] font-sans text-[13.5px]"
                    style={{ fontSize: '13.5px' }}
                  >
                    {review.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
