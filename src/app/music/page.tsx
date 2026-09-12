import { Metadata } from "next";

import { MetadataProps, setMetadata } from "@/lib/utils";
import { MusicData, getAllMusic } from "@/lib/music";
import MusicList from "@/components/MusicList";
import { JsonLd, JsonLdScript } from "@/components/JsonLdScript";

import styles from "./page.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const [title, name] = ["ミュージック一覧", "ミュージック一覧"];
const description = "音楽の一覧を表示するページ";
const route = "/music";
const url = BASE_URL + route;
const metadataProps: MetadataProps = {
  title,
  description,
  url,
};

export const metadata: Metadata = setMetadata(metadataProps);

export default async function Page() {
  const music: MusicData[] = await getAllMusic();
  const jsonLd: JsonLd = {
    name,
    description,
  };

  return (
    <main className={styles.main}>
      <MusicList music={music} route={route} />
      <JsonLdScript data={jsonLd} />
    </main>
  );
}
