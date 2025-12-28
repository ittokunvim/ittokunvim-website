"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import { GameData } from "@/lib/games";
import styles from "./styles.module.css";

const GAMESITE_URL = process.env.NEXT_PUBLIC_GAMESITE_URL;

type ButtonProps = {
  gameData: GameData;
  onButtonClick: () => void;
};

function Button({ gameData, onButtonClick }: ButtonProps) {
  const { size } = gameData;
  const [_width, height] = size.split("x").map((n) => Number(n));

  return (
    <div className={styles.button} style={{ height }}>
      <button onClick={onButtonClick}>
        <FontAwesomeIcon icon={faCirclePlay} />
        Run Game
      </button>
    </div>
  );
}

function Iframe({ gameData }: { gameData: GameData }) {
  const { slug, size } = gameData;
  const [width, height] = size.split("x");
  const iframeURL = GAMESITE_URL + "/" + slug;

  return <iframe
    className={styles.iframe}
    src={iframeURL}
    width={width}
    height={height}
  />;
}

export default function GameIframe({ gameData }: { gameData: GameData }) {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => setIsClicked(true);

  return (
    <>
      {!isClicked && <Button gameData={gameData} onButtonClick={handleClick} />}
      <Iframe gameData={gameData} />
    </>
  );
}
