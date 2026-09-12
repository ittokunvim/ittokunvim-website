import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";

export type SearchData = {
  title: string;
  artist: string;
  createdAt: string;
};

type Props = {
  searchMusic: (searchData: SearchData) => void;
};

export function SearchForm({ searchMusic }: Props) {
  const createdAtList = () => {
    const list: string[] = [];
    const [start, end] = [2000, 2025];
    for (let i = start; i <= end; i++) {
      list.unshift(`${i}年`);
    }
    list.unshift("");
    return list;
  };
  const [inputTitleValue, setInputTitleValue] = useState<string>("");
  const [inputArtistValue, setInputArtistValue] = useState<string>("");
  const [inputCreatedAtValue, setInputCreatedAtValue] = useState<string>("");

  const handleInputTitleChange = (value: string) => {
    setInputTitleValue(value);
    searchMusic({
      title: value,
      artist: inputArtistValue,
      createdAt: inputCreatedAtValue,
    });
  };
  const handleInputArtistChange = (value: string) => {
    setInputArtistValue(value);
    searchMusic({
      title: inputTitleValue,
      artist: value,
      createdAt: inputCreatedAtValue,
    });
  };
  const handleInputCreatedAtChange = (value: string) => {
    setInputCreatedAtValue(value);
    searchMusic({
      title: inputTitleValue,
      artist: inputArtistValue,
      createdAt: value,
    });
  };

  return (
    <div className={styles.search}>
      <h4>
        <FontAwesomeIcon icon={faSearch} />
        検索する
      </h4>
      <div className={styles.form}>
        <div>
          <input
            type="text"
            value={inputTitleValue}
            placeholder="タイトル"
            onChange={(e) => handleInputTitleChange(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            value={inputArtistValue}
            placeholder="アーティスト"
            onChange={(e) => handleInputArtistChange(e.target.value)}
          />
        </div>
        <div>
          <select
            value={inputCreatedAtValue}
            onChange={(e) => handleInputCreatedAtChange(e.target.value)}
          >
            <option value="" disabled>作成日時</option>
            {createdAtList().map((createdAt, i) => (
              <option key={i} value={createdAt}>{createdAt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
