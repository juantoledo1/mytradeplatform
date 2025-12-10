import {
  downloadIcon,
  flagIcon,
  likeIcon,
  receiptIcon,
  shareIcon,
  shieldIcon,
  starIcon,
  viewIcon,
} from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../trade.module.scss";
import avatar from "@/assets/images/avatars/1.png";
import image1 from "@/assets/images/offer/3.png";
import image2 from "@/assets/images/offer/2.png";
import { useNavigate } from "react-router-dom";

export default function TradeSummary() {
  const navigate = useNavigate("");

  return (
    <section className={styles["summary"]}>
      <div className="auto__container">
        <div className={styles["summary__inner"]}>
          <div className={styles["summaryTop"]}>
            <div className={styles["summaryTop__title"]}>
              <h1 className="sm">"Driver for Putter Swap"</h1>
              <p>Completed on May 7, 2025 at 7:30 PM</p>
            </div>
            <div className={styles["summaryTop__info"]}>
              <div className={styles["summaryTop__status"]}>
                <span></span>
                Completed
              </div>
              <CustomButton
                iconPos="left"
                title="Something Went Wrong?"
                styleType="solid"
                icon={flagIcon}
                onClick={() => navigate("/report-trade")}
              />
            </div>
          </div>
          <div className={styles["summaryContent"]}>
            <div className={styles["summaryContent__row"]}>
              <div
                className={styles["summaryProfile"]}
                onClick={() => navigate("/user-profile")}
              >
                <h5>You</h5>
                <div className={styles["summaryProfile__row"]}>
                  <div className={styles["summaryProfile__avatar"]}>
                    <img src={avatar} alt="avatar" />
                  </div>
                  <div className={styles["summaryProfile__name"]}>
                    <h6>ClubTrader45</h6>
                    <div className={styles["summaryProfile__rate"]}>
                      <span>
                        {starIcon}
                        {starIcon}
                        {starIcon}
                        {starIcon}
                        {starIcon}
                      </span>
                      <p>4.8</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["summaryProfile"]}>
                <h5>Trading Partner</h5>
                <div className={styles["summaryProfile__row"]}>
                  <div className={styles["summaryProfile__avatar"]}>
                    <img src={avatar} alt="avatar" />
                  </div>
                  <div className={styles["summaryProfile__name"]}>
                    <h6>GolfSwapper92</h6>
                    <div className={styles["summaryProfile__rate"]}>
                      <span>
                        {starIcon}
                        {starIcon}
                        {starIcon}
                        {starIcon}
                        {starIcon}
                      </span>
                      <p>4.6</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["summaryContent"]}>
            <h2>Items Exchanged</h2>
            <div className={styles["summaryContent__row"]}>
              <div className={styles["summaryItem"]}>
                <h5>Your Item → GolfSwapper92</h5>
                <div className={styles["summaryItem__image"]}>
                  <img src={image1} alt="skiing" />
                </div>
                <div className={styles["summaryItem__content"]}>
                  <div className={styles["summaryItem__title"]}>
                    <h6>TaylorMade SIM2 Driver</h6>
                    <p>Golf Clubs &lt; Drivers</p>
                  </div>
                  <div className={styles["summaryItem__text"]}>
                    <p>
                      Lightly used TaylorMade SIM2 Driver, 9 degrees. Great
                      condition with headcover.
                    </p>
                  </div>
                  <div className={styles["summaryItem__value"]}>
                    <p>Value: $265.00</p>
                  </div>
                </div>
              </div>
              <div className={styles["summaryItem"]}>
                <h5>GolfSwapper92 → You</h5>
                <div className={styles["summaryItem__image"]}>
                  <img src={image2} alt="skiing" />
                </div>
                <div className={styles["summaryItem__content"]}>
                  <div className={styles["summaryItem__title"]}>
                    <h6>Scotty Cameron Special Select Putter</h6>
                    <p>Golf Clubs &lt; Putters</p>
                  </div>
                  <div className={styles["summaryItem__text"]}>
                    <p>
                      Scotty Cameron Special Select Newport 2. Used for one
                      season, minimal wear.
                    </p>
                  </div>
                  <div className={styles["summaryItem__value"]}>
                    <p>Value: $265.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["summaryContent"]}>
            <h2>Items Exchanged</h2>
            <div className={styles["summaryContent__row"]}>
              <div className={styles["summaryItem"]}>
                <div className={styles["summaryItem__top"]}>
                  <h6>Your Shipment</h6>
                  <div className={styles["summaryItem__status"]}>Delivered</div>
                </div>
                <div className={styles["summaryItem__list"]}>
                  <p>
                    Carrier: <b>USPS</b>
                  </p>
                  <p>
                    Tracking: <b>9400123456789012345678</b>
                  </p>
                  <p>
                    Label Method: <b>Pirate Ship</b>
                  </p>
                  <p>
                    Delivered On: <b>May 5, 2025 at 8:23 PM</b>
                  </p>
                </div>
                <div className={styles["summaryItem__foot"]}>
                  <CustomButton
                    iconPos="left"
                    title="View Tracking Details"
                    styleType="solid"
                    icon={viewIcon}
                    onClick={() => navigate("/tracking-details", { state: { shipmentType: 'your-shipment' } })}
                  />
                </div>
              </div>
              <div className={styles["summaryItem"]}>
                <div className={styles["summaryItem__top"]}>
                  <h6>Their Shipment</h6>
                  <div className={styles["summaryItem__status"]}>Delivered</div>
                </div>
                <div className={styles["summaryItem__list"]}>
                  <p>
                    Carrier: <b>UPS</b>
                  </p>
                  <p>
                    Tracking: <b>1Z999AA1234567890</b>
                  </p>
                  <p>
                    Label Method: <b>Manual</b>
                  </p>
                  <p>
                    Delivered On: <b>May 6, 2025 at 4:45 PM</b>
                  </p>
                </div>
                <div className={styles["summaryItem__foot"]}>
                  <CustomButton
                    iconPos="left"
                    title="View Tracking Details"
                    styleType="solid"
                    icon={viewIcon}
                    onClick={() => navigate("/tracking-details", { state: { shipmentType: 'their-shipment' } })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles["summaryContent"]}>
            <h2>Escrow Summary</h2>
            <div className={styles["releaseSummary"]}>
              <h3> {shieldIcon} Escrow Summary</h3>
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
              <div className={styles["releaseSummary__foot"]}>
                <CustomButton
                  iconPos="left"
                  title="Download Escrow Receipt"
                  styleType="solid"
                  icon={receiptIcon}
                />
              </div>
            </div>
          </div>
          <div className={styles["summaryContent"]}>
            <h2>Reviews</h2>
            <div className={styles["summaryContent__row"]}>
              <div className={styles["summaryReview"]}>
                <h6>Your Review</h6>
                <div className={styles["summaryReview__rate"]}>
                  {starIcon}
                  {starIcon}
                  {starIcon}
                  {starIcon}
                  {starIcon}
                </div>
                <div className={styles["summaryReview__text"]}>
                  <p>
                    Great trading experience! Item was exactly as described and
                    shipping was fast.
                  </p>
                </div>
                <div className={styles["summaryReview__foot"]}>
                  <p>Would trade again:</p> {likeIcon}
                </div>
              </div>
              <div className={styles["summaryReview"]}>
                <h6>Their Review</h6>
                <div className={styles["summaryReview__rate"]}>
                  {starIcon}
                  {starIcon}
                  {starIcon}
                  {starIcon}
                  {starIcon}
                </div>
                <div className={styles["summaryReview__text"]}>
                  <p>
                    Smooth transaction, item arrived in perfect condition. Would
                    definitely trade again!
                  </p>
                </div>
                <div className={styles["summaryReview__foot"]}>
                  <p>Would trade again:</p> {likeIcon}
                </div>
              </div>
            </div>
          </div>
          <div className={styles["summary__foot"]}>
            <CustomButton
              iconPos="left"
              title="Download Summary (PDF)"
              styleType="solid"
              icon={downloadIcon}
              onClick={() => {
                // Lógica para descargar el resumen como PDF
                alert("Download summary as PDF functionality coming soon...");
              }}
            />
            <CustomButton
              iconPos="left"
              title="Share Trade Privately"
              styleType="solid"
              icon={shareIcon}
              onClick={() => {
                // Lógica para compartir el trade privadamente
                alert("Share trade privately functionality coming soon...");
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
