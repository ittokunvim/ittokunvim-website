"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { MusicData } from "@/lib/music";
import { SearchData, SearchForm } from "./SearchForm";
import styles from "./styles.module.css";

type Props = {
  music: MusicData[];
  route: string;
};

export default function MusicList({ music, route }: Props) {
  const [musicList, setMusicList] = useState<MusicData[]>(music);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  // 音楽プレーヤーのセットアップ
  useEffect(() => {
    setAudio(new Audio());
  }, []);

  // 再生ボタン押下時の初期化と再生と停止
  const handleClick = (path: string) => {
    if (!audio) {
      return;
    }

    audio.src = path;
    audio.volume = 0;
    setVolume(0);

    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
    } else {
      setIsPlaying(false);
      audio.pause();
    }
  };

  // 音楽プレーヤーの状態に応じて表示するアイコンを変更
  const toggleIcon = (path: string) => {
    if (!audio) {
      return faPlay;
    }

    if (isPlaying && audio.src === encodeURI(path)) {
      return faPause;
    } else {
      return faPlay;
    }
  };

  // 音楽プレーヤーの初めと終わりの音量を徐々に調節する
  useEffect(() => {
    if (!isPlaying || !audio) {
      return;
    }

    const interval = setInterval(() => {
      if (!audio) return;
      setVolume(Math.min(1, volume + 0.02));
      audio.volume = volume;
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audio, volume]);

  // 検索フォーム文字入力時に結果をHTMLで出力する
  const searchMusic = ({ title, artist, createdAt }: SearchData) => {
    if (title === "" && artist === "" && createdAt === "") {
      setMusicList(music);
    }

    title = title.split(" ").join("*").toLowerCase();
    artist = artist.split(" ").join("*").toLowerCase();

    const titleRegex = new RegExp(title, "i");
    const artistRegex = new RegExp(artist, "i");
    const createdAtRegex = new RegExp(createdAt, "i");

    const searchMusicList = music.filter((music) => {
      const isTitleTest = titleRegex.test(music.title);
      const isArtistTest = artistRegex.test(music.artist);
      const isCreatedAtTest = createdAtRegex.test(music.createdAt);
      return (isTitleTest && isArtistTest && isCreatedAtTest);
    });

    setMusicList(searchMusicList);
  };

  return (
    <article className={styles.music}>
      <h3>
        <FontAwesomeIcon icon={faMusic} />
        ミュージック一覧
      </h3>
      {route === "/music" && (
        <SearchForm searchMusic={searchMusic} />
      )}
      <div className={styles.list}>
        {musicList.map((music) => (
          <div className={styles.item} key={music.title}>
            <div className={styles.title} onClick={() => handleClick(music.path)}>
              <FontAwesomeIcon icon={toggleIcon(music.path)} />
              {music.title}
            </div>
            <div className={styles.artist}>{music.artist}</div>
            <div className={styles.createdAt}>{music.createdAt}に作成</div>
            <details className={styles.references}>
              <summary>参考リンク</summary>
              {music.references.map((reference) => (
                <a
                  key={reference}
                  href={reference}
                  target="_blank"
                  rel="noopener noreferrer"
                >{reference}</a>
              ))}
            </details>
          </div>
        ))}
      </div>
      {route === "/" && (
        <div className={styles.link}>
          <Link href="/music">もっと見る</Link>
        </div>
      )}
    </article>
  );
}
