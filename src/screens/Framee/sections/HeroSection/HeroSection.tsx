import React from "react";
import { Button } from "../../../../components/ui/button";

const navigationItems = [
  { label: "About us" },
  { label: "Services" },
  { label: "Testimonials" },
];

export const HeroSection = (): JSX.Element => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full h-auto py-4">
      <img
        className="w-[180px] md:w-[245px] h-auto object-cover"
        alt="Logo"
        src="/logo--2--2.png"
      />

      <nav className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 md:flex-1 md:max-w-[713px] w-full md:w-auto">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[46px]">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className="[font-family:'Roboto',Helvetica] font-normal text-black text-base md:text-lg tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-70 transition-opacity"
            >
              {item.label}
            </button>
          ))}
        </div>

        <Button className="bg-[#3289ff] hover:bg-[#2678e6] text-white text-xl md:text-2xl font-semibold [font-family:'Roboto',Helvetica] px-4 py-3 md:py-4 rounded-lg h-auto w-full md:w-auto">
          Book a Ride
        </Button>
      </nav>
    </header>
  );
};
