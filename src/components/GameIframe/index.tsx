"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import { GameData } from "@/lib/games";
import styles from "./styles.module.css";

const GAME_SITE_URL = process.env.NEXT_PUBLIC_GAMESITE_URL;

type ButtonProps = {
  onButtonClick: () => void;
};

function Button({ onButtonClick }: ButtonProps) {
  return (
    <div className={styles.button}>
      <button onClick={onButtonClick}>
        <FontAwesomeIcon icon={faCirclePlay} />
        Run Game
      </button>
    </div>
  );
}

function Iframe({ gameData }: { gameData: GameData }) {
  const { slug } = gameData;
  const iframeURL = GAME_SITE_URL + "/" + slug;

  return <iframe
    className={styles.iframe}
    src={iframeURL}
  />;
}

export default function GameIframe({ gameData }: { gameData: GameData }) {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => setIsClicked(true);

  return (
    <>
      {!isClicked && <Button onButtonClick={handleClick} />}
      <Iframe gameData={gameData} />
    </>
  );
}
