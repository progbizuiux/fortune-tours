import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { getExperiences } from "@/lib/strapi/experiences";

/* ISR on the same terms as the rest of the app: cached until POST
   /api/revalidate fires on publish, with this window as the backstop. */
export const revalidate = 3600;

export const metadata = {
  title: "Experiences",
  description:
    "Explore our curated travel experiences designed for every journey.",
};

export default async function ExperiencesPage() {
  /* Hidden: there is no /experiences index in the design. The listing below
     is kept in code but never rendered; the route answers 404. Remove this
     line to bring the page back. */
  notFound();

  const experiences = await getExperiences();

  return (
    <Container className="py-20 md:py-32">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <SectionHeading
          eyebrow="Curated Journeys"
          title="Our Experiences"
          description="Discover thoughtfully designed travel experiences tailored to your style and dreams."
        />
      </div>

      {experiences?.length ? (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <Link
                href={`/experiences/${experience.slug}`}
                className="group block h-full"
              >
                <div className="relative mb-4 h-64 overflow-hidden rounded-lg md:h-72">
                  <Image
                    src={experience.image}
                    alt={experience.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* `name` is the label ("Adventure"); `title` is the editorial
                    headline ("Built for the Bold"), which the hero carries. */}
                <h2 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {experience.name}
                </h2>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {experience.shortDescription}
                </p>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  Explore →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-12 text-center text-lg text-gray-600">
          No experiences found.
        </p>
      )}
    </Container>
  );
}
