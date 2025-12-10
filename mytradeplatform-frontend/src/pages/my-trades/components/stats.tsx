import styles from "../my-trades.module.scss";
import {
  checkIcon,
  flagIcon,
  likeIcon,
  shieldIcon,
  starIcon,
  starSolid,
  totalIcon,
} from "@/base/SVG";

export default function Stats({ trustScore = 4.7 }) {
  const activeStars = Math.floor(trustScore);
  const isPerfectScore = trustScore === 5;
  const totalStars = 5;
  return (
    <div className={styles["stats"]}>
      <h2>Trading Stats</h2>
      <div className={styles["stats__col"]}>
        <div className={styles["stats__row"]}>
          <p>
            {totalIcon}
            Total Trades
          </p>
          <h5>5</h5>
        </div>
        <div className={styles["stats__row"]}>
          <p>
            {shieldIcon}
            Vault Trades
          </p>
          <h5>3</h5>
        </div>
        <div className={styles["stats__row"]}>
          <p>
            {checkIcon}
            Completed
          </p>
          <h5>1</h5>
        </div>
        <div className={styles["stats__row"]}>
          <p>
            {flagIcon}
            Disputed
          </p>
          <h5>1</h5>
        </div>
      </div>
      <div className={styles["stats__foot"]}>
        <div className={styles["stats__row"]}>
          <p>
            {likeIcon}
            Would Trade Again
          </p>
          <h5>90%</h5>
        </div>
        <div className={styles["stats__row"]}>
          <p>
            {starSolid}
            Trust Score
          </p>
          <div className={styles["statsRate"]}>
            <div className={styles["statsRate__stars"]}>
              {[...Array(totalStars)].map((_, i) => {
                const shouldBeActive =
                  i < activeStars || (i === totalStars - 1 && isPerfectScore);
                return (
                  <span key={i}>{shouldBeActive ? starIcon : starSolid}</span>
                );
              })}
            </div>
            <p>{trustScore.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
