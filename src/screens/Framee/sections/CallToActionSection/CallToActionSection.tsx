import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10 p-6 md:p-10 w-full bg-white rounded-lg">
      <div className="flex flex-col w-full lg:max-w-[488px] items-start gap-6 md:gap-8">
        <h1 className="font-hero font-[number:var(--hero-font-weight)] text-[#1d233a] text-[32px] md:text-[48px] lg:text-[length:var(--hero-font-size)] tracking-[var(--hero-letter-spacing)] leading-tight md:leading-[var(--hero-line-height)] [font-style:var(--hero-font-style)]">
          Ride in Comfort.
          <br />
          Arrive on Time
        </h1>

        <p className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
          Reliable car rentals with professional drivers for every occasion.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-[13px] w-full sm:w-auto">
          <Button className="bg-[#3289ff] hover:bg-[#2678e6] text-white text-lg md:text-2xl font-semibold px-4 py-3 md:py-4 h-auto rounded-lg [font-family:'Roboto',Helvetica]">
            Book a Ride Now
          </Button>

          <Button
            variant="outline"
            className="bg-white border-[#1d233a] text-[#1d233a] hover:bg-gray-50 text-lg md:text-2xl font-semibold px-4 py-3 md:py-4 h-auto rounded-lg [font-family:'Roboto',Helvetica]"
          >
            View Packages
          </Button>
        </div>

        <Badge className="inline-flex items-center gap-[7px] p-3 bg-[#e5f0ff] text-black hover:bg-[#e5f0ff] rounded-lg [font-family:'Roboto',Helvetica] font-normal text-sm md:text-base">
          <img
            className="w-[12.87px] h-[15.89px] flex-shrink-0"
            alt="Vector"
            src="/vector-2.svg"
          />
          <span>
            <span className="font-medium">Limited slots</span> for weekend
            transfers!
          </span>
        </Badge>
      </div>

      <img
        className="w-full lg:max-w-[535px] h-auto object-cover rounded-lg"
        alt="Rectangle"
        src="/rectangle-1.png"
      />
    </section>
  );
};
