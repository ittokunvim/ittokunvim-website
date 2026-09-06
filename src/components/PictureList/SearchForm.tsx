import { useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getMonthRange } from "@/lib/picture";
import styles from "./styles.module.css";

export type SearchData = {
  description: string;
  createdAt: string;
};

type Props = {
  searchPicture: (searchData: SearchData) => void;
};

export function SearchForm({ searchPicture }: Props) {
  // 月の一覧を計算（変更されない場合は再計算しない）
  // 初めの要素に空の文字列を入れるのは検索条件を無視するため
  const createdAtList = useMemo(
    () => ["", ...getMonthRange("2026-03", "2026-08")],
    []
  );

  // 検索条件を一つの状態で管理
  const [searchValue, setSearchValue] = useState<SearchData>({
    description: "",
    createdAt: "",
  });

  // 説明の変更を処理（新しいオブジェクトを作成）
  const handleInputDescriptionChange = useCallback(
    (value: string) => {
      const newSearchValue = { ...searchValue, description: value };
      setSearchValue(newSearchValue);
      searchPicture(newSearchValue);
    },
    [searchValue, searchPicture]
  );

  // 作成日時の変更を処理（新しいオブジェクトを作成）
  const handleInputCreatedAtChange = useCallback(
    (value: string) => {
      const newSearchValue = { ...searchValue, createdAt: value };
      setSearchValue(newSearchValue);
      searchPicture(newSearchValue);
    },
    [searchValue, searchPicture]
  );

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
            value={searchValue.description}
            placeholder="説明"
            onChange={(e) => handleInputDescriptionChange(e.target.value)}
          />
        </div>
        <div>
          <select
            value={searchValue.createdAt}
            onChange={(e) => handleInputCreatedAtChange(e.target.value)}
          >
            <option value="">作成日時</option>
            {createdAtList.map((month, i) => (
              <option key={i} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
