import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

import "@/config/hljs.css";
import "@/config/rlc.css";
import { MetadataProps, setMetadata } from "@/lib/utils";
import { DocContentData, getDocSlugAll, getDocData } from "@/lib/docs";
import { JsonLd, JsonLdScript } from "@/components/JsonLdScript";
import styles from "./page.module.css";

export const dynamic = "auto";
export const dynamicParams = false;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc: DocContentData = await getDocData(slug);
  const { title, description } = doc;
  const url = `${BASE_URL}/docs/${slug}`;
  const metadataProps: MetadataProps = {
    title,
    description,
    url,
  };

  return setMetadata(metadataProps);
}

export async function generateStaticParams() {
  const docSlugs = await getDocSlugAll();
  const slugs = docSlugs.length > 0 ? docSlugs : ["sample"];

  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const doc: DocContentData = await getDocData(slug);
  const { title, description, createdAt, updatedAt, contentHtml } = doc;
  const jsonLd: JsonLd = {
    name: title,
    description,
  };

  if (title === "") {
    return notFound();
  }

  return (
    <main className={styles.main}>
      <article className={styles.docs}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>
          <FontAwesomeIcon icon={faClock} />
          {`${createdAt}に作成 ${updatedAt}に更新`}
        </div>
        <div className={styles.content_html} dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
      <JsonLdScript data={jsonLd} />
    </main>
  );
}
