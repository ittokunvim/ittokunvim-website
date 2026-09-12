"use client";

import Image, { ImageLoaderProps } from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faClock } from "@fortawesome/free-solid-svg-icons";
import { GameData } from "@/lib/games";
import styles from "./styles.module.css";

const GAMESITE_URL = process.env.NEXT_PUBLIC_GAMESITE_URL || "";

const imageLoader = ({ src, width, quality, }: ImageLoaderProps): string => {
  const url = new URL(src, GAMESITE_URL);
  url.searchParams.set("format", "auto");
  url.searchParams.set("width", width.toString());
  url.searchParams.set("quality", (quality || 75).toString());
  return url.href;
};

export default function GameList(props: { games: GameData[] }) {
  const games: GameData[] = props.games;

  return (
    <article className={styles.games}>
      <h3>
        <FontAwesomeIcon icon={faGamepad} />
        ゲーム一覧
      </h3>
      <div className={styles.list}>
        {games.map((game, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.thumbnail}>
              <ThumbnailImage slug={game.slug} />
            </div>
            <div className={styles.title}>
              <Link href={`/games/${game.slug}`}>{game.title}</Link>
            </div>
            <div className={styles.description}>{game.description}</div>
            <div className={styles.date}>
              <p>
                <FontAwesomeIcon icon={faClock} />
                {`${game.createdAt}に作成`}
              </p>
              <p>
                <FontAwesomeIcon icon={faClock} />
                {`${game.updatedAt}に更新`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ThumbnailImage(props: { slug: string }) {
  const slug = props.slug;
  const { src, alt, width, height, } = {
    src: `images/${slug}.png`,
    alt: `${slug} thumbnail`,
    width: 300,
    height: 240,
  };
  return <Image
    loader={imageLoader}
    src={src}
    alt={alt}
    width={width}
    height={height}
  />;
}
