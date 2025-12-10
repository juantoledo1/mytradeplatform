import { useState } from "react";
import classNames from "classnames";

import { bankIcon, walletIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import CustomSelect from "@/components/custom-select/custom-select";
import type { SelectOption } from "@/components/custom-select/custom-select";
import { FormField } from "@/components/form-field/form-field";
import { typeList } from "@/constants/modul";
import { apiClient } from "@/services/api/client";
import styles from "../wallet.module.scss";

type WithdrawalMethod = "credit" | "paypal" | null;

export default function WithdrawFunds() {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>(null);

  const accountTypes: SelectOption[] = typeList;

  return (
    <div className={styles["funds"]}>
      <label className={styles["input__outer"]}>
        <p>Amount (USD)</p>
        <FormField placeholder="0.00" type="number" />
        <p>Available: $237.05</p>
      </label>
      {selectedMethod !== "credit" && (
        <div className={styles["fundsPayment"]}>
          <h6>Select Withdrawal Method</h6>
          <div className={styles["fundsPayment__row"]}>
            <button
              type="button"
              className={`${styles["fundsPayment__item"]} ${
                selectedMethod === "credit" ? styles["active"] : ""
              }`}
              onClick={() => setSelectedMethod("credit")}
            >
              <span>{bankIcon}</span>
              <p>Bank Account</p>
            </button>
            <button
              type="button"
              className={`${styles["fundsPayment__item"]} ${
                selectedMethod === "paypal" ? styles["active"] : ""
              }`}
              onClick={() => setSelectedMethod("paypal")}
            >
              <span>{walletIcon}</span>
              <p>PayPal</p>
            </button>
          </div>
        </div>
      )}
      {selectedMethod === "credit" && (
        <>
          <div className={styles["funds__col"]}>
            <label className={styles["input__outer"]}>
              <p>Account Holder Name</p>
              <FormField placeholder="John Doe" type="text" />
            </label>
            <label className={styles["input__outer"]}>
              <p>Bank Name</p>
              <FormField placeholder="Bank of America" type="text" />
            </label>
            <label className={classNames(styles["input__outer"], styles["sm"])}>
              <p>Routing Number</p>
              <FormField placeholder="123456789" type="text" />
            </label>
            <label className={classNames(styles["input__outer"], styles["sm"])}>
              <p>Account Type</p>
              <div className={styles["input"]}>
                <CustomSelect list={accountTypes} selected={accountTypes[0]} />
              </div>
            </label>
            <label className={styles["input__outer"]}>
              <p>Account Number</p>
              <FormField placeholder="1234567890" type="number" />
            </label>
          </div>
          <div className={styles["funds__foot"]}>
            <CustomButton
              title="Back"
              styleType="solid"
              onClick={() => setSelectedMethod(null)}
            />
            <CustomButton 
              title="Withdraw to Bank" 
              styleType="delete" 
              onClick={async () => {
                try {
                  // Lógica para iniciar retiro de fondos
                  const response = await apiClient.post('/api/payment/withdraw', {
                    amount: 100, // Este valor debería obtenerse del input de monto
                    method: 'bank',
                    accountInfo: {
                      accountHolderName: '', // Estos valores deberían obtenerse de los inputs
                      bankName: '',
                      routingNumber: '',
                      accountNumber: '',
                      accountType: 'checking' // o 'savings'
                    }
                  });
                  
                  if (response.status === 200) {
                    alert('Withdrawal request submitted successfully');
                    setSelectedMethod(null);
                  } else {
                    alert('Error processing withdrawal');
                  }
                } catch (error) {
                  console.error('Error processing withdrawal:', error);
                  alert('Error processing withdrawal. Please try again.');
                }
              }} 
            />
          </div>
        </>
      )}
    </div>
  );
}
