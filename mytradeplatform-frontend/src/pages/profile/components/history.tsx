import { motion } from "framer-motion";

import { CustomButton } from "@/components/custom-button/custom-button";
import type { UserProfile } from "@/types";
import styles from "../profile.module.scss";

interface HistoryProps {
  userData: UserProfile;
}

interface HistoryItem {
  id: string;
  title: string;
  info1: string;
  value1: number;
  info2: string;
  value2: number;
  result1: string;
  result2: string;
}

const buildHistoryList = (userData: UserProfile): HistoryItem[] => [
  {
    id: "tradeTypes",
    title: "Trade Types",
    info1: "Vault Trades:",
    value1: userData.vault_trades_count ?? 0,
    info2: "Quick Trades:",
    value2: userData.quick_trades_count ?? 0,
    result1: "Vault:",
    result2: "Quick:",
  },
  {
    id: "tradeSuccess",
    title: "Trade Success",
    info1: "Completed Successfully:",
    value1: userData.total_successful_trades ?? 0,
    info2: "Disputed:",
    value2: userData.dispute_count ?? 0,
    result1: "Success:",
    result2: "Issues:",
  },
];

export default function History({ userData }: HistoryProps) {
  const historyList = buildHistoryList(userData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0 }}
      className={styles["history"]}
    >
      <div className={styles["history__row"]}>
        {historyList.map((item) => (
          <HistoryCol key={item.id} {...item} />
        ))}
      </div>
      <div className={styles["historyContent"]}>
        <h5>Value Traded</h5>
        <div className={styles["historyContent__col"]}>
          <div className={styles["historyContent__value"]}>
            ${userData.total_value ?? 0}
          </div>
          <p>Total estimated value of all trades</p>
          <p>Average trade value: ${userData.average_price ?? 0}</p>
        </div>
      </div>
      <div className={styles["history__foot"]}>
        <CustomButton title="View Full Trade History" styleType="solid" size="sm" />
      </div>
    </motion.div>
  );
}

const HistoryCol = ({
  title,
  info1,
  value1,
  info2,
  value2,
  result1,
  result2,
}: HistoryItem) => {
  const total = value1 + value2;
  const percentage = total === 0 ? 100 : Math.round((value1 / total) * 100);

  return (
    <div className={styles["historyCol"]}>
      <h5>{title}</h5>
      <div className={styles["historyCol__row"]}>
        <h6>{info1}</h6>
        <h6>{value1}</h6>
      </div>
      <div className={styles["historyCol__row"]}>
        <h6>{info2}</h6>
        <h6>{value2}</h6>
      </div>
      <div className={styles["historyCol__progress"]}>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "linear" }}
        />
      </div>
      <div className={styles["historyCol__row"]}>
        <p>
          {result1} {percentage}%
        </p>
        <p>
          {result2} {100 - percentage}%
        </p>
      </div>
    </div>
  );
};
