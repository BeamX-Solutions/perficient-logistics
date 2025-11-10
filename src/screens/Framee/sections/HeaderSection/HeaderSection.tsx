import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const testimonials = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor",
    name: "Name Surname",
    image: "/ellipse-3.png",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor",
    name: "Name Surname",
    image: "/ellipse-3-1.png",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor",
    name: "Name Surname",
    image: "/ellipse-3-2.png",
  },
];

export const HeaderSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center justify-center gap-8 md:gap-16 p-6 md:p-10 w-full bg-white rounded-lg">
      <h2 className="w-full font-sub-header font-[number:var(--sub-header-font-weight)] text-[#1d233a] text-[24px] md:text-[length:var(--sub-header-font-size)] text-center tracking-[var(--sub-header-letter-spacing)] leading-[var(--sub-header-line-height)] [font-style:var(--sub-header-font-style)]">
        What our customers say
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col w-full md:w-[350px] items-center gap-2.5 relative rounded-lg"
          >
            <Card className="w-full border-[#3289ff] rounded-lg">
              <CardContent className="flex h-[131px] items-center justify-center p-3">
                <p className="w-full font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] text-center tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
                  {testimonial.text}
                </p>
              </CardContent>
            </Card>

            <div className="inline-flex items-center justify-center gap-2.5 px-3 py-0 rounded-lg">
              <p className="w-fit font-menu-item font-[number:var(--menu-item-font-weight)] text-[#1d233a] text-[length:var(--menu-item-font-size)] text-center tracking-[var(--menu-item-letter-spacing)] leading-[var(--menu-item-line-height)] whitespace-nowrap [font-style:var(--menu-item-font-style)]">
                {testimonial.name}
              </p>
            </div>

            <img className="flex-[0_0_auto]" alt="Stars" src="/stars.svg" />

            <img
              className="absolute top-[-34px] left-[140px] w-[41px] h-[41px]"
              alt="Profile"
              src={testimonial.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
