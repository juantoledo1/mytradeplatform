import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import { AnimatePresence } from "framer-motion";

import Balance from "./components/balance";
import Head from "./components/head";
import Info from "./components/info";
import Table from "./components/table";
import DepositFunds from "./components/deposit-funds";
import WithdrawFunds from "./components/withdraw-funds";
import styles from "./wallet.module.scss";
import { Modal } from "../../components/modal/modal";

import type { ModalState, WalletAccount, WalletTransaction } from "@/types";

interface WalletResponse {
  results: WalletAccount[];
}

interface ApiErrorResponse {
  message?: string;
}

export default function Wallet() {
  const [modal, setModal] = useState<ModalState>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [walletData, setWalletData] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const handleError = (error: AxiosError<ApiErrorResponse>) => {
    console.error("Error fetching wallet data:", error);
  };

  const getWalletData = async () => {
    try {
      const response = await apiClient.get<WalletResponse>(
        "/api/payment/wallet/"
      );

      const results = response.data.results ?? [];
      setWalletData(results);
      const history = results.flatMap((wallet) => wallet.historyTransactions ?? []);
      setTransactions(history);
      setIsLoaded(true);
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      void getWalletData();
    }
  }, [isLoaded]);

  return (
    <>
      <section className={styles["wallet"]}>
        <div className="auto__container">
          <div className={styles["wallet__inner"]}>
            <Head />
            <Balance setModal={setModal} balance={walletData} />
            <Info balance={walletData} />
            <Table transactions={transactions} />
          </div>
        </div>
      </section>
      <AnimatePresence>
        {modal === "deposit" && (
          <Modal
            title="Deposit Funds"
            text="Add money to your MyTradePlatform wallet"
            setModal={setModal}
          >
            <DepositFunds setModal={setModal} />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modal === "withdraw" && (
          <Modal
            title="Withdraw Funds"
            text="Transfer money from your MyTradePlatform wallet"
            setModal={setModal}
          >
            <WithdrawFunds setModal={setModal} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}



