import avatar from "@/assets/images/avatars/2.png";
import styles from "../trade.module.scss";
import { dislikeIcon, likeIcon, starIcon, starSolid } from "@/base/SVG";
import { TextField } from "@/components/text-field/text-field";
import { CustomButton } from "@/components/custom-button/custom-button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Review() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const navigate = useNavigate("");

  const ratings = [
    { value: 1, label: "Terrible" },
    { value: 2, label: "Poor" },
    { value: 3, label: "Okay" },
    { value: 4, label: "Good" },
    { value: 5, label: "Excellent" },
  ];

  return (
    <section className={styles["review"]}>
      <div className="auto__container">
        <div className={styles["review__inner"]}>
          <div className={styles["review__inner-title"]}>
            <h1>Leave a Review</h1>
            <p>
              Another clean trade in the books. Leave a review to build trader credibility and help the MyTradePlatform community grow.
            </p>
          </div>
          <div className={styles["reviewContent"]}>
            <h3>Your Trade with</h3>
            <div
              className={styles["reviewContent__profile"]}
              onClick={() => navigate("/user-profile")}
            >
              <div className={styles["reviewContent__avatar"]}>
                <img src={avatar} alt="avatar" />
              </div>
              <div className={styles["reviewContent__name"]}>
                <h6>GolfSwapper92</h6>
                <p>Trade: "Driver for Putter Swap"</p>
              </div>
            </div>
          </div>
          <div className={styles["reviewRate"]}>
            <h6>How would you rate your experience?</h6>
            <div className={styles["reviewRate__row"]}>
              {ratings.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRating(item.value)}
                  onMouseEnter={() => setHover(item.value)}
                  onMouseLeave={() => setHover(0)}
                  className={styles["starButton"]}
                >
                  {item.value <= (hover || rating) ? starIcon : starSolid}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <label className={styles["input__outer"]}>
            <p>Share your experience (optional)</p>
            <TextField
              row={5}
              placeholder="Great communication, item arrived as expected!"
              type="text"
            />
          </label>
          <div className={styles["reviewInfo"]}>
            <h6>Would you trade with this user again?</h6>
            <div className={styles["reviewInfo__row"]}>
              <CustomButton
                iconPos="left"
                title="Yes"
                styleType="solid"
                icon={likeIcon}
                onClick={() => alert("Would trade again: Yes")}
              />
              <CustomButton
                iconPos="left"
                title="No"
                styleType="solid"
                icon={dislikeIcon}
                onClick={() => alert("Would trade again: No")}
              />
            </div>
          </div>
          <div className={styles["reviewFoot"]}>
            <CustomButton
              title="Skip Review"
              styleType="solid"
              onClick={() => navigate("/trade/escrow-release")}
            />
            <CustomButton
              title="Submit Review"
              styleType="primary"
              onClick={() => navigate("/trade/escrow-release")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
