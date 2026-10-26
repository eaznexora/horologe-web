import Image from "next/image";

const logos = [
  "/assets/Rolex%20slider.png",
  "/assets/Hublot%20slider.png",
  "/assets/Omega%20slider.png",
  "/assets/patek%20philip%20slider.png",
  "/assets/Audemars%20piguet%20slider.png",
];

export default function HouseOfHorology() {
  return (
    <section className="w-full bg-[#E7DDD2] flex flex-col relative z-20">
      <div className="flex flex-col md:flex-row w-full justify-between items-stretch">
        {/* Mobile Layout Wrapper (< md) */}
        <div className="flex flex-col w-full md:hidden bg-[#E7DDD2]">
          {/* Upper Text Block */}
          <div className="px-5 pt-2 pb-5">
            <h2 
              className="font-serif tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.75rem, 11vw, 3.5rem)', lineHeight: 1.05 }}
            >
              <span className="block text-[#1C1A17]">THE HOUSE OF</span>
              <span className="block text-[#A38350]">HOROLOGY.</span>
            </h2>
            <p 
              className="mt-3.5 text-[#2B2724] font-normal tracking-normal max-w-none"
              style={{ fontSize: 'clamp(1rem, 4.2vw, 1.15rem)', lineHeight: 1.5 }}
            >
              An ever-evolving collection of distinguished timepieces, sourced with discretion and selected for those who appreciate what lies beyond the dial.
            </p>
          </div>

          {/* Full-Bleed Divider Line */}
          <div style={{ width: '100%', height: '1.5px', backgroundColor: '#B8A996', margin: '28px 0' }} />

          {/* Stats Block */}
          <div className="flex flex-col items-center gap-5 px-4 pb-8">
            {/* Stat 1 */}
            <div className="flex items-center justify-start gap-5 w-[310px]">
              <span className="font-serif" style={{ fontSize: '106px', lineHeight: '0.85', color: '#A38350', fontWeight: 300, letterSpacing: '-0.03em', display: 'inline-block' }}>
                20+
              </span>
              <span className="font-sans" style={{ fontSize: '18.5px', fontWeight: 600, letterSpacing: '0.16em', lineHeight: '1.2', color: '#1C1A17', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: 'translateY(9px)' }}>
                <span>YEARS OF</span>
                <span>EXPERTISE</span>
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center justify-start gap-5 w-[310px]">
              <span className="font-serif" style={{ fontSize: '106px', lineHeight: '0.85', color: '#A38350', fontWeight: 300, letterSpacing: '-0.03em', display: 'inline-block' }}>
                20+
              </span>
              <span className="font-sans" style={{ fontSize: '18.5px', fontWeight: 600, letterSpacing: '0.16em', lineHeight: '1.2', color: '#1C1A17', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: 'translateY(9px)' }}>
                <span>TIMEPIECES</span>
                <span>SOURCED</span>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout Wrapper (>= md) */}
        <div className="w-full md:flex-1 hidden md:flex flex-col justify-between md:px-16 lg:px-24 xl:px-32 md:pt-0 md:pb-10 lg:pb-14">
          <div className="md:pt-14 lg:pt-[4.75rem]">
            <h2 className="font-serif md:text-[2.85rem] lg:text-[4.25rem] xl:text-[5.7rem] font-normal tracking-tight leading-tight md:leading-[0.95] uppercase">
              <span className="block text-[#1C1A17]">THE HOUSE OF</span>
              <span className="block text-[#A38350]">HOROLOGY.</span>
            </h2>
            
            <p className="font-sans md:text-base lg:text-[18px] font-normal md:leading-[1.6] md:text-[#4A4641] md:max-w-[95%] lg:max-w-xl md:mt-[1.3rem]">
              An ever-evolving collection of distinguished timepieces, sourced with discretion and selected for those who appreciate what lies beyond the dial.
            </p>
          </div>

          <div className="border-t border-[#B5AEA1] w-full mb-8"></div>

          <div className="flex md:flex-row md:items-center md:gap-12 lg:gap-20 md:ml-8 lg:ml-12 md:-mt-4 lg:-mt-6 md:-translate-y-[10px]">
            {/* Stat 1 */}
            <div className="flex items-center md:gap-3 lg:gap-4">
              <span className="font-serif md:text-8xl lg:text-[100px] xl:text-[112px] font-light text-[#A38350] tracking-tight leading-none select-none inline-block md:-translate-y-[12px]">
                20+
              </span>
              <span className="font-sans md:text-base lg:text-lg font-semibold md:tracking-[0.2em] md:leading-[1.3] md:text-[#2B2724] uppercase flex flex-col justify-center">
                <span>YEARS OF</span>
                <span>EXPERTISE</span>
              </span>
            </div>
            {/* Stat 2 */}
            <div className="flex items-center md:gap-3 lg:gap-4">
              <span className="font-serif md:text-8xl lg:text-[100px] xl:text-[112px] font-light text-[#A38350] tracking-tight leading-none select-none inline-block md:-translate-y-[12px]">
                20+
              </span>
              <span className="font-sans md:text-base lg:text-lg font-semibold md:tracking-[0.2em] md:leading-[1.3] md:text-[#2B2724] uppercase flex flex-col justify-center">
                <span>TIMEPIECES</span>
                <span>SOURCED</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (Store Image) */}
        <div className="w-full md:w-auto relative flex justify-end bg-[#E7DDD2]">
          <img 
            src="/assets/horologe%20store%201.png" 
            alt="Horologe Royale Storefront" 
            className="w-full h-auto md:w-auto md:h-full object-contain object-right md:object-right-top"
            style={{ maxHeight: '95%' }}
          />
        </div>
      </div>

      {/* Brand Logos Shelf */}
      <div className="w-full bg-[#E7DDD2] border-t border-[#B5AEA1] border-b border-[#B5AEA1] overflow-hidden py-6 md:py-4 lg:py-5 relative z-30 md:-mt-6 lg:-mt-10">
        {/* Desktop Static */}
        <div className="hidden md:flex items-center justify-around px-8 lg:px-16 max-w-7xl mx-auto w-full">
          {logos.map((logo, idx) => (
            <div key={idx} className="relative h-10 sm:h-11 lg:h-12 xl:h-14 w-36 lg:w-48 xl:w-56">
              <Image src={logo} alt="Brand Logo" fill className="object-contain" />
            </div>
          ))}
        </div>

        {/* Mobile Infinite Slider */}
        <div className="flex md:hidden relative w-full overflow-hidden">
          <div className="flex animate-marquee w-max items-center">
            {[...logos, ...logos].map((logo, idx) => (
              <div key={idx} className="relative h-[54px] w-[200px] -mx-4 flex-shrink-0">
                <Image src={logo} alt="Brand Logo" fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}} />
    </section>
  );
}
