import { Metadata } from "next";

import { MetadataProps, setMetadata } from "@/lib/utils";
import { PictureData, getAllPictures } from "@/lib/picture";
import PictureList from "@/components/PictureList";
import { JsonLd, JsonLdScript } from "@/components/JsonLdScript";

import styles from "./page.module.css";

// ページ設定
const PAGE_CONFIG = {
  title: "写真リスト",
  description: "写真の一覧を表示するページ",
  route: "/pictures",
} as const;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const url = BASE_URL + PAGE_CONFIG.route;

// メタデータの設定
const metadataProps: MetadataProps = {
  title: PAGE_CONFIG.title,
  description: PAGE_CONFIG.description,
  url,
};

export const metadata: Metadata = setMetadata(metadataProps);

export default async function Page() {
  // 写真データを取得
  const pictures: PictureData[] = await getAllPictures();

  // JSON-LD スキーマデータ
  const jsonLd: JsonLd = {
    name: PAGE_CONFIG.title,
    description: PAGE_CONFIG.description,
  };

  return (
    <main className={styles.main}>
      <PictureList pictures={pictures} route={PAGE_CONFIG.route} />
      <JsonLdScript data={jsonLd} />
    </main>
  );
}
