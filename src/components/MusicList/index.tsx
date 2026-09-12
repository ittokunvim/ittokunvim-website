"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [volume, setVolume] = useState<number>(0);
  const [volumeOnce, setVolumeOnce] = useState<boolean>(false);

  // 音楽プレーヤーのセットアップ
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  // 再生ボタン押下時の初期化と再生と停止
  const handleClick = (path: string) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const isSameTrack = currentTrack === path && isPlaying;
    audio.src = path;
    audio.volume = 0;
    setVolume(0);
    setVolumeOnce(false);

    if (isSameTrack) {
      setCurrentTrack("");
      setIsPlaying(false);
      audio.pause();
      return;
    }

    setCurrentTrack(path);
    setIsPlaying(true);
    void audio.play();
  };

  // 音楽プレーヤーの状態に応じて表示するアイコンを変更
  const toggleIcon = (path: string) => {
    if (isPlaying && currentTrack === path) {
      return faPause;
    }

    return faPlay;
  };

  // 音楽プレーヤーの初めと終わりの音量を徐々に調節する
  useEffect(() => {
    const audio = audioRef.current;
    if (!isPlaying || !audio) {
      return;
    }

    const fadingDuration = 5.0;
    const tickMs = 100;
    const maxVolume = 1.0;

    const interval = setInterval(() => {
      // 音楽プレーヤーの再生が終わったら終了
      if (audio.paused || audio.ended) {
        clearInterval(interval);
        return;
      }

      const nowTime = audio.currentTime;
      const duration = audio.duration;

      // 音楽プレーヤーの初めの音量を徐々に上げる
      if (!volumeOnce) {
        const nextVolume = Math.min(maxVolume, (nowTime / fadingDuration) * maxVolume);

        if (nextVolume >= maxVolume) {
          audio.volume = maxVolume;
          setVolumeOnce(true);
        }

        setVolume(nextVolume);
        audio.volume = nextVolume;
      }

      // 音楽プレーヤーの終わりの音量を徐々に下げる
      const fadeOutStart = Math.max(0, duration - fadingDuration);
      if (nowTime > fadeOutStart) {
        const nextVolume = Math.max(0.0, ((duration - nowTime) / fadingDuration) * maxVolume);

        if (nextVolume <= 0.0) {
          audio.volume = 0.0;
          return;
        }

        setVolume(nextVolume);
        audio.volume = nextVolume;
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [isPlaying, volumeOnce, volume]);

  // 検索フォーム文字入力時に結果をHTMLで出力する
  const searchMusic = ({ title, artist, createdAt }: SearchData) => {
    if (title === "" && artist === "" && createdAt === "") {
      setMusicList(music);
      return;
    }

    const normalizedTitle = title.split(" ").join("*").toLowerCase();
    const normalizedArtist = artist.split(" ").join("*").toLowerCase();

    const titleRegex = new RegExp(normalizedTitle, "i");
    const artistRegex = new RegExp(normalizedArtist, "i");
    const createdAtRegex = new RegExp(createdAt, "i");

    const searchMusicList = music.filter((musicEntry) => {
      const isTitleTest = titleRegex.test(musicEntry.title);
      const isArtistTest = artistRegex.test(musicEntry.artist);
      const isCreatedAtTest = createdAtRegex.test(musicEntry.createdAt);
      return isTitleTest && isArtistTest && isCreatedAtTest;
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
        {musicList.map((musicEntry) => (
          <div className={styles.item} key={musicEntry.title}>
            <div className={styles.title} onClick={() => handleClick(musicEntry.path)}>
              <FontAwesomeIcon icon={toggleIcon(musicEntry.path)} />
              {musicEntry.title}
            </div>
            <div className={styles.artist}>{musicEntry.artist}</div>
            <div className={styles.createdAt}>{musicEntry.createdAt}に作成</div>
            <details className={styles.references}>
              <summary>参考リンク</summary>
              {musicEntry.references.map((reference) => (
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
