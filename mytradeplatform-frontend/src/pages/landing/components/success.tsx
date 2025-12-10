import Slider from "react-slick";
import { messageIcon, starIcon, truckIcon } from "@/base/SVG";
import styles from "../landing.module.scss";
import stars from "@/assets/images/icons/stars.png";
import starsBg from "@/assets/images/icons/starsBg.png";
import { successList } from "../../../constants/modul";

export default function Success() {
  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <section className={styles["success"]}>
      <div className={styles["success__bg"]}></div>
      <div className="auto__container">
        <div className={styles["success__inner"]}>
          <div className={styles["success__inner-title"]}>
            <h2>Success Stories</h2>
            <p className="lg">
              A showcase of secure swaps from members of the MyTradePlatform community
            </p>
          </div>
          <div className={styles["success__inner-main"]}>
            <div className={styles["success__inner-row"]}>
              {successList.map((item, index) => {
                return <SuccessItem {...item} key={index} />;
              })}
            </div>
            <Slider {...settings} className={styles["success__inner-slider"]}>
              {successList.map((item, index) => {
                return <SuccessItem {...item} key={index} />;
              })}
            </Slider>
            <div className={styles["successContent"]}>
              <div className={styles["successContent__row"]}>
                <div className={styles["successContent__info"]}>
                  <div className={styles["successContent__status"]}>
                    ✓ Trade Completed
                  </div>
                  <h6>Vault Trade</h6>
                </div>
                <p>May 15, 2025</p>
              </div>
              <div className={styles["successContent__row"]}>
                <div className={styles["successContent__info"]}>
                  <div className={styles["successContent__tag"]}>
                    <span>{truckIcon}</span>
                    <b className={styles["desc"]}>Both</b>
                    <b>Delivered</b>
                  </div>
                  <div className={styles["successContent__tag"]}>
                    <span>{messageIcon}</span>
                    <b>5</b> <b className={styles["desc"]}>Messages</b>
                    <b className={styles["mob"]}>Alerts</b>
                  </div>
                </div>
                <div className={styles["successContent__rate"]}>
                  <p>Rating:</p>
                  <div className="rate">
                    <div className="rate__range">
                      <img src={starsBg} alt="stars" />
                      <div
                        className="rate__range-progress"
                        style={{ width: `${5 * 20}%` }}
                      >
                        <img src={stars} alt="stars" />
                      </div>
                    </div>
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
const SuccessItem = (props) => {
  return (
    <div className={styles["successItem"]}>
      <div className={styles["successItem__title"]}>
        <h6>Item #{props.id}</h6>
        <h4>{props.title}</h4>
        <p>{props.text}</p>
      </div>
      <div className={styles["successItem__price"]}>
        <p>Estimated Value:</p>
        <h5>${props.price}</h5>
      </div>
      <div className={styles["successItem__profile"]}>
        <div className={styles["successItem__avatar"]}>
          {props.avatar ? <img src={props.avatar} alt="avatar" /> : "User"}
        </div>
        <div className={styles["successItem__name"]}>
          <h6>{props.name}</h6>
          <div className={styles["successItem__rate"]}>
            <span>{starIcon}</span>
            <p>
              <b>{props.rate}</b>
              <b>{props.trades}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
