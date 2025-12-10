import { arrowTop, dollarIcon, infoIcon } from "@/base/SVG";
import { FormField } from "@/components/form-field/form-field";
import { TextField } from "@/components/text-field/text-field";
import styles from "../steps.module.scss";
import placeholder from "@/assets/images/placeholder.png";

const reviewList = [
  {
    id: "1",
    initials: "YU",
    name: "You",
    image: placeholder,
    title: "Ping G430 Driver Head",
    text: "Excellent condition, minor scratch on sole. Includes headcover.",
    value: "$225",
    category: "Driver Heads",
    weight: "0.8 lbs",
    dimensions: `5 x 4 x 3"`,
  },
  {
    id: "1",
    initials: "GT",
    name: "GolfTrader22",
    rate: "4.9",
    trades: "12",
    image: placeholder,
    title: "Ping G430 Driver Head",
    text: "Excellent condition, minor scratch on sole. Includes headcover.",
    value: "$225",
    category: "Driver Heads",
    weight: "0.8 lbs",
    dimensions: `5 x 4 x 3"`,
  },
];
export default function Step4() {
  return (
    <div className={styles["review"]}>
      <div className={styles["review__row"]}>
        {reviewList.map((item, index) => {
          return <ReviewItem {...item} key={index} />;
        })}
      </div>
      <div className={styles["reviewInfo"]}>
        <div className={styles["reviewInfo__title"]}>
          <span>{arrowTop}</span>
          <h5>Trade Value Imbalance</h5>
        </div>
        <p>
          Your item is estimated <b>$40 </b> higher than GolfTrader22's item.
        </p>
      </div>
      <div className={styles["reviewContent"]}>
        <div className={styles["reviewContent__title"]}>
          <span>💰</span>
          <h2> Cash Top-Up Option</h2>
          <button type="button" onClick={(e) => {
            e.preventDefault();
            alert("Cash Top-Up Option: You can request additional money from the other user to balance the trade value difference.");
          }}>{infoIcon}</button>
        </div>
        <div className={styles["reviewContent__text"]}>
          <p>
            You can request a cash top-up from GolfTrader22 to balance this
            trade.
          </p>
        </div>
        <div className={styles["reviewContent__row"]}>
          <button type="button" onClick={() => alert("Selected: Split the difference ($40)")}>
            <input type="radio" name="difference" />
            <span>Split the difference ($40)</span>
          </button>
          <button type="button" onClick={() => alert("Selected: 75% ($30)")}>
            <input type="radio" name="difference" />
            <span>75% ($30)</span>
          </button>
          <button type="button" onClick={() => alert("Selected: 50% ($20)")}>
            <input type="radio" name="difference" />
            <span>50% ($20)</span>
          </button>
        </div>
        <label className={styles["input__outer"]}>
          <p>Custom Amount</p>
          <FormField
            icon={dollarIcon}
            placeholder="Enter amount"
            type="number"
          />
        </label>
      </div>
      <div className={styles["review__foot"]}>
        <label className={styles["input__outer"]}>
          <p>Nickname for this trade <b>(Optional)</b></p>
          <TextField
            row={3}
            placeholder="e.g., Driver for Putter Swap"
            type="text"
          />
          <p>
            Will be displayed on your dashboard for easy reference
          </p>
        </label>
      </div>
    </div>
  );
}
const ReviewItem = (props) => {
  return (
    <div className={styles["reviewItem"]}>
      <div className={styles["reviewItem__profile"]}>
        <div className={styles["reviewItem__avatar"]}>
          {props.avatar ? (
            <img src={props.avatar} alt="avatar" />
          ) : (
            <b>{props.initials}</b>
          )}
        </div>
        <div className={styles["reviewItem__name"]}>
          <h6>{props.name}</h6>
          {props.rate ? (
            <div className={styles["reviewItem__rate"]}>
              <p>★ {props.rate}</p>
              <p>•</p>
              <p>{props.trades} trades</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={styles["reviewItem__image"]}>
        <img src={props.image} alt="review" />
      </div>
      <div className={styles["reviewItem__content"]}>
        <h3>{props.title}</h3>
        <div className={styles["reviewItem__text"]}>
          <p>{props.text}</p>
        </div>
        <div className={styles["reviewItem__row"]}>
          <p>
            Value: <b>{props.value}</b>
          </p>
          <p>
            Category: <b>{props.category}</b>
          </p>
        </div>
        <div className={styles["reviewItem__row"]}>
          <p>
            Weight: <b>{props.weight}</b>
          </p>
          <p>
            Dimensions: <b>{props.dimensions}</b>
          </p>
        </div>
      </div>
    </div>
  );
};
