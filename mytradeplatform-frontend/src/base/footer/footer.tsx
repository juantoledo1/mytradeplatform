import { Link } from "react-router-dom";
import { facebook, instagram, twitter } from "../SVG";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles["footer"]}>
      <div className="auto__container ex">
        <div className={styles["footer__inner"]}>
          <div className={styles["footer__row"]}>
            <div className={styles["footer__col"]}>
              <div className={styles["logo"]}>
                <span>My</span>TradePlatform
              </div>
              <p>The secure platform for peer-to-peer item trading.</p>
              <div className={styles["social"]}>
                <a href="#">{facebook}</a>
                <a href="#">{instagram}</a>
                <a href="#">{twitter}</a>
              </div>
            </div>
            <div className={styles["footer__col"]}>
              <h6>Platform</h6>
              <Link to="/">How It Works</Link>
              <Link to="trade/steps">Start a Trade</Link>
              <a href="#">Safety & Security</a>
            </div>
            <div className={styles["footer__col"]}>
              <h6>Support</h6>
              <a href="#">FAQ</a>
              <a href="#">Contact Us</a>
              <a href="#">Help Center</a>
            </div>
            <div className={styles["footer__col"]}>
              <h6>Legal</h6>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className={styles["copy"]}>
            <p>© 2025 MyTradePlatform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
