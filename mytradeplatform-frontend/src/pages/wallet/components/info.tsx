import type { ReactNode } from "react";
import {
  cubeIcon,
  depositIcon,
  vaultIcon,
  withdrawIcon,
} from "@/base/SVG";
import type { WalletAccount } from "@/types";
import styles from "../wallet.module.scss";

interface WalletInfoProps {
  balance: WalletAccount[];
}

interface WalletInfoItem {
  id: string;
  icon: ReactNode;
  title: string;
  value: string;
}

const formatCurrency = (amount?: number): string =>
  `$${(amount ?? 0).toFixed(2)}`;

const buildWalletInfo = (account?: WalletAccount): WalletInfoItem[] => [
  {
    id: "totalDeposits",
    icon: depositIcon,
    title: "Total Deposits",
    value: formatCurrency(account?.totalDeposited),
  },
  {
    id: "totalWithdrawals",
    icon: withdrawIcon,
    title: "Total Withdrawals",
    value: formatCurrency(account?.totalWithdrawn),
  },
  {
    id: "escrow",
    icon: vaultIcon,
    title: "In Escrow",
    value: formatCurrency(account?.escrowBalance),
  },
  {
    id: "shipping",
    icon: cubeIcon,
    title: "Shipping Costs",
    value: formatCurrency(account?.totalShippingPaid),
  },
];

export default function Info({ balance }: WalletInfoProps) {
  const [account] = balance;
  const infoList = buildWalletInfo(account);

  return (
    <div className={styles["info"]}>
      <div className={styles["info__row"]}>
        {infoList.map((item) => (
          <InfoItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

const InfoItem = ({ icon, title, value }: WalletInfoItem) => (
  <div className={styles["infoItem"]}>
    <div className={styles["infoItem__icon"]}>{icon}</div>
    <div className={styles["infoItem__main"]}>
      <p>{title}</p>
      <h4>{value}</h4>
    </div>
  </div>
);

