import classNames from "classnames";
import { secureIcon } from "@/base/SVG";
import { FormField } from "@/components/form-field/form-field";
import styles from "../steps.module.scss";
import userIcon from "@/assets/images/icons/user.png";
import boxIcon from "@/assets/images/icons/box.png";
import { carrierList, countryList } from "@/constants/modul";
import CustomSelect from "@/components/custom-select/custom-select";

export default function Step3() {
  return (
    <div className={styles["details"]}>
      {/*<div className={styles["details__title"]}>
        <span>
          <img src={userIcon} alt="user" />
        </span>
        <h5>Personal Information</h5>
      </div>
      <div className={styles["details__row"]}>
        <label className={styles["input__outer"]}>
          <p>Display Name</p>
          <FormField placeholder="How other traders will see you" type="text" />
        </label>
        <label className={styles["input__outer"]}>
          <p>Email Address</p>
          <FormField placeholder="your@email.com" type="email" />
        </label>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>
            Phone Number <b>(Optional)</b>
          </p>
          <FormField placeholder="For delivery issues only" type="text" />
          <p>Only shared after trade is confirmed</p>
        </label>
      </div>*/}
      <div className={styles["details__title"]}>
        <span>
          <img src={boxIcon} alt="box" />
        </span>
        <h5>Shipping Address</h5>
      </div>
      <div className={styles["details__row"]}>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>Address Line 1</p>
          <FormField placeholder="Street address" type="text" />
        </label>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>
            Address Line 2 <b>(Optional)</b>{" "}
          </p>
          <FormField placeholder="Apartment, suite, unit, etc." type="text" />
        </label>
        <label className={classNames(styles["input__outer"], styles["w-50"])}>
          <p>City</p>
          <FormField type="text" />
        </label>
        <label className={classNames(styles["input__outer"], styles["w-25"])}>
          <p>State/Province</p>
          <FormField type="text" />
        </label>
        <label className={classNames(styles["input__outer"], styles["w-25"])}>
          <p>Zip/Postal Code</p>
          <FormField type="text" />
        </label>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>Country</p>
          <div className={styles["input"]}>
            <CustomSelect list={countryList} selected={countryList[0]} />
          </div>
          <p>
            This will only be shared with your trade partner after both parties
            confirm the trade.
          </p>
        </label>
      </div>
      <div className={styles["details__title"]}>
        <span>
          <img src={boxIcon} alt="box" />
        </span>
        <h5>Shipping Preferences</h5>
      </div>
      <div className={styles["details__row"]}>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>
            Preferred Shipping Carrier <b>(Optional)</b>
          </p>
          <div className={styles["input"]}>
            <CustomSelect list={carrierList} selected={carrierList[0]} />
          </div>
          <p className={styles["sm"]}>
            For Quick Trade only — Vault Trade uses Pirate Ship/Shippo
          </p>
        </label>
      </div>
      <div className={styles["vault"]}>
        <div className={styles["vault__icon"]}>{secureIcon}</div>
        <div className={styles["vault__text"]}>
          <h6>Your data is secure</h6>
          <p>
            Your information is kept private and encrypted. It will only be
            shared with your trade partner after both parties confirm the trade.
          </p>
        </div>
      </div>
    </div>
  );
}
