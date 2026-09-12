import { formatYear } from "@/lib/utils";

const MUSIC_SITE_URL = process.env.MUSICSITE_URL || "";
const MUSIC_SITE_JSON_URL = process.env.MUSICSITE_JSON_URL || "";

type MusicJsonData = {
  path: string;
  title: string;
  artist: string;
  references: string[];
  createdAt: string;
};

export type MusicData = {
  title: string;
  artist: string;
  path: string;
  references: string[];
  createdAt: string;
};

function hasMusicJsonUrl(): boolean {
  return MUSIC_SITE_JSON_URL.trim().length > 0;
}

async function fetchMusicJson(): Promise<MusicJsonData[]> {
  if (!hasMusicJsonUrl()) {
    // 静的ビルド時などに URL が未設定でも Invalid URL を発生させない
    return [];
  }

  try {
    const response = await fetch(MUSIC_SITE_JSON_URL, { cache: "force-cache" });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllMusic(): Promise<MusicData[]> {
  const musicList = await fetchMusicJson();
  let musicDataList: MusicData[] = [{
    title: "",
    artist: "",
    path: "",
    references: [],
    createdAt: "",
  }];

  musicDataList = musicList.map((music: MusicJsonData) => {
    const title = music.title;
    const artist = music.artist;
    const path = new URL(music.path, MUSIC_SITE_URL).toString();
    const references = music.references;
    const createdAt = formatYear(music.createdAt);

    return { title, artist, path, references, createdAt, };
  });

  return musicDataList;
}
