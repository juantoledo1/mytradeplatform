import { searchIcon } from "@/base/SVG";
import CustomSelect from "@/components/custom-select/custom-select";
import { statusList } from "@/constants/modul";
import styles from "../my-trades.module.scss";
import { moreList, typeList } from "@/constants/modul";

export default function Head() {
  return (
    <div className={styles["head"]}>
      <div className={styles["head__title"]}>
        <h1 className="sm">My Trades</h1>
        <p>All your Quick and Vault trades in one place.</p>
      </div>
      <div className={styles["headFilter"]}>
        <div className={styles["headFilter__search"]}>
          <span>{searchIcon}</span>
          <input type="search" placeholder="Search trades..." />
        </div>
        <div className={styles["headFilter__select"]}>
          <CustomSelect list={statusList} selected={statusList[0]} />
        </div>
        <div className={styles["headFilter__select"]}>
          <CustomSelect list={typeList} selected={typeList[0]} />
        </div>
        <div className={styles["headFilter__select"]}>
          <CustomSelect list={moreList} selected={moreList[0]} />
        </div>
      </div>
    </div>
  );
}
