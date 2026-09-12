import { formatYear } from "@/lib/utils";

const MUSICSITE_URL = process.env.MUSICSITE_URL || "";
const MUSICSITE_JSON_URL = process.env.MUSICSITE_JSON_URL || "";

type JsonData = {
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

function hasDataSourceUrl(): boolean {
  return MUSICSITE_JSON_URL.trim().length > 0;
}

async function fetchMusicJson(): Promise<JsonData[]> {
  if (!hasDataSourceUrl()) {
    // 静的ビルド時などに URL が未設定でも Invalid URL を発生させない
    return [];
  }

  try {
    const response = await fetch(MUSICSITE_JSON_URL, { cache: "force-cache" });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMusicDataAll(): Promise<MusicData[]> {
  const musicList = await fetchMusicJson();
  let musicDataList: MusicData[] = [{
    title: "",
    artist: "",
    path: "",
    references: [],
    createdAt: "",
  }];

  if (musicList === undefined) {
    return musicDataList;
  }

  musicDataList = musicList.map((music: JsonData) => {
    const title = music.title;
    const artist = music.artist;
    const path = new URL(music.path, MUSICSITE_URL).toString();
    const references = music.references;
    const createdAt = formatYear(music.createdAt);

    return { title, artist, path, references, createdAt, };
  });

  return musicDataList;
}
