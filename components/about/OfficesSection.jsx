import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";

const OFFICES = [
  {
    role: "CORPORATE HEADQUARTERS",
    city: "Ernakulam",
    address: "Fortune House, MG Road, Ravipuram, Ernakulam, Kochi - 682016",
    phone: "+91 484 237 8850",
    timing: "MON - SAT: 09:00 - 18:30",
  },
  {
    role: "HERITAGE DESK",
    city: "Fort Kochi",
    address: "1/8, Jacob Road, Near St. Francis Church, Fort Kochi - 682001",
    phone: "+91 484 221 5400",
    timing: "MON - SAT: 09:30 - 18:00",
  },
  {
    role: "CENTRAL HUB",
    city: "Thrissur",
    address: "Kaus Towers, Round North, Near Swaraj Round, Thrissur - 680001",
    phone: "+91 487 233 4112",
    timing: "MON - SAT: 09:00 - 18:30",
  },
  {
    role: "SOUTH HUB",
    city: "Trivandrum",
    address: "Heritage Square, MG Road, Statue, Trivandrum - 695001",
    phone: "+91 471 247 1122",
    timing: "MON - SAT: 09:00 - 18:30",
  },
  {
    role: "NORTH HUB",
    city: "Kannur",
    address: "Fort Road, Near Central Station, Kannur - 670001",
    phone: "+91 497 270 6630",
    timing: "MON - SAT: 09:30 - 18:00",
  },
];

export function OfficesSection() {
  return (
    <section className="bg-[#12110C] py-20 md:py-24 xl:py-[130px] text-[#F9F7F2] overflow-hidden">
      <Container className="!px-8 md:!px-16 lg:!px-[120px] xl:!px-[180px] 2xl:!px-[240px]">
        <SectionHeading
          align="center"
          eyebrow="Branches"
          title="Five offices across Kerala."
          description="Walk in, or call the office nearest you. Someone will be there."
          eyebrowClassName="text-[#F9F7F2]/60"
          titleClassName="text-[#F9F7F2]"
          descriptionClassName="text-[#F9F7F2]/70"
        />

        <div className="mt-12 md:mt-16 lg:mt-[60px] border-t border-[#8C6A3F]/40 pt-12 md:pt-16 lg:pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 md:gap-y-16 lg:gap-y-0 lg:gap-x-4 xl:gap-x-5 2xl:gap-x-6">
            {OFFICES.map((office, i) => (
              <div
                key={office.city}
                className="flex flex-col items-center text-center relative z-10 pt-0 lg:pt-6 xl:pt-7 2xl:pt-[32px] pb-0 lg:pb-6 xl:pb-7 2xl:pb-[33px] lg:border-r lg:border-[#8C6A3F]/40 lg:last:border-r-0 lg:px-2 xl:px-3 2xl:px-4"
              >
                <div className="mb-2 lg:mb-3 xl:mb-4 2xl:mb-[16px] flex items-center">
                  {office.role ? (
                    <span className="font-top text-[10px] 2xl:text-[11px] 2xl:leading-[15px] tracking-[0.16em] uppercase text-[#FFD58E]">
                      {office.role}
                    </span>
                  ) : (
                    /* Maintain the 15px height so the grid rows align even without a role */
                    <span className="block h-[15px]" aria-hidden="true" />
                  )}
                </div>

                <h3 className="font-heading text-[22px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] 2xl:leading-[32px] text-[#F9F7F2] mb-3 lg:mb-3 xl:mb-4 2xl:mb-[16px]">
                  {office.city}
                </h3>

                <p className="font-sans text-[14px] md:text-[13px] lg:text-[11px] xl:text-[12px] 2xl:leading-[19.5px] text-[#F9F7F2]/70 mb-6 lg:mb-5 xl:mb-6 2xl:mb-[24px] max-w-[280px] lg:max-w-[250px]">
                  {office.address}
                </p>

                <div className="mt-auto">
                  <a
                    href={`tel:${office.phone.replace(/ /g, "")}`}
                    className="block font-heading text-[18px] md:text-[16px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px] 2xl:leading-[28px] text-[#F9F7F2] hover:text-[#FFD58E] transition-colors mb-1 2xl:mb-[4px]"
                  >
                    {office.phone}
                  </a>
                  <p className="font-sans text-[11px] md:text-[10px] lg:text-[9px] 2xl:text-[10px] 2xl:leading-[15px] tracking-[0.05em] text-[#F9F7F2]/40 uppercase">
                    {office.timing}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
