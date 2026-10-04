"use client";

import Image from "next/image";

import ReelImage from "./reel-strip.png";
import styles from "./styles.module.css";
import { useCallback, useState } from "react";

type ReelData = {
  zugara: string;
  suberi: string;
};

const IMAGE_WIDTH = 168;
const IMAGE_HEIGHT = 1512;
const ZUGARA_VALUES = [
  "上段赤",
  "中断赤",
  "下段赤",
  "上段チェリー（黒赤）",
  "中段チェリー（黒赤）",
  "下段チェリー（黒赤）",
  "スリス",
  "上段黒",
  "中段黒",
  "下段黒",
  "上段チェリー（青黒）",
  "中段チェリー（青黒）",
  "下段チェリー（青黒）",
  "枠上青",
  "上段青",
  "中段青",
  "下段青",
  "リホホ",
  "ホリホ",
  "スリホ",
  "枠上赤",
];
const SUBERI_VALUES = [
  "ビタ止まり",
  "1すべり",
  "2すべり",
  "3すべり",
  "4すべり",
];

export default function Discup2Reelseigyo() {
  const zugara_height = IMAGE_HEIGHT / 21;
  const imageHeight = zugara_height * 3;

  const [reelValue, setReelValue] = useState<ReelData>({
    zugara: ZUGARA_VALUES[0],
    suberi: SUBERI_VALUES[0],
  });
  const [resultValue, setResultValue] = useState(getResult(reelValue));
  const handleInputZugaraChange = useCallback(
    (value: string) => {
      const newReelValue = { ...reelValue, zugara: value };
      setReelValue(newReelValue);
      setResultValue(getResult(newReelValue));
    },
    [reelValue],
  );

  const handleInputSuberiChange = useCallback(
    (value: string) => {
      const newReelValue = { ...reelValue, suberi: value };
      setReelValue(newReelValue);
      setResultValue(getResult(newReelValue));
    },
    [reelValue],
  );

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <div>押した位置</div>
        <Image
          src={ReelImage}
          alt="discup2 reel image"
          width={IMAGE_WIDTH}
          height={imageHeight}
        />
      </div>
      <div className={styles.image}>
        <div>止まった位置</div>
        <Image
          src={ReelImage}
          alt="discup2 reel image"
          width={IMAGE_WIDTH}
          height={imageHeight}
        />
      </div>
      <select
        value={reelValue.zugara}
        onChange={(e) => handleInputZugaraChange(e.target.value)}
      >
        {ZUGARA_VALUES.map((zugara, i) => (
          <option key={i} value={zugara}>
            {zugara}
          </option>
        ))}
      </select>
      <select
        value={reelValue.suberi}
        onChange={(e) => handleInputSuberiChange(e.target.value)}
      >
        {SUBERI_VALUES.map((koma, i) => (
          <option key={i} value={koma}>
            {koma}
          </option>
        ))}
      </select>
      <div className={styles.result}>
        <ul>
          {resultValue.map((result, i) => (
            <li key={i}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getResult(reel: ReelData): string[] {
  return [reel.zugara, reel.suberi];
}
