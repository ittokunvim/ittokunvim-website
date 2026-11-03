import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faItchIo } from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

import "@/config/fontawesome";
import {
  GoogleAdsCodeSnipet,
  GoogleAdsMetatag,
  GoogleAds,
} from "@/components/GoogleAds";

import "./globals.css";
import styles from "./layout.module.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const SITENAME = process.env.NEXT_PUBLIC_SITENAME || "";
const DESCRIPTION = process.env.NEXT_PUBLIC_DESCRIPTION || "";

export const metadata: Metadata = {
  title: {
    default: SITENAME,
    template: `%s | ${SITENAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    title: SITENAME,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: SITENAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITENAME,
    description: DESCRIPTION,
    site: "@ittokunvim",
    creator: "@ittokunvim",
  },
  verification: {
    google: "",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const githubUrl = "https://github.com/ittokunvim";
  const twitterUrl = "https://twitter.com/ittokunvim";
  const zennUrl = "https://zenn.dev/ittoku_ky73";
  const itchUrl = "https://ittokunvim.itch.io";

  const externals = [
    { name: "Source Code", url: "https://github.com/ittokunvim/ittokunvim-website/" },
    { name: "Next.js", url: "https://nextjs.org/" },
    { name: "Vercel", url: "https://vercel.com/" },
    { name: "Pixlr", url: "https://pixlr.com/jp/" },
    { name: "Font Awesome", url: "https://fontawesome.com/" },
    { name: "Github", url: "https://github.com/" },
  ];

  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <header className={styles.header}>
          <Link href="/">
            <Image src="/logo.svg" width={44} height={44} alt="site logo" />
          </Link>
          <div>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} size="2xl" style={{ color: "#202328" }} />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} size="2xl" style={{ color: "#1DA1F2" }} />
            </a>
            <a href={zennUrl} target="_blank" rel="noopener noreferrer">
              <Image src="/zenn.svg" width={32} height={32} alt="zenn logo" />
            </a>
            <a href={itchUrl} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faItchIo} size="2xl" style={{ color: "#FA5C5C" }} />
            </a>
          </div>
        </header>
        <GoogleAds slot="header" />
        {children}
        <GoogleAds slot="footer" />
        <footer className={styles.footer}>
          <div className={styles.external}>
            {externals.map((external, i) => (
              <a href={external.url} key={i} target="_blank" rel="noopener noreferrer">
                {external.name}
              </a>
            ))}
          </div>
          <div className={styles.copyright}>
            <p>
              <FontAwesomeIcon icon={faCopyright} size="sm" style={{ marginRight: "0.5em" }} />
              ittokunvim All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
      <GoogleAdsCodeSnipet />
      <GoogleAdsMetatag />
    </html>
  );
}
