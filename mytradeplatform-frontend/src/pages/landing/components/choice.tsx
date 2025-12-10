import {
  arrowRight,
  checkCircle,
  clockIcon,
  shieldIcon,
} from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../landing.module.scss";

export default function Choice() {
  return (
    <section className={styles["choice"]}>
      <div className="auto__container">
        <div className={styles["choice__inner"]}>
          <div className={styles["choice__inner-title"]}>
            <h2>Choose Your Trading Style</h2>
            <p className="lg">
              Two powerful ways to trade with the flexibility and protection
              level that suits your needs.
            </p>
          </div>
          <div className={styles["choice__inner-row"]}>
            <div className={styles["choiceItem"]}>
              <div className={styles["choiceItem__top"]}>
                <div className={styles["choiceItem__icon"]}>{clockIcon}</div>
                <div className={styles["choiceItem__name"]}>
                  <h4>Quick Trade</h4>
                  <p>Perfect for trusted partners</p>
                </div>
              </div>
              <div className={styles["choiceItem__text"]}>
                <p>
                  Fast and simple trading with people you know. Get started in
                  minutes with zero fees.
                </p>
              </div>
              <ul>
                <li>
                  <span>{checkCircle}</span>
                  <p>No fees or deposits required</p>
                </li>
                <li>
                  <span>{checkCircle}</span>
                  <p>Lightning-fast setup process</p>
                </li>
                <li>
                  <span>{checkCircle}</span>
                  <p>Discounted shipping labels</p>
                </li>
              </ul>
              <div className={styles["choiceItem__foot"]}>
                <CustomButton
                  iconPos="right"
                  title="Start Quick Trade"
                  styleType="primary"
                  icon={arrowRight}
                />
              </div>
            </div>
            <div className={styles["choiceItem"]}>
              <div className={styles["choiceItem__tag"]}>Most Popular</div>
              <div className={styles["choiceItem__top"]}>
                <div className={styles["choiceItem__icon"]}>{shieldIcon}</div>
                <div className={styles["choiceItem__name"]}>
                  <h4>Vault Trade</h4>
                  <p>Maximum security & protection</p>
                </div>
              </div>
              <div className={styles["choiceItem__text"]}>
                <p>
                  Complete protection with escrow services. Trade confidently
                  with anyone, anywhere.
                </p>
              </div>
              <ul>
                <li>
                  <span>{checkCircle}</span>
                  <p>Secure escrow protection</p>
                </li>
                <li>
                  <span>{checkCircle}</span>
                  <p>Professional dispute resolution</p>
                </li>
                <li>
                  <span>{checkCircle}</span>
                  <p>Value verification & balancing</p>
                </li>
              </ul>
              <div className={styles["choiceItem__foot"]}>
                <CustomButton
                  iconPos="right"
                  title="Start Vault Trade"
                  styleType="primary"
                  icon={arrowRight}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
