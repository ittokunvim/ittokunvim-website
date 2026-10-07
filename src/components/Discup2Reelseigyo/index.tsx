"use client";

import Image from "next/image";
import { PointerEvent, useMemo, useRef, useState } from "react";

import reelControls from "./reel-strip.json";
import reelStrip from "./reel-strip.png";
import styles from "./styles.module.css";

const IMAGE_WIDTH = 168;
const IMAGE_HEIGHT = 1512;
const REEL_POSITION_COUNT = 21;
const SYMBOL_HEIGHT = IMAGE_HEIGHT / REEL_POSITION_COUNT;
const WINDOW_HEIGHT = SYMBOL_HEIGHT * 3;

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

const ZUGARA_TO_REEL_INDEX = [
  17, 18, 19, 20, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
] as const;

const REEL_INDEX_TO_ZUGARA_INDEX = [
  4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0, 1, 2, 3,
] as const;

const SUBERI_VALUES = [
  "ビタ止まり",
  "1すべり",
  "2すべり",
  "3すべり",
  "4すべり",
] as const;

type ResultType = "hazure" | "koyaku" | "big" | "regular";

type ReelControl = {
  type: ResultType;
  text: string;
  suberi: readonly number[];
};

const controls = Object.values(reelControls) as ReelControl[];

export default function Discup2Reelseigyo() {
  const [zugaraIndex, setZugaraIndex] = useState(0);
  const [suberiIndex, setSuberiIndex] = useState(0);
  const reelIndex = ZUGARA_TO_REEL_INDEX[zugaraIndex];
  const stoppedReelIndex = (reelIndex + suberiIndex) % REEL_POSITION_COUNT;
  const results = useMemo(
    () => getResults(reelIndex, suberiIndex),
    [reelIndex, suberiIndex],
  );

  return (
    <div className={styles.container}>
      <Reel
        label="押した位置"
        reelIndex={reelIndex}
        onReelIndexChange={(nextReelIndex) =>
          setZugaraIndex(REEL_INDEX_TO_ZUGARA_INDEX[nextReelIndex])
        }
      />
      <Reel label="止まった位置" reelIndex={stoppedReelIndex} />
      <label className={styles.select}>
        押した図柄：
        <select
          value={zugaraIndex}
          onChange={(event) => setZugaraIndex(Number(event.target.value))}
        >
          {ZUGARA_VALUES.map((zugara, index) => (
            <option key={zugara} value={index}>
              {zugara}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.select}>
        滑りコマ数：
        <select
          value={suberiIndex}
          onChange={(event) => setSuberiIndex(Number(event.target.value))}
        >
          {SUBERI_VALUES.map((suberi, index) => (
            <option key={suberi} value={index}>
              {suberi}
            </option>
          ))}
        </select>
      </label>
      <ResultList results={results} />
    </div>
  );
}

type ReelProps = {
  label: string;
  reelIndex: number;
  onReelIndexChange?: (ReelIndex: number) => void;
};

function Reel({ label, reelIndex, onReelIndexChange }: ReelProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const position = getReelPosition(reelIndex) + dragOffset;
  const isDraggable = onReelIndexChange !== undefined;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggable) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartY.current = event.clientY;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    setDragOffset(event.clientY - dragStartY.current);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    const offset = event.clientY - dragStartY.current;
    const movedSymbols = Math.round(offset / SYMBOL_HEIGHT);
    const nextReelIndex = modulo(reelIndex + movedSymbols, REEL_POSITION_COUNT);

    dragStartY.current = null;
    setDragOffset(0);
    onReelIndexChange?.(nextReelIndex);
  };

  return (
    <div className={styles.image} style={{ maxWidth: IMAGE_WIDTH }}>
      <div className={styles.imageLabel}>{label}</div>
      <div
        className={`${styles.imageWindow} ${isDraggable ? styles.draggable : ""}`}
        style={{ maxWidth: IMAGE_WIDTH, height: WINDOW_HEIGHT }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerOut={handlePointerEnd}
      >
        <div
          className={styles.imageTrack}
          style={{ transform: `translateY(${position}px)` }}
        >
          <Image src={reelStrip} alt="" aria-hidden="true" priority />
          <Image src={reelStrip} alt="" aria-hidden="true" priority />
        </div>
      </div>
    </div>
  );
}

function ResultList({ results }: { results: readonly ReelControl[] }) {
  const resultTypes: readonly ResultType[] = [
    "hazure",
    "koyaku",
    "big",
    "regular",
  ];

  if (results.length === 0) {
    return <div className={styles.emptyResult}>止まらず...</div>;
  }

  return (
    <div className={styles.result}>
      {resultTypes.map((type) => {
        const resultsByType = results.filter((result) => result.type === type);

        return resultsByType.length > 0 ? (
          <ul key={type} className={styles[type]}>
            {resultsByType.map((result) => (
              <li key={result.text}>{result.text}</li>
            ))}
          </ul>
        ) : null;
      })}
    </div>
  );
}

function getReelPosition(reelIndex: number): number {
  return (
    -IMAGE_HEIGHT + WINDOW_HEIGHT - (21 - (reelIndex % 21)) * SYMBOL_HEIGHT
  );
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function getResults(reelIndex: number, suberiIndex: number): ReelControl[] {
  return controls.filter(
    (control) => control.suberi[reelIndex] === suberiIndex,
  );
}
