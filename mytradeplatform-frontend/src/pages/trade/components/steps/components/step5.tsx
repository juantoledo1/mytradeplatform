import { checkTick, shieldIcon } from "@/base/SVG";
import { FormField } from "@/components/form-field/form-field";
import styles from "../steps.module.scss";

export default function Step5() {
  return (
    <div className={styles["setup"]}>
      <div className={styles["vault"]}>
        <div className={styles["vault__icon"]}>{shieldIcon}</div>
        <div className={styles["vault__text"]}>
          <h6>Vault Trade</h6>
          <p>Trade confidently with built in escrow protection</p>
        </div>
      </div>
      <div className={styles["setupContent"]}>
        <div className={styles["setupContent__title"]}>
          <h3>Shipping Setup</h3>
          <p>Select how you'll handle shipping your item</p>
        </div>
        <label className={styles["input__outer"]}>
          <p>Shipping Method</p>
          <FormField placeholder="Generate via Pirate Ship" type="text" />
          <p>Vault Trade includes automated shipping labels via Pirate Ship</p>
        </label>
        <div className={styles["setupSummary"]}>
          <h3>Shipping Summary</h3>
          <div className={styles["setupSummary__row"]}>
            <div className={styles["setupSummary__col"]}>
              <p>
                <b>You ship to:</b>
              </p>
              <p>GolfTrader22</p>
              <p>
                <span>Portland, OR</span>
              </p>
            </div>
            <div className={styles["setupSummary__col"]}>
              <p>
                <b>You ship to:</b>
              </p>
              <p>GolfTrader22</p>
              <p>
                <span>Portland, OR</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["setupContent"]}>
        <div className={styles["setupContent__title"]}>
          <h3> {shieldIcon} Escrow Protection</h3>
          <p>
            Your trade is protected by Trustap escrow. Funds are held until both
            parties confirm successful delivery.
          </p>
        </div>
        <div className={styles["setupContent__list"]}>
          <h5>
            {shieldIcon}
            Trade Protection Summary
          </h5>
          <ul>
            <li>Both parties deposit the item value</li>
            <li>Funds held in secure escrow by Trustap</li>
            <li>Auto-released after successful delivery confirmation</li>
            <li>Protection against scams or damaged items</li>
          </ul>
        </div>
        <div className={styles["setupDetails"]}>
          <h3>Deposit Details</h3>
          <div className={styles["setupDetails__row"]}>
            <p>Item Value:</p>
            <p>$225.00</p>
          </div>
          <div className={styles["setupDetails__row"]}>
            <p>Escrow Fee (3%):</p>
            <p>$6.75</p>
          </div>
          <div className={styles["setupDetails__total"]}>
            <p>Total Deposit:</p>
            <p>$231.75</p>
          </div>
          <label className={styles["check"]}>
            <div className={styles["check__box"]}>
              <input type="checkbox" />
              <span>{checkTick}</span>
            </div>
            <p>
              <b>
                I agree to deposit funds into Trustap escrow to protect this
                trade
              </b>{" "}
              <br />
              Funds will be held securely until both parties confirm successful
              delivery
            </p>
          </label>
        </div>
        <div className={styles["setupContent__note"]}>
          <p>
            <b>Note:</b>
            At the next step, you'll be prompted to make your deposit payment
            via Stripe to activate escrow protection.
          </p>
        </div>
      </div>
    </div>
  );
}
