import Filters from "./components/filters";
import Head from "./components/head";
import Main from "./components/main";
import Stats from "./components/stats";
import styles from "./my-trades.module.scss";

export default function MyTrades() {
  return (
    <section className={styles["trades"]}>
      <div className="auto__container">
        <div className={styles["trades__inner"]}>
          <div className={styles["trades__inner-side"]}>
            <Stats />
            <Filters />
          </div>
          <div className={styles["trades__inner-main"]}>
            <Head />
            <Main />
          </div>
        </div>
      </div>
    </section>
  );
}
