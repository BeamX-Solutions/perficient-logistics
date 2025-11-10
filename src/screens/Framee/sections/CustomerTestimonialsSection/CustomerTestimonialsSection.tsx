import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Textarea } from "../../../../components/ui/textarea";

const serviceTypes = [
  { id: "airport", label: "Airport Shuttle Transfers", active: true },
  { id: "chauffeur", label: "Full-Day Personal Chauffeur", active: false },
  { id: "vip", label: "VIP Event & Special Rides", active: false },
];

const pickupFields = [
  {
    label: "Pick-up Location",
    placeholder: "Select Pick-up Location",
    icon: "/weui-location-filled.svg",
    type: "location",
  },
  {
    label: "Pick-up date",
    placeholder: "Select Date",
    icon: "/lets-icons-date-range-fill.svg",
    type: "date",
  },
  {
    label: "Pick-up time",
    placeholder: "Select Time",
    icon: "/mingcute-time-fill.svg",
    type: "time",
  },
];

const dropoffFields = [
  {
    label: "Drop-off Location",
    placeholder: "Select Drop-off Location",
    icon: "/weui-location-filled.svg",
    type: "location",
  },
  {
    label: "Drop-off date",
    placeholder: "Select Date",
    icon: "/lets-icons-date-range-fill.svg",
    type: "date",
  },
  {
    label: "Drop-off time",
    placeholder: "Select Time",
    icon: "/mingcute-time-fill.svg",
    type: "time",
  },
];

export const CustomerTestimonialsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-center gap-6 md:gap-[45px] p-6 md:p-10 bg-white rounded-lg border border-solid border-black">
      <h2 className="self-stretch font-sub-header font-[number:var(--sub-header-font-weight)] text-[#1d233a] text-[24px] md:text-[length:var(--sub-header-font-size)] text-center tracking-[var(--sub-header-letter-spacing)] leading-[var(--sub-header-line-height)] [font-style:var(--sub-header-font-style)]">
        Book Your Ride Now
      </h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 p-4 bg-[#e5f0ff] rounded-xl w-full sm:w-auto">
        {serviceTypes.map((service) => (
          <Button
            key={service.id}
            variant="ghost"
            className={`h-auto px-3 py-2 rounded-lg opacity-80 text-sm md:text-base ${
              service.active
                ? "bg-[#3289ff] text-white hover:bg-[#3289ff] hover:text-white"
                : "bg-[#e5f0ff] text-black hover:bg-[#e5f0ff] hover:text-black"
            }`}
          >
            <span className="font-paragraph font-[number:var(--paragraph-font-weight)] text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] text-center [font-style:var(--paragraph-font-style)]">
              {service.label}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-start gap-6 md:gap-[26px] w-full">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full gap-4">
          {pickupFields.map((field, index) => (
            <div key={index} className="flex flex-col items-start gap-4 w-full md:flex-1">
              <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
                {field.label}
              </Label>
              <div className="flex items-center justify-between h-[60px] w-full px-5 py-5 bg-white rounded-lg border border-solid border-black">
                <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#dddddd] text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                  {field.placeholder}
                </span>
                <img
                  className="w-[25px] h-[25px]"
                  alt={field.type}
                  src={field.icon}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full gap-4">
          {dropoffFields.map((field, index) => (
            <div key={index} className="flex flex-col items-start gap-4 w-full md:flex-1">
              <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
                {field.label}
              </Label>
              <div className="flex items-center justify-between h-[60px] w-full px-5 py-5 bg-white rounded-lg border border-solid border-black">
                <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#dddddd] text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                  {field.placeholder}
                </span>
                <img
                  className="w-[25px] h-[25px]"
                  alt={field.type}
                  src={field.icon}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between w-full gap-4">
          <div className="flex flex-col items-start gap-4 w-full md:w-auto">
            <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
              No. of Passenger
            </Label>
            <div className="flex items-center justify-between h-[60px] px-5 py-5 bg-white rounded-lg border border-solid border-black gap-10 w-full md:w-auto">
              <span className="[font-family:'Roboto',Helvetica] font-semibold text-[#dddddd] text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                1
              </span>
              <img
                className="w-[25px] h-[25px]"
                alt="dropdown"
                src="/icon-park-solid-down-one.svg"
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:gap-7 w-full md:flex-1">
            <div className="flex flex-col items-start gap-4">
              <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
                Ride type
              </Label>
            </div>

            <RadioGroup
              defaultValue="round-trip"
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-11 w-full"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem
                  value="one-way"
                  id="one-way"
                  className="w-[30px] h-[30px]"
                />
                <Label
                  htmlFor="one-way"
                  className="font-paragraph font-[number:var(--paragraph-font-weight)] text-[#070707] text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] whitespace-nowrap [font-style:var(--paragraph-font-style)] cursor-pointer"
                >
                  One way trip
                </Label>
              </div>

              <div className="flex items-center gap-1.5">
                <RadioGroupItem
                  value="round-trip"
                  id="round-trip"
                  className="w-[30px] h-[30px]"
                />
                <Label
                  htmlFor="round-trip"
                  className="font-paragraph font-[number:var(--paragraph-font-weight)] text-[#070707] text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] whitespace-nowrap [font-style:var(--paragraph-font-style)] cursor-pointer"
                >
                  Round trip
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full gap-4">
          <div className="flex flex-col items-start gap-4 w-full md:flex-[1.7]">
            <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
              Full Name
            </Label>
            <Input className="h-[60px] w-full px-5 py-5 bg-white rounded-lg border border-solid border-black" />
          </div>

          <div className="flex flex-col items-start gap-4 w-full md:flex-1">
            <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
              Phone Number
            </Label>
            <Input className="h-[60px] w-full px-5 py-5 bg-white rounded-lg border border-solid border-black" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 w-full">
          <Label className="font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
            Special Request
          </Label>
          <Textarea className="h-[60px] w-full px-5 py-5 bg-white rounded-lg border border-solid border-black resize-none" />
        </div>
      </div>

      <Button className="h-auto bg-[#3289ff] hover:bg-[#3289ff]/90 px-4 py-4 rounded-lg">
        <span className="[font-family:'Roboto',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
          Book Now
        </span>
      </Button>
    </section>
  );
};
