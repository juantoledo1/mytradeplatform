import { checkTick, editIcon, shieldIcon } from "@/base/SVG";
import styles from "../steps.module.scss";
import placeholder from "@/assets/images/placeholder.png";

const confirmList = [
  {
    id: "1",
    image: placeholder,
    price: "$225",
    title: "TaylorMade SIM2 Driver",
    text: "Great condition TaylorMade SIM2 driver with headcover. 10.5° loft, stiff shaft.",
    condition: "Good",
  },
  {
    id: "2",
    image: placeholder,
    price: "$265",
    title: "Scotty Cameron Newport Putter",
    text: "Scotty Cameron Newport putter, 34 inches. Minor wear on face.",
    condition: "Very Good",
  },
];
export default function Step6() {
  return (
    <div className={styles["confirm"]}>
      <div className={styles["confirmContent"]}>
        <div className={styles["confirmContent__title"]}>
          <h3>Trade Summary</h3>
          <p>Review all details of your trade before submitting</p>
        </div>
        <div className={styles["confirmContent__type"]}>
          <h5>Trade Type</h5>
          <div className={styles["vault"]}>
            <div className={styles["vault__icon"]}>{shieldIcon}</div>
            <div className={styles["vault__text"]}>
              <h6>Vault Trade</h6>
              <p>Trade confidently with built in escrow protection</p>
            </div>
          </div>
          <p>
            Nickname: <b>Driver for Putter Swap</b>
          </p>
        </div>
        <div className={styles["confirmContent__info"]}>
          <h5>Items Being Traded</h5>
          <button type="button" className={styles["confirmContent__edit"]} onClick={() => alert("Edit functionality coming soon...")}>
            <span>{editIcon}</span>
            Edit
          </button>
        </div>
        <div className={styles["confirmContent__row"]}>
          {confirmList.map((item, index) => {
            return <ConfirmItem {...item} key={index} />;
          })}
        </div>
      </div>
      <div className={styles["confirmContent"]}>
        <div className={styles["confirmContent__title"]}>
          <h3>Terms & Agreement</h3>
        </div>
        {/* attention!! before checked next button must be disabled */}
        <label className={styles["check"]}>
          <div className={styles["check__box"]}>
            <input type="checkbox" />
            <span>{checkTick}</span>
          </div>
          <p>
            <b>
              I confirm that all item details are accurate, and I agree to the
              MyTradePlatform Terms of Use.
            </b>
          </p>
        </label>
        <label className={styles["check"]}>
          <div className={styles["check__box"]}>
            <input type="checkbox" />
            <span>{checkTick}</span>
          </div>
          <p>
            <b>
              I agree to use escrow via Trustap and understand that funds will
              be released after confirmed delivery or dispute timeout.
            </b>
          </p>
        </label>
      </div>
    </div>
  );
}
const ConfirmItem = (props) => {
  return (
    <div className={styles["confirmItem"]}>
      <div className={styles["confirmItem__top"]}>
        <h4>Your Item</h4>
        <p>{props.price}</p>
      </div>
      <div className={styles["confirmItem__row"]}>
        <div className={styles["confirmItem__image"]}>
          <img src={props.image} alt="item" />
        </div>
        <div className={styles["confirmItem__name"]}>
          <h5>{props.title}</h5>
          <p>{props.text}</p>
        </div>
      </div>
      <div className={styles["confirmItem__foot"]}>
        <p>Condition: {props.condition}</p>
      </div>
    </div>
  );
};
