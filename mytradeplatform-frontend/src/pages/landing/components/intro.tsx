import { useNavigate } from "react-router-dom";
import { arrowRight, checkCircle, energyIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../landing.module.scss";
import introImage from "@/assets/images/intro/1.webp";
import stars from "@/assets/images/intro/stars.svg";

export default function Intro() {
  const navigate = useNavigate();
  return (
    <section className={styles["intro"]}>
      <div className="auto__container big">
        <div className={styles["intro__inner"]}>
          <div className={styles["intro__inner-content"]}>
            <div className={styles["intro__inner-tag"]}>
              <span>{energyIcon}</span>
              Powered by trusted traders
            </div>
            <div className={styles["intro__inner-title"]}>
              <h1>
                Trade items <br /> with
                <span> confidence</span>
              </h1>
              <p className="big">
                The secure platform for peer-to-peer item trading. Ship
                anywhere, trade anything, protected by escrow.
              </p>
            </div>
            <div className={styles["intro__inner-buttons"]}>
              <CustomButton
                iconPos="right"
                title="Start Trading Now"
                styleType="primary"
                icon={arrowRight}
                onClick={() => navigate("/trade/steps")}
              />
              <CustomButton
                title="See How It Works"
                styleType="solid"
                onClick={() => setModal("invite-user")}
              />
            </div>
            <div className={styles["intro__inner-list"]}>
              <p>
                <span>{checkCircle}</span>
                  Easy to use
              </p>
              <p>
                <span>{checkCircle}</span>
                  Protection for both sides
              </p>
              <p>
                <span>{checkCircle}</span>
                  Global shipping
              </p>
            </div>
          </div>
          <div className={styles["intro__inner-col"]}>
            <div className={styles["introItem"]}>
              <div className={styles["introItem__image"]}>
                <img src={introImage} alt="payment" />
              </div>
              <div className={styles["introItem__content"]}>
                <div className={styles["introItem__top"]}>
                  <div className={styles["introItem__tag"]}>
                    ✓ Trade Completed
                  </div>
                  <p>2 hours ago</p>
                </div>
                <h3>L.A.B. Golf DF3 ↔ Titleist GT3</h3>
                <div className={styles["introItem__info"]}>
                  <p>$500 value</p>
                  <div className={styles["introItem__stars"]}>
                    <img src={stars} alt="stars" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
