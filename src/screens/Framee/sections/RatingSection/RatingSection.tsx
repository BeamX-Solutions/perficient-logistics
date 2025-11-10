import { MailIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const RatingSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center gap-6 md:gap-9 px-4 md:px-0 py-8 md:py-10 w-full bg-[#1d233a] rounded-lg">
      <h2 className="font-sub-header font-[number:var(--sub-header-font-weight)] text-white text-[24px] md:text-[length:var(--sub-header-font-size)] text-center tracking-[var(--sub-header-letter-spacing)] leading-[var(--sub-header-line-height)] [font-style:var(--sub-header-font-style)] px-4">
        Not ready to book yet?
        <br />
        Stay in the loop!
      </h2>

      <div className="flex w-full max-w-[800px] flex-col items-start gap-4 px-4">
        <div className="flex h-[60px] items-center justify-between p-5 w-full bg-white rounded-lg border border-solid">
          <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#aeaeae] text-lg md:text-2xl tracking-[0] leading-[normal] truncate">
            Enter your email address
          </span>
          <MailIcon className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] text-[#aeaeae] flex-shrink-0" />
        </div>
      </div>

      <Button className="bg-[#3289ff] hover:bg-[#2678e6] inline-flex items-center justify-center gap-2.5 px-6 py-3 md:p-4 h-auto rounded-lg w-auto">
        <span className="[font-family:'Roboto',Helvetica] font-semibold text-white text-lg md:text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
          Send request
        </span>
      </Button>
    </section>
  );
};
