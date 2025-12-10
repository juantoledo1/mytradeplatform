import { useNavigate } from "react-router-dom";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../my-trades.module.scss";
import { checkIcon, clockIcon, shieldIcon } from "@/base/SVG";

export default function Filters() {
  const navigate = useNavigate();

  return (
    <div className={styles["filters"]}>
      <h3>Quick Filters</h3>
      <div className={styles["filters__col"]}>
        <div className={styles["filters__item"]}>
          <span>{clockIcon}</span>
          <p>Active Trades</p>
        </div>
        <div className={styles["filters__item"]}>
          <span>{checkIcon}</span>
          <p>Completed Trades</p>
        </div>
        <div className={styles["filters__item"]}>
          <span>{shieldIcon}</span>
          <p>Vault Trades Only</p>
        </div>
      </div>
      <CustomButton
        title="Start a New Trade"
        styleType="primary"
        onClick={() => navigate("/trade/steps/")}
      />
    </div>
  );
}
