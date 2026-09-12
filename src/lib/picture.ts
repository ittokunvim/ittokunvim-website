import { formatDate } from "./utils";

const PICTURESITE_JSON_URL = process.env.PICTURESITE_JSON_URL || "";

// 外部の写真サイトから取得するJSONデータの型定義
type JsonData = {
  path: string;
  description: string;
  createdAt: string;
};

// アプリケーション内で使用する写真データの型定義
export type PictureData = {
  path: string;
  description: string;
  createdAt: string;
};

/**
 * 写真サイトのJSONを取得する
 *
 * @returns 写真データの配列。取得失敗時は空配列を返す
 */
async function fetchPicturesJson(): Promise<JsonData[]> {
  try {
    const response = await fetch(PICTURESITE_JSON_URL, { cache: "force-cache" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * すべての写真データを取得し、必要な変換を行う
 *
 * @returns 変換されたPictureData の配列
 */
export async function getPictureDataAll(): Promise<PictureData[]> {
  const pictureList = await fetchPicturesJson();

  // 配列が空の場合は空配列を返す
  if (!Array.isArray(pictureList) || pictureList.length === 0) {
    return [];
  }

  // JSONデータをアプリケーション内で使用する形式に変換
  return pictureList.map((picture: JsonData) => ({
    path: picture.path,
    description: picture.description,
    createdAt: formatDate(picture.createdAt),
  }));
}

/**
 * 指定した年月の範囲内のすべての年月を文字列の配列で返す
 *
 * @param min_month 開始年月 (形式: "YYYY-MM")
 * @param max_month 終了年月 (形式: "YYYY-MM")
 * @returns 年月文字列の配列 (形式: "YYYY年M月")
 *
 * @example
 * getMonthRange("2026-01", "2026-08")
 * // => ["2026年1月", "2026年2月", "2026年3月", ..., "2026年8月"]
 */
export function getMonthRange(min_month: string, max_month: string): string[] {
  const months: string[] = [];

  // "YYYY-MM" 形式の文字列をパースする
  const parseYearMonth = (str: string): { year: number; month: number } => {
    const match = str.match(/(\d+)-(\d+)/);
    // 無効な形式の場合はエラーをスロー
    if (!match) throw new Error(`Invalid month format: ${str}`);
    return {
      year: parseInt(match[1]),
      month: parseInt(match[2])
    };
  };

  const minDate = parseYearMonth(min_month);
  const maxDate = parseYearMonth(max_month);

  // 開始年月から終了年月までループ
  let current = new Date(minDate.year, minDate.month - 1, 1);
  const max = new Date(maxDate.year, maxDate.month, 1);

  while (current < max) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    // "YYYY年M月" 形式で配列に追加
    months.push(`${year}年${month}月`);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}
