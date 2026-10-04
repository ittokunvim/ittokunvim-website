import { Metadata } from "next";
import { getToolData } from "@/lib/tools";
import { MetadataProps, setMetadata } from "@/lib/utils";
import { JsonLd, JsonLdScript } from "@/components/JsonLdScript";
import Discup2Reelseigyo from "@/components/Discup2Reelseigyo";
import styles from "./page.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const slug = "discup2-reelseigyo";
const tool = getToolData(slug);
const title = tool.name;
const description = tool.description;
const route = "/tools/" + slug;
const url = BASE_URL + route;
const metadataProps: MetadataProps = {
  title,
  description,
  url,
};

export const metadata: Metadata = setMetadata(metadataProps);

export default async function Page() {
  const jsonLd: JsonLd = {
    name: title,
    description,
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h2>{title}</h2>
      </div>
      <Discup2Reelseigyo />
      <JsonLdScript data={jsonLd} />
    </main>
  );
}
