import { useEffect, useRef } from 'react';
import styles from "../landing.module.scss";

export default function Count() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const counter = (el, duration = 700) => {
      const start = 0;
      const end = parseInt(el.textContent, 10);
      if (start === end) return;
      const range = end - start;
      let current = start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / range));
      const timer = setInterval(() => {
        current += increment;
        el.textContent = current;
        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    const handleScroll = () => {
      if (sectionRef.current) {
        const elementTop = sectionRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          const countItems = sectionRef.current.querySelectorAll(`.${styles["countItem"]} span`);
          countItems.forEach(span => {
            counter(span);
          });
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={styles["count"]} ref={sectionRef}>
      <div className="auto__container big">
        <div className={styles["count__inner"]}>
          <div className={styles["countItem"]}>
            <h3>
              {/*<span>+</span>*/}➕
            </h3>
            <p>New users joining everyday. Become part of the community</p>
          </div>
          <div className={styles["countItem"]}>
            <h3>
              ↔️
            </h3>
            <p>Start a direct trade with another user or post your gear to the marketplace</p>
          </div>
          <div className={styles["countItem"]}>
            <h3>
              ✅
            </h3>
            <p>Complete trades. Build your credibility. Rack up trade stats</p>
          </div>
        </div>
      </div>
    </section>
  );
}