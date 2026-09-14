import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/journal/ArticleBody";
import { ArticleHero } from "@/components/journal/ArticleHero";
import { RelatedPosts } from "@/components/journal/RelatedPosts";
import { getArticle, getArticleSlugs } from "@/lib/journal";

/* One route for every journal article — /journal/<slug>, the destination the
   index's cards have been pointing at.

   Content comes from lib/journal.js rather than Strapi: there is no journal
   content type on the panel yet. The body is a list of typed blocks, which is
   the shape a CMS hands over, so that module stays the only seam.

   Server component throughout except the related row, which needs the browser
   for its scroller. */

/* ISR on the same terms as the rest of the app. Must be a literal: Next reads
   this statically at build time, so it cannot be DEFAULT_REVALIDATE from
   lib/strapi/client.js. */
export const revalidate = 3600;

export function generateStaticParams() {
  return getArticleSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) return {};

  /* Bare title on purpose — the root layout carries a
     `template: "%s | Fortune Travels"`, so adding the suffix here would print
     it twice. */
  return {
    title: article.title,
    description: article.standfirst,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.standfirst,
      publishedTime: article.date,
      images: article.image ? [{ url: article.image }] : undefined,
    },
  };
}

export default async function JournalArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  return (
    <>
      {/* The article opens on a cream masthead rather than a dark hero, so the
          navbar's white logo and white links would be invisible at rest. The
          marker starts the bar solid and asks for its links in black, the same
          pair app/journal/page.js uses — see the rule in app/globals.css. */}
      <div data-navbar-solid-from data-navbar-ink="black" aria-hidden="true" />

      <article>
        <ArticleHero
          kicker={article.kicker}
          readingTime={article.readingTime}
          title={article.title}
          standfirst={article.standfirst}
          dateLabel={article.dateLabel}
          date={article.date}
          author={article.author}
          image={article.image}
          imageAlt={article.imageAlt}
        />

        <ArticleBody blocks={article.body} />
      </article>

      <RelatedPosts articles={article.related} />
    </>
  );
}
