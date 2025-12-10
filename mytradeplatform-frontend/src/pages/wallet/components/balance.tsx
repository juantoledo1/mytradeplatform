import type { Dispatch, SetStateAction } from "react";

import { dollarBig, minusIcon, plusIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import type { ModalState, WalletAccount } from "@/types";
import styles from "../wallet.module.scss";

interface BalanceProps {
  setModal: Dispatch<SetStateAction<ModalState>>;
  balance: WalletAccount[];
}

export default function Balance({ setModal, balance }: BalanceProps) {
  const [wallet] = balance;
  const currentBalance = wallet?.availableBalance ?? 0;

  return (
    <div className={styles["balance"]}>
      <h3>
        {dollarBig}
        Current Balance
      </h3>
      <div className={styles["balance__row"]}>
        <div className={styles["balance__amount"]}>${currentBalance.toFixed(2)}</div>
        <div className={styles["balance__buttons"]}>
          <CustomButton
            iconPos="left"
            title="Deposit"
            styleType="deposit"
            icon={plusIcon}
            onClick={() => setModal("deposit")}
          />
          <div className={styles["balance__withdraw"]}>
            <CustomButton
              iconPos="left"
              title="Withdraw"
              styleType="solid"
              icon={minusIcon}
              onClick={() => setModal("withdraw")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
