import React from "react";

const statsData = [
  {
    value: "10k+",
    label: "Rides\nCompleted",
  },
  {
    value: "4.8/5",
    label: "Avg\nRating",
  },
  {
    value: "50+",
    label: "Professional Drivers",
  },
];

export const BookingFormSection = (): JSX.Element => {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-20 lg:gap-[154px] w-full">
      {statsData.map((stat, index) => (
        <div key={index} className="flex flex-col items-center gap-4">
          <div className="font-hero font-[number:var(--hero-font-weight)] text-[#3289ff] text-[40px] sm:text-[48px] md:text-[length:var(--hero-font-size)] text-center tracking-[var(--hero-letter-spacing)] leading-tight md:leading-[var(--hero-line-height)] [font-style:var(--hero-font-style)]">
            {stat.value}
          </div>
          <div className="font-menu-item font-[number:var(--menu-item-font-weight)] text-black text-[length:var(--menu-item-font-size)] text-center tracking-[var(--menu-item-letter-spacing)] leading-[var(--menu-item-line-height)] [font-style:var(--menu-item-font-style)] whitespace-pre-line">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
};
