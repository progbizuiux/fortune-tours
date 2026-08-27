import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { ImageIntroSection } from "@/components/common/ImageIntroSection";
import { CountryRegionsSection } from "@/components/destinations/CountryRegionsSection";
import { AtAGlanceSection } from "@/components/common/AtAGlanceSection";
import { FeatureRows } from "@/components/common/FeatureRows";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Container } from "@/components/common/Container";
import { RegionFeaturesSection } from "@/components/common/RegionFeaturesSection";
import { PlanMyTripSection } from "@/components/plan-my-trip/PlanMyTripSection";
import { FaqSection } from "@/components/common/FaqSection";
// Temporary static mockup until CMS integration
const MOCK_BOTSWANA_DATA = {
  hero: {
    eyebrow: "Destinations - Southern Africa",
    title: "Botswana, Africa's Quietest Safari Country",
    description: "More elephants than anywhere on earth, a delta in the middle of a desert, and camps that refuse to pack guests into tents.",
    image: "/destinations/kerala/wildlife.avif", // Using existing placeholder
    imageAlt: "Botswana Safari",
    overlayClassName: "bg-black/40",
  },
  intro: {
    eyebrow: "Discover Botswana",
    title: "Why Botswana and Not Kenya",
    description: "Botswana decided long ago to keep visitor numbers low, fewer permits, smaller camps, larger private areas. The result is a safari where a lion sighting belongs to you instead of ten vehicles at once. What Botswana lacks in numbers, it exceeds in your own. Camps will outdo your shared, and you move between them by small aircraft rather than by road. That part is crucial too.",
    image: "/destinations/africa.png",
    imageAlt: "Elephants in Botswana",
  },
  aboutUs: {
    eyebrow: "About Us",
    title: "What You Get When You Book Through Fortune",
    description: "Visa rules, health precautions, park permits and long distances between destinations all need careful handling. Our experience helps take that complexity away.",
    features: [
      {
        title: "Built for Long Routes",
        body: "Long routes are our domain. Having two decades of making travel smooth across places the world.",
      },
      {
        title: "One Point of Contact",
        body: "One Point of Contact, flights, money, charter planes; the paperwork in camp permits to the same times.",
      },
      {
        title: "Trips Matched To You",
        body: "Compromises enter the a honeymoon is not essentially composed tracking and we know exactly why.",
      },
      {
        title: "Across Kerala",
        body: "Two Offices Across Kerala, Kochi, Thiruvananthapuram. (Help, Connect, And Resonate)",
      }
    ]
  },
  planTrip: {
    eyebrow: "Next Step",
    title: "Send Us Your Dates",
    description: "Botswana’s camps are small—by design, so the good rooms in the good months go early. Tell us roughly when you want to travel and we will tell you what is still open.",
  },
  faq: {
    eyebrow: "Good To Know",
    title: "Questions with useful\nanswers",
    contactInfo: "Have More Questions?\nReach Out To Our Travel Team.\n+91 8156 911 888 · Hello@Fortunetours.in",
    faqs: [
      {
        question: "When is the best time to visit Botswana?",
        answer: "May to October, the dry season, is best for spotting animals, with July and August at the peak. November to April is greener and quieter, better for birds and newborn animals.",
      },
      {
        question: "How many days do I need in Botswana?",
        answer: "Generally, 7 to 10 days is ideal to explore two or three different areas, such as the Okavango Delta, Chobe, and the Makgadikgadi Pans without feeling rushed.",
      },
      {
        question: "How do I get to Botswana from India?",
        answer: "There are no direct flights. You typically fly into Johannesburg (South Africa) or Addis Ababa (Ethiopia) and take a connecting flight to Maun or Kasane in Botswana.",
      },
      {
        question: "Is Botswana good for families?",
        answer: "Yes, though it's best for older children (typically 8+ or 12+) as many camps have age restrictions and the focus is heavily on quiet wildlife observation.",
      },
      {
        question: "What does a Botswana safari cost?",
        answer: "Botswana is a premium safari destination focusing on low-impact, high-value tourism. Expect costs to be higher than East Africa, typically starting around $800-$1000 per person per night for all-inclusive camps.",
      },
      {
        question: "Can I add another country?",
        answer: "Absolutely. Victoria Falls (Zambia/Zimbabwe) is a very common add-on, just a short drive from Chobe. South Africa and Namibia also pair excellently with a Botswana itinerary.",
      },
    ]
  },
  glance: {
    eyebrow: "Good to know",
    title: "Botswana, at a glance.",
    description: "A destination shaped by waterways, wildlife and vast open landscapes. Get a quick sense of when to visit, how long to stay and what kind of journey Botswana is best suited for.",
    stats: [
      { label: "Best for", value: "Wildlife - Photography -\nLuxury Safari - Wilderness" },
      { label: "Ideal duration", value: "7-12 days" },
      { label: "Travel style", value: "Safari - Adventure - Luxury" },
      { label: "Landscape", value: "Wetlands - Savannah - Desert" },
      { label: "Best time", value: "Dry season - Wildlife viewing" },
      { label: "Perfect pairing", value: "Victoria Falls - Namibia -\nSouth Africa" },
    ],
  },
  groundHeading: {
    eyebrow: "On The Ground",
    title: "Water in the Morning, Land\nby Evening",
  },
  groundFeatures: [
    {
      key: "track-animals",
      eyebrow: "Boat, Vehicle, On Foot",
      title: "Three Ways to Track the Same Animals",
      description: "Botswana is one of the few countries where safari happens on water as much as on land. A network of waterways and trails allows game drives in an open vehicle just before the heat. After a sleep, a transition to a mokoro or a boat. Slower and quieter, close to the birds and smaller animals. A jeep drives straight past. Several camps run walking safaris with an armed ranger, where tracks in the sand tell you what walked through an hour earlier.",
      ctaLabel: "SEE HOW IT WORKS",
      ctaHref: "#",
      image: "/destinations/kerala/adventure-nature.avif",
      alt: "Tracking animals in water",
    },
    {
      key: "fly-camps",
      eyebrow: "Getting Around",
      title: "You Fly Between Camps, You Don't Drive",
      description: "There are no long road transfers. In contrast to Kenya, camps run entirely charter aircraft that seat a handful of passengers and cross the delta in fifteen to forty-five minutes. From that height the country finally makes sense. Water fanning out into dry land, herds moving in single file, islands that shift with the flood. Travelers book these flights as a necessary step and end up describing them at dinner.",
      image: "/destinations/kerala/wildlife.avif",
      alt: "Flying between camps",
    },
    {
      key: "tell-us",
      eyebrow: "Your Ways To Start",
      title: "Tell Us What You Want, or Leave It With Us",
      description: "Some travelers already have the shape in mind. Ten days, Delta first, a camp with a plunge pool, and Victoria Falls on the way out. Send it to us as is, and we will build it.\n\nOthers would rather hand it over. Give us your dates, the length of the trip, and who is coming. We will send back a plan worked out for you. Change what you like, or leave it alone. Either way, flights, camps, charter planes, park fees, and paperwork sit with us.",
      ctaLabel: "PLAN MY TRIP",
      ctaHref: "#",
      image: "/destinations/kerala/elephants-sri-lanka.jpg",
      alt: "Elephants in water",
    },
    {
      key: "seasons",
      eyebrow: "Before You Commit",
      title: "Seasons, Routes, and\nPaperwork",
      description: "May to October is best for game viewing, with July and August at their peak. November to April brings wild green landscapes, newborn animals, and flamingos. From India, routes typically connect through Johannesburg or Addis Ababa. A return in Victoria Falls or flights require a fit, weight-limited bags, while visa requirements are checked based on your passport and...",
      image: "/destinations/africa.png",
      alt: "Tiger in water",
    }
  ]
};

export default async function CountryPage({ params }) {
  // Await params here as per Next.js 15+ patterns
  const { slug, country } = await params;

  // Render the mockup for now
  const page = MOCK_BOTSWANA_DATA;

  return (
    <>
      <div>
        <PageHero {...page.hero} priority />
        
        <ImageIntroSection {...page.intro} className="relative z-10" />
    <CountryRegionsSection />
        <AtAGlanceSection {...page.glance} />

        <div className="bg-background relative z-10 pt-16 md:pt-24 lg:pt-[120px] pb-16 md:pb-24 lg:pb-[120px]">
          <Container>
            <SectionHeading 
              align="left"
              eyebrow={page.groundHeading.eyebrow}
              title={page.groundHeading.title}
              titleClassName="whitespace-pre-line max-w-[800px]"
            />
          </Container>
          <FeatureRows 
            items={page.groundFeatures}
            className="mt-12 md:mt-16 xl:mt-[60px]"
            stacked
          />
        </div>
        <RegionFeaturesSection {...page.aboutUs} />
        
        <PlanMyTripSection {...page.planTrip} className="!mt-0" />
        
        <FaqSection {...page.faq} />
        
      </div>
    </>
  );
}
