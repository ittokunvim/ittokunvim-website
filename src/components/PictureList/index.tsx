"use client";

import Image, { ImageLoaderProps } from "next/image";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { PictureData } from "@/lib/picture";
import { SearchData, SearchForm } from "./SearchForm";
import styles from "./styles.module.css";

type Props = {
  pictures: PictureData[];
  route: string;
};

const PICTURE_SITE_URL = process.env.NEXT_PUBLIC_PICTURESITE_URL || "";

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  const url = new URL(src, PICTURE_SITE_URL);
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
  const [selectedPicture, setSelectedPicture] = useState<PictureData | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const openPicture = (picture: PictureData) => {
    setSelectedPicture(picture);
    dialogRef.current?.showModal();
  };

  const closePicture = () => {
    dialogRef.current?.close();
  };

  const closeOnBackdropClick = (
    event: React.MouseEvent<HTMLDialogElement>
  ) => {
    if (event.target === event.currentTarget) {
      closePicture();
    }
  };

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
              <button
                type="button"
                onClick={() => openPicture(picture)}
                aria-label={`${picture.description}を拡大表示`}
              >
                <PictureImage path={picture.path} />
              </button>
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
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="picture-dialog-title"
        onClick={closeOnBackdropClick}
        onClose={() => setSelectedPicture(null)}
      >
        <div className={styles.dialog_content}>
          <h2
            className={styles.visually_hidden}
            aria-labelledby="picture-dialog-title"
          >画像の拡大表示</h2>
          <button
            type="button"
            className={styles.dialog_close}
            aria-label="画像を閉じる"
            onClick={() => closePicture()}
          >閉じる</button>
          {selectedPicture && (
            <Image
              loader={imageLoader}
              className={styles.dialog_image}
              src={selectedPicture.path}
              alt={selectedPicture.description}
              width={1200}
              height={1200}
            />
          )}
				  <p className={styles.dialog_caption}>{selectedPicture?.description}</p>
        </div>
      </dialog>
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
