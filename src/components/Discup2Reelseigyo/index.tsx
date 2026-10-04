"use client";

import Image from "next/image";

import ReelImage from "./reel-strip.png";
import ReelJson from "./reel-strip.json";
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
  "中段赤",
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
] as const;
const SUBERI_VALUES = [
  "ビタ止まり",
  "1すべり",
  "2すべり",
  "3すべり",
  "4すべり",
] as const;

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
  let resultData = [];
  let reelIndex = getReelIndex(reel);
  if (ReelJson.hazure[reelIndex[0]] == reelIndex[1]) {
    resultData.push("ハズレ");
  }
  if (ReelJson.normalReplay[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リプレイ");
  }
  if (ReelJson.redTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push("赤7頭10枚役");
  }
  if (ReelJson.blueTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push("青7頭10枚役");
  }
  if (ReelJson.barTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push("BAR頭10枚役");
  }
  if (ReelJson.watermelonA[reelIndex[0]] == reelIndex[1]) {
    resultData.push("スイカA");
  }
  if (ReelJson.watermelonB[reelIndex[0]] == reelIndex[1]) {
    resultData.push("スイカB");
  }
  if (ReelJson.cherry[reelIndex[0]] == reelIndex[1]) {
    resultData.push("チェリー");
  }
  if (ReelJson.singleWinRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("単独赤7");
  }
  if (ReelJson.singleWinBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("単独青7");
  }
  if (ReelJson.singleWinBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("単独BARビッグ");
  }
  if (ReelJson.singleWinMixedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("単独異色");
  }
  if (ReelJson.singleWinRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("単独バケ");
  }
  if (ReelJson.watermelonABlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("青7、スイカA重複");
  }
  if (ReelJson.watermelonABarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("BARビッグ、スイカA重複");
  }
  if (ReelJson.watermelonBRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("赤7、スイカB重複");
  }
  if (ReelJson.reachReplayRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("特リプ、赤7");
  }
  if (ReelJson.reachReplayBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("特リプ、青7");
  }
  if (ReelJson.reachRoleARedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役A、赤7");
  }
  if (ReelJson.reachRoleABlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役A、青7");
  }
  if (ReelJson.reachRoleABarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役A、BARビッグ");
  }
  if (ReelJson.reachRoleAMixedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役A、異色");
  }
  if (ReelJson.reachRoleBRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役B、赤7");
  }
  if (ReelJson.reachRoleBBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役B、青7");
  }
  if (ReelJson.reachRoleBBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役B、BARビッグ");
  }
  if (ReelJson.reachRoleBRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役B、レギュラー");
  }
  if (ReelJson.reachRoleCRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役C、赤7");
  }
  if (ReelJson.reachRoleCBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役C、青7");
  }
  if (ReelJson.reachRoleCBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役C、BARビッグ");
  }
  if (ReelJson.reachRoleCRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役C、レギュラー");
  }
  if (ReelJson.reachRoleDRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役D、赤7");
  }
  if (ReelJson.reachRoleDBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役D、青7");
  }
  if (ReelJson.reachRoleDBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役D、BARビッグ");
  }
  if (ReelJson.reachRoleDRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("リーチ目役D、レギュラー");
  }
  if (ReelJson.commonOneCoinRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("共通1枚役、赤7");
  }
  if (ReelJson.commonOneCoinBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("共通1枚役、青7");
  }
  if (ReelJson.commonOneCoinBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("共通1枚役、BARビッグ");
  }
  if (ReelJson.commonOneCoinRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push("共通1枚役、レギュラー");
  }
  if (resultData.length == 0) {
    resultData.push("止まらず...");
  }
  return resultData;
}

function getReelIndex(reel: ReelData): number[] {
  let zugaraIndex = 0;
  switch (reel.zugara) {
    case "上段赤":
      zugaraIndex = 17;
      break;
    case "中段赤":
      zugaraIndex = 18;
      break;
    case "下段赤":
      zugaraIndex = 19;
      break;
    case "上段チェリー（黒赤）":
      zugaraIndex = 20;
      break;
    case "中段チェリー（黒赤）":
      zugaraIndex = 0;
      break;
    case "下段チェリー（黒赤）":
      zugaraIndex = 1;
      break;
    case "スリス":
      zugaraIndex = 2;
      break;
    case "上段黒":
      zugaraIndex = 3;
      break;
    case "中段黒":
      zugaraIndex = 4;
      break;
    case "下段黒":
      zugaraIndex = 5;
      break;
    case "上段チェリー（青黒）":
      zugaraIndex = 6;
      break;
    case "中段チェリー（青黒）":
      zugaraIndex = 7;
      break;
    case "下段チェリー（青黒）":
      zugaraIndex = 8;
      break;
    case "枠上青":
      zugaraIndex = 9;
      break;
    case "上段青":
      zugaraIndex = 10;
      break;
    case "中段青":
      zugaraIndex = 11;
      break;
    case "下段青":
      zugaraIndex = 12;
      break;
    case "リホホ":
      zugaraIndex = 13;
      break;
    case "ホリホ":
      zugaraIndex = 14;
      break;
    case "スリホ":
      zugaraIndex = 15;
      break;
    case "枠上赤":
      zugaraIndex = 16;
      break;
  }
  let suberiIndex = 0;
  switch (reel.suberi) {
    case "ビタ止まり":
      suberiIndex = 0;
      break;
    case "1すべり":
      suberiIndex = 1;
      break;
    case "2すべり":
      suberiIndex = 2;
      break;
    case "3すべり":
      suberiIndex = 3;
      break;
    case "4すべり":
      suberiIndex = 4;
      break;
  }
  return [zugaraIndex, suberiIndex];
}
