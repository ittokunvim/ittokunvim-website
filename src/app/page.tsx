import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faAddressCard } from "@fortawesome/free-solid-svg-icons";

import { getNewsListAll, NewsData } from "@/lib/news";
import { DocData, getAllDocs } from "@/lib/docs";
import { GameData, getAllGames } from "@/lib/games";
import { MusicData, getAllMusic } from "@/lib/music";
import { PictureData, getAllPictures } from "@/lib/picture";
import { ToolData, getToolDataAll } from "@/lib/tools";

import NewsList from "@/components/NewsList";
import DocList from "@/components/DocList";
import GameList from "@/components/GameList";
import MusicList from "@/components/MusicList";
import PictureList from "@/components/PictureList";
import ToolList from "@/components/ToolList";
import { JsonLd, JsonLdScript } from "@/components/JsonLdScript";

import iconPng from "./icon.png";
import styles from "./page.module.css";

const SITENAME = process.env.NEXT_PUBLIC_SITENAME || "";
const DESCRIPTION = process.env.NEXT_PUBLIC_DESCRIPTION || "";

export default async function Home() {
  const news: NewsData[] = getNewsListAll();
  const docs: DocData[] = await getAllDocs();
  const games: GameData[] = await getAllGames();
  const music: MusicData[] = await getAllMusic();
  const pictures: PictureData[] = await getAllPictures();
  const tools: ToolData[] = getToolDataAll();
  const jsonLd: JsonLd = {
    name: SITENAME,
    description: DESCRIPTION,
  };

  return (
    <main className={styles.main}>
      <article className={styles.about}>
        <h3>
          <FontAwesomeIcon icon={faInfoCircle} />
          このサイトについて
        </h3>
        <p>
          {DESCRIPTION}
        </p>
        <br />
        <p>ゆっくりしていってね😄</p>
      </article>
      <hr />
      <article className={styles.myprofile}>
        <h3>
          <FontAwesomeIcon icon={faAddressCard} />
          自己紹介
        </h3>
        <div className={styles.profile}>
          <Image src={iconPng} alt="My icon" priority />
          <div className={styles.text}>
            <p>
              ittokunvimです。
              ゲーム開発をしたりTech系の記事を書いたりしています。
            </p>
            <br />
            <p>
              最近はゲームエンジンBevyを使ったゲーム開発にハマってます。
            </p>
            <p>記事やゲームはこのサイトに公開しているのでよければ覗いていってね。</p>
            <br />
          </div>
        </div>
      </article>
      <NewsList newsList={news} />
      <DocList docs={docs} />
      <GameList games={games} />
      <MusicList music={music.reverse().slice(0, 10)} route="/" />
      <PictureList pictures={pictures.slice(0, 10)} route="/" />
      <ToolList tools={tools} />
      <JsonLdScript data={jsonLd} />
    </main>
  );
}
