import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const serviceOptions = [
  {
    icon: "/vaadin-airplane-1.svg",
    title: "Airport Shuttle\nTransfers",
    description: "A simple description\nof this service",
    hasOverlay: false,
    overlayIcon: null,
  },
  {
    icon: "/vaadin-airplane.svg",
    title: "Full-Day Personal Chauffeur",
    description: "A simple description\nof this service",
    hasOverlay: true,
    overlayIcon: "/vector.svg",
  },
  {
    icon: "/vaadin-airplane.svg",
    title: "VIP Event &\nSpecial Rides",
    description: "A simple description\nof this service",
    hasOverlay: true,
    overlayIcon: "/vector-1.svg",
  },
];

export const ServiceOptionsSection = (): JSX.Element => {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 relative w-full">
      {serviceOptions.map((service, index) => (
        <Card
          key={index}
          className="flex flex-col w-full md:w-[380px] items-center bg-white rounded-lg border-0 shadow-sm"
        >
          <CardContent className="flex flex-col items-center justify-between px-0 py-8 gap-6 w-full">
            {!service.hasOverlay ? (
              <img
                className="relative flex-[0_0_auto] w-16 h-16"
                alt="Service icon"
                src={service.icon}
              />
            ) : (
              <div className="flex flex-col w-[64.02px] h-[64.02px] items-center justify-center relative">
                <img
                  className="absolute top-0 left-0 w-16 h-16"
                  alt="Service icon"
                  src={service.icon}
                />
                {service.overlayIcon && (
                  <img
                    className="relative z-10"
                    alt="Overlay icon"
                    src={service.overlayIcon}
                  />
                )}
              </div>
            )}

            <h3 className="relative self-stretch font-sub-header font-[number:var(--sub-header-font-weight)] text-[#1d233a] text-[length:var(--sub-header-font-size)] text-center tracking-[var(--sub-header-letter-spacing)] leading-[var(--sub-header-line-height)] [font-style:var(--sub-header-font-style)] whitespace-pre-line">
              {service.title}
            </h3>

            <p className="relative w-fit font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] text-center tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)] whitespace-pre-line">
              {service.description}
            </p>

            <Button className="bg-[#3289ff] hover:bg-[#2678e6] inline-flex items-center justify-center gap-2.5 p-4 h-auto rounded-lg">
              <span className="relative w-fit mt-[-1.00px] [font-family:'Roboto',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                Select This Ride
              </span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
