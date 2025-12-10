import { Link } from "react-router-dom";
import { arrowRight } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../landing.module.scss";
import { workList } from "../../../constants/modul";

export default function Work() {
  return (
    <section className={styles["work"]}>
      <div className={styles["work__bg"]}></div>
      <div className="auto__container">
        <div className={styles["work__inner"]}>
          <div className={styles["work__inner-title"]}>
            <h2>How MyTradePlatform Works</h2>
            <p className="lg">
              Complete your trade in three simple steps, designed for maximum
              security and convenience.
            </p>
          </div>
          <div className={styles["work__inner-row"]}>
            {workList.map((item, index) => {
              return <WorkItem {...item} key={index} />;
            })}
          </div>
          <div className={styles["work__inner-foot"]}>
            <CustomButton
              iconPos="right"
              title="Start Your First Trade"
              styleType="primary"
              icon={arrowRight}
            />
            <Link to="#" className={styles["work__inner-link"]}>
              View detailed process {arrowRight}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
const WorkItem = (props) => {
  return (
    <div className={styles["workItem"]}>
      <div className={styles["workItem__icon"]}>{props.icon}</div>
      <h4>{props.title}</h4>
      <p>{props.text}</p>
    </div>
  );
};
