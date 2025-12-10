import { useNavigate } from "react-router-dom";
import { arrowRight } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../landing.module.scss";

export default function Join() {
  const navigate = useNavigate();

  return (
    <section className={styles["join"]}>
      <div className="auto__container">
        <div className={styles["join__inner"]}>
          <div className={styles["join__inner-title"]}>
            <h2 className="big">Ready to Start Trading Smarter?</h2>
            <p className="big">
              Join the wave of early adopters and help shape the future of online peer-to-peer trading
            </p>
          </div>
          <div className={styles["join__inner-buttons"]}>
            <CustomButton
              iconPos="right"
              title="Start Your First Trade"
              styleType="secondary"
              icon={arrowRight}
              onClick={() => navigate("/trade/steps/")}
            />
            <CustomButton title="Learn More" styleType="uniq" />
          </div>
        </div>
      </div>
    </section>
  );
}
