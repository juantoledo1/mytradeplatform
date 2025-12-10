import styles from "../trade.module.scss";
import {
  arrowLeft,
  checkCircle,
  downloadIcon,
  flagIcon,
  receiptIcon,
  shieldIcon,
  starSolid,
  viewIcon,
} from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import { Link } from "react-router-dom";

export default function EscrowRelease() {
  return (
    <section className={styles["release"]}>
      <div className="auto__container">
        <div className={styles["release__inner"]}>
          <div className={styles["releaseTop"]}>
            <div className={styles["releaseTop__icon"]}>{checkCircle}</div>
            <h1>Trade Complete – Funds Released</h1>
            <p>
              Both users confirmed delivery. Your escrow deposit has now been
              released securely via Trustap.
            </p>
          </div>
          <div className={styles["releaseSummary"]}>
            <h3> {shieldIcon} Escrow Summary</h3>
            <div className={styles["releaseSummary__note"]}>
              <p>Trade: "Driver for Putter Swap"</p>
            </div>
            <div className={styles["releaseSummary__row"]}>
              <p>Item Value:</p>
              <p>$265.00</p>
            </div>
            <div className={styles["releaseSummary__row"]}>
              <p>Escrow Fee:</p>
              <p>$7.95</p>
            </div>
            <div className={styles["releaseSummary__total"]}>
              <p>Total Escrow Amount:</p>
              <p>$272.95</p>
            </div>
            <div className={styles["releaseSummary__row"]}>
              <p>Released To:</p>
              <p>GolfSwapper92</p>
            </div>
            <div className={styles["releaseSummary__row"]}>
              <p>Release Method:</p>
              <p>Automatic (Confirmed Delivery)</p>
            </div>
            <div className={styles["releaseSummary__row"]}>
              <p>Date of Release:</p>
              <p>May 8, 2025 at 8:00 PM</p>
            </div>
          </div>
          <div className={styles["releaseContent"]}>
            <div className={styles["releaseContent__trust"]}>
              {shieldIcon}
              <h6>Escrow powered by Trustap</h6>
            </div>
            <Link to="/" className={styles["releaseContent__more"]}>
              Learn more
              {viewIcon}
            </Link>
          </div>
          <div className={styles["releaseContent"]}>
            <div className={styles["releaseContent__receipt"]}>
              {receiptIcon}
              <p>Trade Receipt</p>
            </div>
            <div className={styles["releaseContent__download"]}>
              <CustomButton
                iconPos="left"
                title="Download PDF"
                styleType="solid"
                icon={downloadIcon}
                onClick={() => {
                  // Lógica para descargar el PDF del recibo
                  alert("Download escrow receipt as PDF functionality coming soon...");
                }}
              />
            </div>
          </div>
          <div className={styles["releaseFoot"]}>
            <div className={styles["releaseFoot__side"]}>
              <CustomButton
                iconPos="left"
                title="View Trade Summary"
                styleType="solid"
                icon={arrowLeft}
              />
              <CustomButton
                iconPos="left"
                title="Something Went Wrong?"
                styleType="solid"
                icon={flagIcon}
              />
            </div>
            <CustomButton
              iconPos="left"
              title="Leave a Review"
              styleType="primary"
              icon={starSolid}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
