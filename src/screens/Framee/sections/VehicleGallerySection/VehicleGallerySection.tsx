import React from "react";

const contactInfo = [
  { type: "phone", value: "08052702261" },
  { type: "phone", value: "08106636311" },
  { type: "email", value: "perficientlogisticsltd@gmail.com" },
];

const footerLinks = ["Services overview", "Privacy Policy", "Terms"];

export const VehicleGallerySection = (): JSX.Element => {
  return (
    <footer className="flex flex-col md:flex-row items-start justify-between gap-8 p-6 md:p-10 w-full bg-white rounded-lg">
      <img
        className="w-[200px] md:w-[267px] h-auto object-cover"
        alt="Logo"
        src="/logo--2--2.png"
      />

      <div className="flex flex-col w-full md:w-[235px] items-start gap-6 md:gap-[45px]">
        <div className="self-stretch [font-family:'Roboto',Helvetica] font-normal text-black text-base tracking-[0] leading-4">
          {contactInfo.map((contact, index) => (
            <React.Fragment key={index}>
              {contact.type === "phone" && (
                <>
                  <span className="leading-[var(--paragraph-line-height)] underline font-paragraph [font-style:var(--paragraph-font-style)] font-[number:var(--paragraph-font-weight)] tracking-[var(--paragraph-letter-spacing)] text-[length:var(--paragraph-font-size)]">
                    {contact.value}
                  </span>
                  {index < contactInfo.length - 2 && (
                    <span className="leading-[var(--paragraph-line-height)] underline font-paragraph [font-style:var(--paragraph-font-style)] font-[number:var(--paragraph-font-weight)] tracking-[var(--paragraph-letter-spacing)] text-[length:var(--paragraph-font-size)]">
                      ,{" "}
                    </span>
                  )}
                </>
              )}
              {contact.type === "email" && (
                <>
                  <br />
                  <br />
                  <a
                    href={`mailto:${contact.value}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="leading-[var(--paragraph-line-height)] underline font-paragraph [font-style:var(--paragraph-font-style)] font-[number:var(--paragraph-font-weight)] tracking-[var(--paragraph-letter-spacing)] text-[length:var(--paragraph-font-size)]">
                      {contact.value}
                    </span>
                  </a>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <nav className="w-full md:w-[130px] font-paragraph font-[number:var(--paragraph-font-weight)] text-black text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)]">
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            {link}
            {index < footerLinks.length - 1 && (
              <>
                <br />
                <br />
              </>
            )}
          </React.Fragment>
        ))}
      </nav>
    </footer>
  );
};
