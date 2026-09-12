import { formatDate } from "@/lib/utils";

// const GAMESITE_URL = process.env.GAMESITE_URL || "";
const GAMESITE_JSON_URL = process.env.GAMESITE_JSON_URL || "";

type JsonData = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type GameData = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

async function fetchGamesJson(): Promise<JsonData[]> {
  try {
    const response = await fetch(GAMESITE_JSON_URL, { cache: "force-cache" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getGameDataAll(): Promise<GameData[]> {
  const games = await fetchGamesJson();
  let gameDataList: GameData[] = [{
    slug: "",
    title: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  }];

  games.sort((a: JsonData, b: JsonData) => {
    if (a.updatedAt === b.updatedAt) {
      return a.createdAt < b.createdAt ? 1 : -1;
    } else {
      return a.updatedAt < b.updatedAt ? 1 : -1;
    }
  });
  gameDataList = games.map((game: JsonData) => {
    const slug = game.slug;
    const title = game.title;
    const description = game.description;
    const createdAt = formatDate(game.createdAt);
    const updatedAt = formatDate(game.updatedAt);

    return { slug, title, description, createdAt, updatedAt };
  });

  return gameDataList;
}

export async function getGameSlugAll(): Promise<string[]> {
  const games = await fetchGamesJson();
  return games.map((game: JsonData) => game.slug);
}

export async function getGameData(slug: string): Promise<GameData> {
  const games = await fetchGamesJson();
  const game = games.find((game: JsonData) => game.slug === slug);
  const gameData: GameData = {
    slug: "",
    title: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  };

  if (game === undefined) {
    return gameData;
  }

  gameData.slug = game.slug;
  gameData.title = game.title;
  gameData.description = game.description;
  gameData.createdAt = formatDate(game.createdAt);
  gameData.updatedAt = formatDate(game.updatedAt);

  return gameData;
}
