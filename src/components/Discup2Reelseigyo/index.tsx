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

type ResultData = {
  type: number;
  text: string;
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
  const zugaraHeight = IMAGE_HEIGHT / 21;
  const imageWindowHeight = zugaraHeight * 3;

  const [reelValue, setReelValue] = useState<ReelData>({
    zugara: ZUGARA_VALUES[0],
    suberi: SUBERI_VALUES[0],
  });
  let reelIndex = getReelIndex(reelValue);

  const zugaraPosition =
    IMAGE_HEIGHT - zugaraHeight * 3 + ((21 - reelIndex[0]) % 21) * zugaraHeight;
  let suberiPosition = zugaraPosition - zugaraHeight * reelIndex[1];
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
        <div
          className={styles.image_window}
          style={{ width: IMAGE_WIDTH, height: imageWindowHeight }}
        >
          <div
            className={styles.image_track}
            style={{ height: zugaraPosition }}
          >
            <Image src={ReelImage} alt="discup2 reel image" loading="eager" />
            <Image src={ReelImage} alt="discup2 reel image" loading="eager" />
          </div>
        </div>
      </div>
      <div className={styles.image}>
        <div>止まった位置</div>
        <div
          className={styles.image_window}
          style={{ width: IMAGE_WIDTH, height: imageWindowHeight }}
        >
          <div
            className={styles.image_track}
            style={{ height: suberiPosition }}
          >
            <Image src={ReelImage} alt="discup2 reel image" loading="eager" />
            <Image src={ReelImage} alt="discup2 reel image" loading="eager" />
          </div>
        </div>
      </div>
      <select
        className={styles.select}
        value={reelValue.zugara}
        style={{ width: IMAGE_WIDTH }}
        onChange={(e) => handleInputZugaraChange(e.target.value)}
      >
        {ZUGARA_VALUES.map((zugara, i) => (
          <option key={i} value={zugara}>
            {zugara}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={reelValue.suberi}
        style={{ width: IMAGE_WIDTH }}
        onChange={(e) => handleInputSuberiChange(e.target.value)}
      >
        {SUBERI_VALUES.map((koma, i) => (
          <option key={i} value={koma}>
            {koma}
          </option>
        ))}
      </select>
      <div className={styles.result}>
        <Result resultList={resultValue} />
      </div>
    </div>
  );
}

function Result(props: { resultList: ResultData[] }) {
  let resultList = props.resultList;
  const hazureResult = resultList.filter((result) => result.type == 0);
  const koyakuResult = resultList.filter((result) => result.type == 1);
  const bigResult = resultList.filter((result) => result.type == 2);
  const regularResult = resultList.filter((result) => result.type == 3);

  return (
    <>
      <ul className={styles.hazure}>
        {hazureResult.map((result, i) => (
          <li key={i}>{result.text}</li>
        ))}
      </ul>
      <ul className={styles.koyaku}>
        {koyakuResult.map((result, i) => (
          <li key={i}>{result.text}</li>
        ))}
      </ul>
      <ul className={styles.big}>
        {bigResult.map((result, i) => (
          <li key={i}>{result.text}</li>
        ))}
      </ul>
      <ul className={styles.regular}>
        {regularResult.map((result, i) => (
          <li key={i}>{result.text}</li>
        ))}
      </ul>
      {resultList.length == 0 && <div>止まらず...</div>}
    </>
  );
}

function getResult(reel: ReelData): ResultData[] {
  let resultData: ResultData[] = [];
  let reelIndex = getReelIndex(reel);
  if (ReelJson.hazure[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 0,
      text: "ハズレ",
    });
  }
  if (ReelJson.normalReplay[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "リプレイ(7.3)",
    });
  }
  if (ReelJson.redTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "赤7頭10枚役",
    });
  }
  if (ReelJson.blueTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "青7頭10枚役",
    });
  }
  if (ReelJson.barTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "BAR頭10枚役",
    });
  }
  if (ReelJson.commonTenCoin[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "共通10枚役",
    });
  }
  if (ReelJson.watermelonA[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "スイカA(62.1/59.8/59.3/56.7)",
    });
  }
  if (ReelJson.watermelonB[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "スイカB(253.0)",
    });
  }
  if (ReelJson.cherry[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 1,
      text: "チェリー(26.6/34.9/34.3/33.6)",
    });
  }
  if (ReelJson.singleWinRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "単独赤7(4681.1)",
    });
  }
  if (ReelJson.singleWinBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "単独青7(13107.2)",
    });
  }
  if (ReelJson.singleWinBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "単独BARビッグ(6553.6)",
    });
  }
  if (ReelJson.singleWinMixedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "単独異色(16384.0)",
    });
  }
  if (ReelJson.singleWinRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 3,
      text: "単独バケ(1365.3/1310.7/1285.0/1260.3)",
    });
  }
  if (ReelJson.watermelonABlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "スイカA重複、青7(8192.0)",
    });
  }
  if (ReelJson.watermelonABarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "スイカA重複、BARビッグ(7281.8)",
    });
  }
  if (ReelJson.watermelonBRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "スイカB重複、赤7(16384.0)",
    });
  }
  if (ReelJson.reachReplayRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "特リプ、赤7(16384.0)",
    });
  }
  if (ReelJson.reachReplayBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "特リプ、青7(16384.0)",
    });
  }
  if (ReelJson.reachRoleARedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役A、赤7(5461.3)",
    });
  }
  if (ReelJson.reachRoleABlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役A、青7(10922.7)",
    });
  }
  if (ReelJson.reachRoleABarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役A、BARビッグ(8192.0)",
    });
  }
  if (ReelJson.reachRoleAMixedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役A、異色(13107.2/10922.7/5461.3/4681.1)",
    });
  }
  if (ReelJson.reachRoleBRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役B、赤7(7281.8)",
    });
  }
  if (ReelJson.reachRoleBBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役B、青7(3449.3)",
    });
  }
  if (ReelJson.reachRoleBBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役B、BARビッグ(8192.0)",
    });
  }
  if (ReelJson.reachRoleBRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 3,
      text: "リーチ目役B、レギュラー(5957.8/4369.1/4069.0/3855.1)",
    });
  }
  if (ReelJson.reachRoleCRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役C、赤7(13107.2)",
    });
  }
  if (ReelJson.reachRoleCBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役C、青7(16384.0)",
    });
  }
  if (ReelJson.reachRoleCBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役C、BARビッグ(7281.8)",
    });
  }
  if (ReelJson.reachRoleCRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 3,
      text: "リーチ目役C、レギュラー(4369.1)",
    });
  }
  if (ReelJson.reachRoleDRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役D、赤7(6553.6)",
    });
  }
  if (ReelJson.reachRoleDBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役D、青7(10922.7)",
    });
  }
  if (ReelJson.reachRoleDBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "リーチ目役D、BARビッグ(8192.0)",
    });
  }
  if (ReelJson.reachRoleDRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 3,
      text: "リーチ目役D、レギュラー(4681.1/3640.9/3449.3/2978.9)",
    });
  }
  if (ReelJson.commonOneCoinRedBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "共通1枚役、赤7(9362.3)",
    });
  }
  if (ReelJson.commonOneCoinBlueBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "共通1枚役、青7(9352.3)",
    });
  }
  if (ReelJson.commonOneCoinBarBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 2,
      text: "共通1枚役、BARビッグ(9362.3)",
    });
  }
  if (ReelJson.commonOneCoinRegularBonus[reelIndex[0]] == reelIndex[1]) {
    resultData.push({
      type: 3,
      text: "共通1枚役、レギュラー(5461.3)",
    });
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
