import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import {
  cubeIcon,
  filterIcon,
  minusIcon,
  plusIcon,
  refundIcon,
  vaultIcon,
} from "@/base/SVG";
import CustomSelect from "@/components/custom-select/custom-select";
import type { SelectOption } from "@/components/custom-select/custom-select";
import { typeList } from "@/constants/modul";
import type { WalletTransaction } from "@/types";
import styles from "../wallet.module.scss";

interface TableProps {
  transactions: WalletTransaction[];
}

interface TableRowModel {
  id: number | string;
  icon: ReactNode;
  type: string;
  description: string;
  date: string;
  status: string;
  amount: string;
  plus: boolean;
  minus: boolean;
}

const iconByType: Record<string, ReactNode> = {
  deposit: plusIcon,
  withdraw: minusIcon,
  escrow: vaultIcon,
  shipping: cubeIcon,
  refund: refundIcon,
};

const formatAmount = (transaction: WalletTransaction): string => {
  const sign =
    transaction.transactionType === "withdraw" ||
    transaction.transactionType === "shipping"
      ? "-"
      : "+";
  return `${sign}$${transaction.amount.toFixed(2)}`;
};

const buildTableRow = (transaction: WalletTransaction): TableRowModel => {
  const type = transaction.transactionType.toLowerCase();
  const icon = iconByType[type] ?? plusIcon;
  const date = new Date(transaction.updatedAt).toLocaleDateString();
  const plus = type === "deposit" || type === "refund";
  const minus = ["withdraw", "shipping", "escrow"].includes(type);

  return {
    id: transaction.id,
    icon,
    type,
    description: transaction.description,
    date,
    status: transaction.status,
    amount: formatAmount(transaction),
    plus,
    minus,
  };
};

export default function Table({ transactions }: TableProps) {
  const [transactionList, setTransactionList] = useState<TableRowModel[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<SelectOption | null>(
    typeList[0] ?? null
  );

  useEffect(() => {
    setTransactionList(transactions.map(buildTableRow));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!selectedFilter || selectedFilter.value === "All Types") {
      return transactionList;
    }

    const filterValue = selectedFilter.value.toLowerCase();
    return transactionList.filter((item) => item.type === filterValue);
  }, [selectedFilter, transactionList]);

  return (
    <div className={styles["table__wrapper"]}>
      <div className={styles["tableHead"]}>
        <div className={styles["tableHead__title"]}>
          <h3>Transaction History</h3>
          <p>View all your wallet transactions and activities</p>
        </div>
        <div className={styles["tableHead__tools"]}>
          <button type="button" className={styles["tableHead__filter"]} onClick={() => alert("Additional filters functionality coming soon...")}>
            {filterIcon}
          </button>
          <div className={styles["tableHead__select"]}>
            <CustomSelect
              list={typeList}
              selected={selectedFilter}
              onChange={option => setSelectedFilter(option)}
            />
          </div>
        </div>
      </div>
      <div className={styles["table__outer"]}>
        <table className={styles["table"]}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((item) => (
                <TableRow key={item.id} {...item} />
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TableRow = ({
  icon,
  type,
  description,
  date,
  status,
  amount,
  plus,
  minus,
}: TableRowModel) => (
  <tr>
    <td>
      <div
        className={classNames(styles["table__type"], {
          [styles.deposit]: type === "deposit",
          [styles.escrow]: type === "escrow",
          [styles.shipping]: type === "shipping",
          [styles.refund]: type === "refund",
          [styles.withdraw]: type === "withdraw",
        })}
      >
        <span>{icon}</span>
        <p>{type}</p>
      </div>
    </td>
    <td>{description}</td>
    <td>{date}</td>
    <td>
      <div
        className={classNames(styles["table__status"], {
          [styles.completed]: status === "completed",
          [styles.pending]: status === "pending",
          [styles.failed]: status === "failed",
        })}
      >
        {status}
      </div>
    </td>
    <td>
      <div
        className={classNames(styles["table__amount"], {
          [styles.plus]: plus,
          [styles.minus]: minus,
        })}
      >
        {amount}
      </div>
    </td>
  </tr>
);

