import { useState } from "react";

import { creditIcon, walletIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import { FormField } from "@/components/form-field/form-field";
import { apiClient } from "@/services/api/client";
import styles from "../wallet.module.scss";

type PaymentMethod = "credit" | "paypal" | null;

export default function DepositFunds() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

  return (
    <div className={styles["funds"]}>
      <label className={styles["input__outer"]}>
        <p>Amount (USD)</p>
        <FormField placeholder="0.00" type="number" />
      </label>
      {selectedMethod !== "credit" && (
        <div className={styles["fundsPayment"]}>
          <h6>Select Payment Method</h6>
          <div className={styles["fundsPayment__row"]}>
            <button
              type="button"
              className={`${styles["fundsPayment__item"]} ${
                selectedMethod === "credit" ? styles["active"] : ""
              }`}
              onClick={() => setSelectedMethod("credit")}
            >
              <span>{creditIcon}</span>
              <p>Credit Card</p>
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
          <div className={styles["funds__stripe"]}>
            <h6>Stripe Payment</h6>
            <p>
              You will be redirected to Stripe's secure payment page to complete
              your deposit.
            </p>
          </div>
          <div className={styles["funds__foot"]}>
            <CustomButton
              title="Back"
              styleType="solid"
              onClick={() => setSelectedMethod(null)}
            />
            <CustomButton 
              title="Continue to Stripe" 
              styleType="primary" 
              onClick={async () => {
                try {
                  // Lógica para crear sesión de pago con Stripe
                  const response = await apiClient.post('/api/payment/create-checkout-session', {
                    amount: 1000, // Este valor debería obtenerse del input de monto
                    currency: 'usd',
                  });
                  
                  if (response.data.url) {
                    // Redirigir al usuario a la página de checkout de Stripe
                    window.location.href = response.data.url;
                  } else {
                    alert('Error creating payment session');
                  }
                } catch (error) {
                  console.error('Error creating checkout session:', error);
                  alert('Error processing payment. Please try again.');
                }
              }} 
            />
          </div>
        </>
      )}
    </div>
  );
}
