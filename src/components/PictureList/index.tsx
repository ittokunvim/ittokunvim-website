"use client";

import Image, { ImageLoaderProps } from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { PictureData } from "@/lib/picture";
import { SearchData, SearchForm } from "./SearchForm";
import styles from "./styles.module.css";

type Props = {
  pictures: PictureData[];
  route: string;
};

const PICTURESITE_URL = process.env.NEXT_PUBLIC_PICTURESITE_URL || "";

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  const url = new URL(src, PICTURESITE_URL);
  url.searchParams.set("format", "auto");
  url.searchParams.set("width", width.toString());
  url.searchParams.set("quality", (quality || 75).toString());
  return url.href;
};

/**
 * 写真一覧コンポーネント
 * 検索機能付きで写真を表示する
 */
export default function PictureList({ pictures, route }: Props) {
  const [pictureList, setPictureList] = useState<PictureData[]>(pictures);

  // 検索条件に基づいて写真リストをフィルタリングする
  const searchPictures = useCallback(
    (searchData: SearchData) => {
      const { description, createdAt } = searchData;

      // 両方の検索条件が空の場合は全て表示
      if (description === "" && createdAt === "") {
        setPictureList(pictures);
        return;
      }

      // 検索条件に基づいてフィルタリング
      const descriptionRegex = new RegExp(description, "i");
      const createdAtRegex = new RegExp(createdAt, "i");

      const filteredList = pictures.filter((picture) => {
        const isDescriptionMatch =
          description === "" || descriptionRegex.test(picture.description);
        const isCreatedAtMatch =
          createdAt === "" || createdAtRegex.test(picture.createdAt);

        return isDescriptionMatch && isCreatedAtMatch;
      });

      setPictureList(filteredList);
    },
    [pictures]
  );

  return (
    <article className={styles.pictures}>
      <h3>
        <FontAwesomeIcon icon={faImage} />
        写真リスト
      </h3>
      {route === "/pictures" && <SearchForm searchPicture={searchPictures} />}
      <div className={styles.list}>
        {pictureList.map((picture) => (
          <div className={styles.item} key={picture.path}>
            <div className={styles.image}>
              <PictureImage path={picture.path} />
            </div>
            <table>
              <tbody>
                <tr>
                  <th>説明</th>
                  <td>{picture.description}</td>
                </tr>
                <tr>
                  <th>作成日時</th>
                  <td>{picture.createdAt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      {route === "/" && (
        <div className={styles.link}>
          <Link href="/pictures">もっと見る</Link>
        </div>
      )}
    </article>
  );
}

/**
 * 写真を表示するコンポーネント
 */
function PictureImage({ path }: { path: string }) {
  return (
    <Image
      loader={imageLoader}
      src={path}
      alt="ittokunvim picture"
      width={200}
      height={200}
    />
  );
}
