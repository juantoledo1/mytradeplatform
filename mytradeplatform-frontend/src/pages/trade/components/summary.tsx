import { editIcon, shieldIcon } from "@/base/SVG";
import styles from "../trade.module.scss";
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
export default function Summary() {
  return (
    <section className={styles["overview"]}>
      <div className="auto__container">
        <div className={styles["overview__inner"]}>
          <div className={styles["confirmContent"]}>
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
              <button type="button" className={styles["confirmContent__edit"]} onClick={() => alert("Edit items functionality coming soon...")}>
                <span>{editIcon}</span>
                Edit
              </button>
            </div>
            <div className={styles["confirmContent__row"]}>
              {confirmList.map((item, index) => {
                return <ConfirmItem {...item} key={index} />;
              })}
            </div>
            <div className={styles["confirmContent__note"]}>
              <p>
                <b>Trade Balancing:</b>
                You'll pay $40 additional to balance this trade
              </p>
            </div>
          </div>
          <div className={styles["confirmContent"]}>
            <div className={styles["confirmContent__info"]}>
              <h5>Shipping Details</h5>
              <button type="button" className={styles["confirmContent__edit"]} onClick={() => alert("Edit shipping details functionality coming soon...")}>
                <span>{editIcon}</span>
                Edit
              </button>
            </div>
            <div className={styles["confirmDetails"]}>
              <div className={styles["confirmDetails__col"]}>
                <h6>Shipping Method</h6>
                <p>Pirate Ship</p>
              </div>
              <div className={styles["confirmDetails__col"]}>
                <h6>Carrier</h6>
                <p>USPS</p>
              </div>
              <div className={styles["confirmDetails__col"]}>
                <h6>Estimated Delivery</h6>
                <p>3-5 business days</p>
              </div>
            </div>
          </div>
          <div className={styles["confirmContent"]}>
            <div className={styles["confirmContent__info"]}>
              <h5>Escrow Details</h5>
              <button type="button" className={styles["confirmContent__edit"]} onClick={() => alert("Edit escrow details functionality coming soon...")}>
                <span>{editIcon}</span>
                Edit
              </button>
            </div>
            <div className={styles["setupDetails"]}>
              <h3> {shieldIcon} Protected by Trustap Escrow</h3>
              <div className={styles["setupDetails__row"]}>
                <p>Item Value:</p>
                <p>$265</p>
              </div>
              <div className={styles["setupDetails__row"]}>
                <p>Escrow Fee (3%):</p>
                <p>$7.95</p>
              </div>
              <div className={styles["setupDetails__total"]}>
                <p>Total Deposit:</p>
                <p>$272.95</p>
              </div>
              <div className={styles["confirmContent__note"]}>
                <p>
                  Escrow Status: <b>Pending</b>
                </p>
              </div>
            </div>
          </div>
          <div className={styles["confirmContent"]}>
            <div className={styles["confirmContent__info"]}>
              <h5>Contact & Shipping Info</h5>
              <button type="button" className={styles["confirmContent__edit"]} onClick={() => alert("Edit contact information functionality coming soon...")}>
                <span>{editIcon}</span>
                Edit
              </button>
            </div>
            <div className={styles["confirmContact"]}>
              <div className={styles["confirmContact__col"]}>
                <h6>GolfSwapper92</h6>
                <p>user@example.com</p>
                <p>(555) 123-4567</p>
              </div>
              <div className={styles["confirmContact__col"]}>
                <h6>Shipping Address</h6>
                <p>
                  <b>123 Main Street</b>
                </p>
                <p>
                  <b>Apt 4B</b>
                </p>
                <p>
                  <b>Portland, OR 97201</b>
                </p>
              </div>
              <div className={styles["confirmContent__note"]}>
                <p>
                  <b>Note:</b>
                  Contact and shipping details will only be shared after both
                  parties confirm the trade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
