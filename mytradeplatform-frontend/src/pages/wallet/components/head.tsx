import { walletIcon } from "@/base/SVG";
import styles from "../wallet.module.scss";

export default function Head() {
  return (
    <div className={styles["head"]}>
      <div className={styles["head__icon"]}>{walletIcon}</div>
      <div className={styles["head__title"]}>
        <h1 className="sm">MyTradePlatform Wallet</h1>
        <p>
          Manage your balance for escrow deposits, shipping, and withdrawals
        </p>
      </div>
    </div>
  );
}
