import { motion } from "framer-motion";

import {
  arrowDiagonal,
  dislikeIcon,
  likeIcon,
  starIcon,
  starSolid,
} from "@/base/SVG";
import type { UserProfile, UserReview } from "@/types";
import styles from "../profile.module.scss";

interface ReviewsProps {
  userData: UserProfile;
}

const totalStars = 5;

const ReviewsItem = ({
  from_profile_pic,
  title,
  create_ts,
  rating,
  description,
  link,
  linkText,
  would_trade_again,
}: UserReview) => {
  const activeStars = Math.floor(rating);
  const isPerfectScore = rating === 5;

  return (
    <div className={styles["reviewsItem"]}>
      <div className={styles["reviewsItem__main"]}>
        <div className={styles["reviewsItem__avatar"]}>
          <img src={from_profile_pic} alt="avatar" />
        </div>
        <div className={styles["reviewsItem__content"]}>
          <div className={styles["reviewsItem__row"]}>
            <div className={styles["reviewsItem__title"]}>
              <h6>{title}</h6>
              <p>{create_ts}</p>
            </div>
            <div className={styles["reviewsItem__rate"]}>
              <div className={styles["reviewsItem__stars"]}>
                {Array.from({ length: totalStars }).map((_, index) => {
                  const shouldBeActive =
                    index < activeStars || (index === totalStars - 1 && isPerfectScore);
                  return (
                    <span key={index}>
                      {shouldBeActive ? starIcon : starSolid}
                    </span>
                  );
                })}
              </div>
              <p>{rating.toFixed(1)}</p>
            </div>
          </div>
          <div className={styles["reviewsItem__text"]}>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className={styles["reviewsItem__foot"]}>
        {link && linkText ? (
          <a href={link} className={styles["reviewsItem__link"]}>
            {linkText}
            {arrowDiagonal}
          </a>
        ) : (
          <span className={styles["reviewsItem__link"]}>No trade link provided</span>
        )}
        <div className={styles["reviewsItem__info"]}>
          <p>Would trade again:</p>
          {would_trade_again ? (
            <span className={styles["like"]}>{likeIcon}</span>
          ) : (
            <span className={styles["dislike"]}>{dislikeIcon}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Reviews({ userData }: ReviewsProps) {
  const reviews = userData.reviewsReceived ?? [];

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        exit={{ opacity: 0, x: 0 }}
        className={styles["reviews"]}
      >
        <div className={styles["reviews__empty"]}>
          <h3>No reviews yet</h3>
          <p>This user has not received any reviews yet.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0, x: 0 }}
      className={styles["reviews"]}
    >
      {reviews.map((item) => (
        <ReviewsItem key={item.id} {...item} />
      ))}
    </motion.div>
  );
}
