import classNames from "classnames";
import {
  arrowLeft,
  checkCircle,
  checkIcon,
  closeIcon,
  padlockIcon,
  shieldIcon,
  truckIcon,
  userIcon,
  viewIcon,
} from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../trade.module.scss";
import avatar from "@/assets/images/avatars/2.png";
import image1 from "@/assets/images/offer/1.png";
import image2 from "@/assets/images/offer/2.png";
import { useEffect, useRef, useState } from "react";

const offerList = [
  {
    id: "1",
    initials: "TM",
    avatar: avatar,
    image: image1,
    name: "Their Item",
    title: "TaylorMade SIM2 Driver",
    subtitle: "Drivers",
    text: "Great condition TaylorMade SIM2 driver with headcover. 10.5° loft, stiff shaft.",
    condition: "Good",
    value: "$225",
  },
  {
    id: "2",
    initials: "ME",
    image: image2,
    name: "Your Item",
    title: "Scotty Cameron Newport Putter",
    subtitle: "Putters",
    text: "Scotty Cameron Newport putter, 34 inches. Minor wear on face.",
    condition: "Very Good",
    value: "$265",
  },
];
export default function Offer() {
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const slideRef = useRef(null);

  useEffect(() => {
    if (isSliding) {
      window.addEventListener("mousemove", handleSlideMove);
      window.addEventListener("mouseup", handleSlideEnd);
      return () => {
        window.removeEventListener("mousemove", handleSlideMove);
        window.removeEventListener("mouseup", handleSlideEnd);
      };
    }
  }, [isSliding]);

  const handleSlideStart = (e) => {
    e.preventDefault();
    setIsSliding(true);
  };

const handleSlideMove = (e) => {
  if (!isSliding || !slideRef.current) return;

  const slideWidth = slideRef.current.offsetWidth;
  const iconWidth = 40;
  const padding = 8;
  const maxSlideDistance = slideWidth - iconWidth - padding * 2;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const rect = slideRef.current.getBoundingClientRect();
  
  let progress = (clientX - rect.left - iconWidth / 2 - padding) / maxSlideDistance;
  progress = Math.max(0, Math.min(1, progress));
  
  setSlideProgress(progress);

  if (progress >= 0.95) {
    handleAcceptTrade();
  }
};

  const handleSlideEnd = () => {
    if (slideProgress < 0.95) {
      setSlideProgress(0);
    }
    setIsSliding(false);
  };

  const handleAcceptTrade = () => {
    setIsAccepted(true);
    setSlideProgress(1);
  };
  
  return (
    <section className={styles["offer"]}>
      <div className="auto__container">
        <div className={styles["offer__inner"]}>
          <div className={styles["offerTop"]}>
            <div className={styles["offerTop__title"]}>
              <div className={styles["offerTop__tags"]}>
                <div className={styles["offerTop__status"]}>
                  Pending Your Action
                </div>
                <div className={styles["offerTop__type"]}>
                  {shieldIcon}
                  Vault Trade
                </div>
              </div>
              <h1>Trade Offer from GolfSwapper92</h1>
              <p>"Driver for Putter Swap"</p>
            </div>
            <CustomButton
              iconPos="left"
              title="View Sender Profile"
              styleType="solid"
              icon={userIcon}
              size="sm"
              onClick={() => window.location.href = "/user-profile"}
            />
          </div>
          <div className={styles["offerContent"]}>
            <h3>Item Comparison</h3>
            <div className={styles["offerContent__row"]}>
              {offerList.map((item, index) => {
                return <OfferItem {...item} key={index} />;
              })}
            </div>
            <div className={styles["offerInfo"]}>
              <h4> {checkCircle} Trade Balancing Included</h4>
              <h6>
                <b>GolfSwapper92 </b>
                will pay you <b>$40 </b> to balance the trade.
              </h6>
              <p>This amount will be handled through the escrow process.</p>
            </div>
          </div>
          <div className={styles["offer__row"]}>
            <div className={styles["offerCol"]}>
              <h3>
                {truckIcon}
                Shipping Details
              </h3>
              <div className={styles["offerCol__detail"]}>
                <h6>Shipping Method</h6>
                <p>Pirate Ship</p>
              </div>
              <div className={styles["offerCol__detail"]}>
                <h6>Carrier</h6>
                <p>USPS</p>
              </div>
              <div className={styles["offerCol__detail"]}>
                <h6>Estimated Delivery</h6>
                <p>3-5 business days</p>
              </div>
              <div className={styles["offerCol__note"]}>
                <p>
                  <b>Note: </b>
                  Shipping information will be shared after both parties accept
                  the trade.
                </p>
              </div>
            </div>
            <div className={styles["offerCol"]}>
              <h3>
                {shieldIcon}
                Escrow Protection
              </h3>
              <div className={styles["offerCol__text"]}>
                <p>
                  This trade is protected by Trustap Escrow. If you accept,
                  you'll need to make a deposit for:
                </p>
              </div>
              <div className={styles["offerCol__row"]}>
                <p>Item Value:</p>
                <p>$265</p>
              </div>
              <div className={styles["offerCol__row"]}>
                <p>Escrow Fee (3%):</p>
                <p>$7.95</p>
              </div>
              <div className={styles["offerCol__total"]}>
                <p>Total Deposit:</p>
                <p>$272.95</p>
              </div>
              <div className={styles["offerCol__note"]}>
                <p>
                  <b>How It Works:</b>
                  Both parties deposit the value of their items in escrow. After
                  confirmed delivery, the deposits are released to the opposite
                  party.
                </p>
                <p>
                  <b>Peace of Mind:</b>
                  If the item isn't as described, you can open a dispute with
                  photos.
                </p>
                <a href="#">Learn more about Trustap protection {viewIcon}</a>
              </div>
            </div>
          </div>
          <div className={styles["offerFoot"]}>
            <div className={styles["offerFoot__back"]}>
              <CustomButton
                iconPos="left"
                title="Back to Dashboard"
                styleType="solid"
                icon={arrowLeft}
                onClick={() => window.location.href = "/dashboard"}
              />
            </div>
            <div className={styles["offerFoot__side"]}>
              <CustomButton
                iconPos="left"
                title="Decline Trade"
                styleType="delete"
                icon={closeIcon}
                onClick={() => alert("Decline trade functionality coming soon...")}
              />
              <div
                className={classNames(styles["slide"], {
                  [styles["active"]]: isAccepted,
                })}
                ref={slideRef}
                onMouseDown={handleSlideStart}
                onTouchStart={handleSlideStart}
                onTouchMove={handleSlideMove}
                onTouchEnd={handleSlideEnd}
              >
                <div
                  className={styles["slide__icon"]}
                  style={{
                    transform: isAccepted
                      ? `translateX(${slideRef.current?.offsetWidth - 48}px)`
                      : `translateX(${
                          slideProgress * (slideRef.current?.offsetWidth - 48)
                        }px)`,
                    opacity: isAccepted ? 1 : 1 - slideProgress * 0.7,
                  }}
                >
                  {isAccepted ? checkIcon : padlockIcon}
                </div>
                <p
                  style={{
                    opacity: isAccepted ? 1 : 1 - slideProgress,
                    transform: `translateX(${
                      isAccepted ? 0 : slideProgress * 20
                    }px)`,
                  }}
                >
                  {isAccepted ? "Trade Accepted!" : "Slide to accept trade"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
const OfferItem = (props) => {
  return (
    <div className={styles["offerItem"]}>
      <div className={styles["offerItem__profile"]}>
        <div className={styles["offerItem__avatar"]}>
          {props.avatar ? (
            <img src={props.avatar} alt="avatar" />
          ) : (
            <b>{props.initials}</b>
          )}
        </div>
        <h5>{props.name}</h5>
      </div>
      <div className={styles["offerItem__inner"]}>
        <div className={styles["offerItem__image"]}>
          <img src={props.image} alt="golf player" />
        </div>
        <div className={styles["offerItem__content"]}>
          <div className={styles["offerItem__title"]}>
            <h4>{props.title}</h4>
            <p>{props.subtitle}</p>
          </div>
          <div className={styles["offerItem__text"]}>
            <p>{props.text}</p>
          </div>
          <div className={styles["offerItem__row"]}>
            <p>
              <b>Condition:</b>
              {props.condition}
            </p>
            <p>
              <b>Value:</b>
              {props.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
