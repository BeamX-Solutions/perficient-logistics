import React from "react";
import { BookingFormSection } from "./sections/BookingFormSection";
import { CallToActionSection } from "./sections/CallToActionSection";
import { CustomerTestimonialsSection } from "./sections/CustomerTestimonialsSection";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { RatingSection } from "./sections/RatingSection";
import { ServiceOptionsSection } from "./sections/ServiceOptionsSection";
import { VehicleGallerySection } from "./sections/VehicleGallerySection";

export const Framee = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full max-w-[1440px] mx-auto items-center gap-8 md:gap-14 px-4 md:px-8 lg:px-[120px] py-6 md:py-10 bg-[#f3f3f3]">
      <HeroSection />

      <CallToActionSection />

      <ServiceOptionsSection />

      <BookingFormSection />

      <HeaderSection />

      <CustomerTestimonialsSection />

      <RatingSection />

      <VehicleGallerySection />
    </main>
  );
};
