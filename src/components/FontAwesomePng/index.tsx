"use client";

import { useEffect, useRef, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { iconLibrary } from "@/lib/fontawesome";
import SearchIcon from "./SearchIcon";
import { IconData, defaultIconData } from "./SearchIcon";
import styles from "./styles.module.css";
import OptionForm, { defaultIconOption, IconOption } from "./OptionForm";

// FontAwesomeアイコンをライブラリに追加
library.add(iconLibrary);

export default function FontAwesomePng() {
  const [iconData, setIconData] = useState<IconData>(defaultIconData);
  const [iconOption, setIconOption] = useState<IconOption>(defaultIconOption);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const searchIconAction = (iconData: IconData) => {
    setIconData(iconData);
  };
  const updateOptionAction = (iconOption: IconOption) => {
    setIconOption(iconOption);
  };

  useEffect(() => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;

    // SVG, Canvasの参照が見つからない時は終了
    if (!svg || !canvas) {
      console.error("svg or canvas is not found.");
      return;
    }

    renderSvgToCanvas(svg, canvas, iconOption);
  }, [iconData, iconOption]);

  const handleClickDownload = () => {
    const link = linkRef.current;
    const canvas = canvasRef.current;

    // LinkとCanvasの参照が見つからない時は終了
    if (!link || !canvas) {
      console.error("link or canvas is not found.");
      return;
    }

    // もしまだアイコンが選択されていなければ何もしない
    if (iconData.data === "") {
      return;
    }

    // 画像URLを設定
    const imageUrl = canvas.toDataURL("image/png");
    link.href = imageUrl;
    link.download = `${iconData.iconName}.png`;
  };

  return (
    <div className={styles.fontawesome_png}>
      <SearchIcon searchIconAction={searchIconAction} />
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      <div className={styles.preview}>
        <h3>プレビュー</h3>
        <svg
          ref={svgRef}
          aria-hidden={true}
          focusable={false}
          data-prefix={iconData.prefix}
          data-icon={iconData.iconName}
          className={`svg-inline--fa ${iconData.iconName}`}
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${iconData.width} ${iconData.height}`}
          style={{
            color: iconOption.color,
            backgroundColor: iconOption.backgroundColor,
          }}
        >
          <path
            fill="currentColor"
            d={`${iconData.data}`}
          ></path>
        </svg>
      </div>
      <OptionForm updateOptionAction={updateOptionAction} />
      <div className={styles.download}>
        <a
          ref={linkRef}
          href="#"
          onClick={handleClickDownload}
        >PNGファイルでダウンロード</a>
      </div>
    </div>
  );
}

function renderSvgToCanvas(
  svg: SVGSVGElement,
  canvas: HTMLCanvasElement,
  option: IconOption,
) {
  // Svgのスタイルを設定
  svg.style.width = `${option.width}px`;
  svg.style.height = `${option.height}px`;
  svg.style.color = option.color;
  svg.style.backgroundColor = option.backgroundColor;

  // Canvasのスタイルを設定
  canvas.width = option.width;
  canvas.height = option.height;
  canvas.style.color = option.color;
  canvas.style.backgroundColor = option.backgroundColor;

  // SVG要素のシリアライズ
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  // Canvasの描画コンテキストを取得
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get canvas context.");
    return;
  }

  // 画像オブジェクトを作成しSVGを読み込む
  const img = new Image();

  // 画像が正しく読み込まれたらCanvasに描画
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(svgUrl);
  };
  // 画像が正しく読み込まれなかったら時のエラーハンドリング
  img.onerror = () => {
    console.error("Failed to load the SVG image.");
    URL.revokeObjectURL(svgUrl);
  };

  // 画像のソースにSVGの一時的なURLを設定
  img.src = svgUrl;
}
