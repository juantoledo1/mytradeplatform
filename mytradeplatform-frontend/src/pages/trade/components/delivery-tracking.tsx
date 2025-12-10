import { Link, useNavigate } from "react-router-dom";
import { copyIcon, cubeIcon, truckIcon, viewIcon } from "@/base/SVG";
import styles from "../trade.module.scss";
import classNames from "classnames";
import { CustomButton } from "@/components/custom-button/custom-button";
const deliveryList = [
  {
    id: "1",
    icon: truckIcon,
    title: "Your Shipment",
    status: "In Transit",
    carrier: "USPS",
    trackNum: "9400112345678901234567",
    delivery: "May 5, 2025 at 11:00 PM",
    update: "May 3, 2025 at 2:22 PM",
  },
  {
    id: "2",
    icon: cubeIcon,
    title: "Their Shipment",
    status: "delivered",
    carrier: "USPS",
    trackNum: "1Z12345E1234567890",
    delivery: "May 4, 2025 at 5:00 PM",
    update: "May 4, 2025 at 4:45 PM",
  },
];
export default function DeliveryTracking() {
  const navigate = useNavigate("");

  return (
    <section className={styles["delivery"]}>
      <div className="auto__container">
        <div className={styles["delivery__inner"]}>
          <div className={styles["delivery__inner-title"]}>
            <h1>Delivery Tracking</h1>
            <p>Track the status of your trade shipments.</p>
          </div>
          <div className={styles["delivery__row"]}>
            {deliveryList.map((item, index) => {
              return <DeliveryItem {...item} key={index} />;
            })}
          </div>
          <div className={styles["delivery__foot"]}>
            <CustomButton
              title="Confirm Delivery"
              styleType="primary"
              onClick={() => navigate("/trade/review")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
const DeliveryItem = (props) => {
  return (
    <div className={styles["deliveryItem"]}>
      <div className={styles["deliveryItem__title"]}>
        <h3>{props.title}</h3>
        <p
          className={classNames({
            [styles.delivered]: props.status === "delivered",
          })}
        >
          {props.icon}
          {props.status}
        </p>
      </div>
      <div className={styles["deliveryItem__content"]}>
        <div className={styles["deliveryItem__row"]}>
          <p>Carrier:</p>
          <p>{props.carrier}</p>
        </div>
        <div className={styles["deliveryItem__row"]}>
          <p>Tracking Number:</p>
          <p>
            {props.trackNum} {copyIcon}
          </p>
        </div>
        <div className={styles["deliveryItem__row"]}>
          <p>Estimated Delivery:</p>
          <p>{props.delivery}</p>
        </div>
        <div className={styles["deliveryItem__row"]}>
          <p>Last Update:</p>
          <p>{props.update}</p>
        </div>
      </div>
      <div className={styles["deliveryItem__foot"]}>
        <Link to={props.link} className={styles["deliveryItem__track"]}>
          {viewIcon}
          Track Package
        </Link>
        <button type="button" className={styles["deliveryItem__report"]} onClick={() => alert("Report issue functionality coming soon...")}>
          Report Issue
        </button>
      </div>
    </div>
  );
};
