import { trustList } from "../../../constants/modul";
import styles from "../landing.module.scss";

export default function Trust() {
  return (
    <section className={styles["trust"]}>
      <div className={styles["trust__bg"]}></div>
      <div className="auto__container">
        <div className={styles["trust__inner"]}>
          <div className={styles["trust__inner-title"]}>
            <h2>Built for Trust & Safety</h2>
            <p className="lg">
              Every feature is designed with security at its core, giving you
              complete peace of mind.
            </p>
          </div>
          <div className={styles["trust__inner-row"]}>
            {trustList.map((item, index) => {
              return <TrustItem {...item} key={index} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
const TrustItem = (props) => {
  return (
    <div className={styles["trustItem"]}>
      <div className={styles["trustItem__icon"]}>{props.icon}</div>
      <h4>{props.title}</h4>
      <p>{props.text}</p>
    </div>
  );
};
