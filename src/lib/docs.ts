import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import codeTitle from "remark-code-title";
import remarkLinkCard from "remark-link-card";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";
import { formatDate } from "@/lib/utils";

const DOCS_SITE_URL = process.env.DOCSSITE_URL || "";
const DOCS_SITE_JSON_URL = process.env.DOCSSITE_JSON_URL || "";

type DocJsonData = {
  slug: string;
  title: string;
  description: string,
  path: string;
  published: boolean,
  createdAt: string;
  updatedAt: string;
};

export type DocData = {
  href: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type DocContentData = {
  title: string;
  description: string;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
};

function hasDocsJsonUrl(): boolean {
  return DOCS_SITE_JSON_URL.trim().length > 0;
}

// 外部の記事サイトのJSONデータを取得して解析する
async function fetchDocsJson(): Promise<DocJsonData[]> {
  if (!hasDocsJsonUrl()) {
    return [];
  }

  try {
    // JSONデータを取得
    const response = await fetch(DOCS_SITE_JSON_URL, { cache: "force-cache" });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    // データを解析し、公開データのみを返す
    const data: DocJsonData[] = await response.json();
    return data.filter((item) => item.published);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 全てのドキュメントデータを取得・整形する
export async function getAllDocs(): Promise<DocData[]> {
  try {
    // JSONデータを取得
    const docs = await fetchDocsJson();

    // データが取得できない場合、空の配列を返す
    if (!docs || docs.length === 0) {
      return [];
    }

    // 記事を更新日時を基準にソート（同じ更新日時の場合は作成日時を基準にソート）
    const sortedDocs = docs.sort(compareDocsByDate);

    // データを整形して`DocData`配列を作成
    return sortedDocs.map(formatDocData);
  } catch(error) {
    console.error("Error fetching and processing document data:", error);
    return [];
  }
}

// 全ての記事の`slug`の配列を取得
export async function getDocSlugAll(): Promise<string[]> {
  try {
    // Jsonデータを取得
    const docs = await fetchDocsJson();

    // `slug`の配列を返す
    return docs.map((doc: DocJsonData) => doc.slug);
  } catch(error) {
    console.error("Error fetching document slugs:", error);
    return [];
  }
}

// 記事データをソートするための比較関数
function compareDocsByDate(a: DocJsonData, b: DocJsonData): number {
  if (a.updatedAt === b.updatedAt) {
    return a.createdAt < b.createdAt ? 1 : -1;
  }
  return a.updatedAt < b.updatedAt ? 1 : -1;
}

// DocJsonDataをDocDataに整形する
function formatDocData(doc: DocJsonData): DocData {
  return {
    href: `/docs/${doc.slug}`,
    title: doc.title,
    description: doc.description,
    createdAt: formatDate(doc.createdAt),
    updatedAt: formatDate(doc.updatedAt),
  };
}

// 指定した`slug`に対応する記事を取得
export async function getDocData(slug: string): Promise<DocContentData> {
  try {
    // Jsonデータを取得
    const docs = await fetchDocsJson();

    // 指定した`slug`に対応する記事を検索
    const doc = docs.find((doc: DocJsonData) => doc.slug === slug);

    // 該当する記事が見つからない場合はデフォルト値を返す
    if (!doc) {
      return getDefaultDocContentData();
    }

    // 記事データを整形して返却
    return await formatDocContentData(doc);
  } catch(error) {
    console.error(`Error fetching document data for slug: ${slug}`, error);
    return getDefaultDocContentData();
  }
}

// デフォルトの記事データを返す
function getDefaultDocContentData(): DocContentData {
  return {
    title: "",
    description: "",
    contentHtml: "",
    createdAt: "",
    updatedAt: "",
  };
}

// 記事データを整形する
async function formatDocContentData(doc: DocJsonData): Promise<DocContentData> {
  const contentHtml = await getDocContentHtml(doc.path);

  // HTMLコンテンツが空の場合はデフォルト値を返す
  if (!contentHtml) {
    return getDefaultDocContentData();
  }

  return {
    title: doc.title,
    description: doc.description,
    contentHtml,
    createdAt: formatDate(doc.createdAt),
    updatedAt: formatDate(doc.updatedAt),
  };
}

// 指定された`path`の記事のHTMLコンテンツを取得し整形する
async function getDocContentHtml(path: string): Promise<string> {
  try {
    // 指定されたパスを使用して絶対URLを生成
    const absoluteUrl = new URL(path, DOCS_SITE_URL);

    // コンテンツを取得
    const rawContent = await fetchContent(absoluteUrl.href);

    // コンテンツを変換
    const processedContent = processContent(path, rawContent);

    // MarkdownをHTMLに変換
    const remarkContent = await convertMarkdownToHtml(processedContent);

    // HTMLに加工を施す
    const contentHtml = await enhanceHtml(remarkContent);

    return contentHtml;
  } catch(error) {
    console.error("Error processing document content:", error);
    return "";
  }
}

// fetchをラップした関数でコンテンツを取得
async function fetchContent(url: string): Promise<string> {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Failed to fetch content from ${url}: ${response.status}`);
  }
  return response.text();
}

// コンテンツを加工
function processContent(path: string, content: string): string {
  const contentWithAbsoluteUrls = replaceRelativeUrlToAbsoluteUrl(path, content);
  return replaceCodeBlockTitle(contentWithAbsoluteUrls);
}

// MarkdownをHTMLに変換する関数
async function convertMarkdownToHtml(content: string): Promise<string> {
  return remark()
    .use(remarkGfm)
    .use(codeTitle)
    .use(remarkLinkCard)
    .use(remarkHtml, { sanitize: false })
    .process(content)
    .then((file) => file.toString());
}

// HTMLをさらに加工
async function enhanceHtml(content: string): Promise<string> {
  return rehype()
    .use(rehypeHighlight)
    .process(content)
    .then((file) => file.toString());
}

// 相対URLを絶対URLに変換する関数
function replaceRelativeUrlToAbsoluteUrl(path: string, content: string): string {
  const basePath = new URL(path, DOCS_SITE_URL).href.replace(/[^/]+$/, "");

  // 相対画像リンクを絶対URLに変換
  const relativeImageRegex = /!?\[[^\]]+\]\((?!https|ftp:\/\/)[^\)]+\)/g;
  content = content.replace(relativeImageRegex, (match) => {
    const url = match.match(/\]\(([^)]+)\)/)?.[1];
    return url ? match.replace(url, `${basePath}${url}`) : match;
  });

  // <img>タグの相対src属性を絶対URLに変換
  const relativeImageTagRegex = /<img src="(?!https|ftp:\/\/)[^"]+"/g;
  content = content.replace(relativeImageTagRegex, (match) => {
    const src = match.match(/src="([^"]+)"/)?.[1];
    return src ? match.replace(src, `${basePath}${src}`) : match;
  });

  return content;
}

// コードブロックにタイトル属性を追加する関数
function replaceCodeBlockTitle(content: string): string {
  const codeBlockTitleRegex = /```[a-zA-Z]+:[\w\.]+/g;
  return content.replace(codeBlockTitleRegex, (_, lang, filename) => {
    return `\`\`\`${lang} title="${filename}"`;
  });
}
