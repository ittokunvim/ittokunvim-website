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
function hasDataSourceUrl(): boolean {
  return PICTURESITE_JSON_URL.trim().length > 0;
}

async function fetchPicturesJson(): Promise<JsonData[]> {
  if (!hasDataSourceUrl()) {
    // 静的ビルド時などに URL が未設定でも Invalid URL を発生させない
    return [];
  }

  try {
    const response = await fetch(PICTURESITE_JSON_URL, { cache: "force-cache" });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
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
export function getMonthRange(minMonth: string, maxMonth: string): string[] {
  const months: string[] = [];

  // "YYYY-MM" 形式の文字列をパースする
  const parseYearMonth = (str: string): { year: number; month: number } => {
    const match = str.match(/(\d+)-(\d+)/);
    // 無効な形式の場合はエラーをスロー
    if (!match) throw new Error(`Invalid month format: ${str}`);
    return {
      year: Number.parseInt(match[1], 10),
      month: Number.parseInt(match[2], 10),
    };
  };

  const minDate = parseYearMonth(minMonth);
  const maxDate = parseYearMonth(maxMonth);

  // 開始年月から終了年月までループ
  const current = new Date(minDate.year, minDate.month - 1, 1);
  const max = new Date(maxDate.year, maxDate.month, 1);

  let cursor = new Date(current);

  while (cursor < max) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    // "YYYY年M月" 形式で配列に追加
    months.push(`${year}年${month}月`);
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return months;
}
