import { attachIcon, closeIcon, expandIcon, sendIcon } from "@/base/SVG";
import styles from "../browse.module.scss";
import avatar from "@/assets/images/avatars/1.png";
import placeholder from "@/assets/images/placeholder.png";
import { motion } from "framer-motion";

export default function StartChat({ showChat, setShowChat }) {
  const closeFunc = (e) => {
    if (e.currentTarget === e.target) setShowChat(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0 }}
      className={styles["singleChat"]}
      onClick={closeFunc}
    >
      <div className={styles["singleChat__inner"]}>
        <div className={styles["singleChat__buttons"]}>
          <button type="button" onClick={() => alert("Expand chat functionality coming soon...")}>{expandIcon}</button>
          <button type="button" onClick={() => setShowChat(false)}>
            {closeIcon}
          </button>
        </div>
        <div className={styles["singleChat__top"]}>
          <div className={styles["singleChat__profile"]}>
            <div className={styles["singleChat__avatar"]}>
              <img src={avatar} alt="avatar" />
            </div>
            <div className={styles["singleChat__name"]}>
              <h6>GolfPro92</h6>
              <div className={styles["singleChat__info"]}>
                <span>Online</span>
                <p>Re: TaylorMade SIM2</p>
              </div>
            </div>
          </div>
          <div className={styles["singleChat__item"]}>
            <span>
              <img src={placeholder} alt="avatar" />
            </span>
            <p>TaylorMade SIM2 Driver</p>
          </div>
        </div>
        <div className={styles["singleChat__body"]}></div>
        <div className={styles["singleChat__foot"]}>
          <div className={styles["input"]}>
            <input
              type="text"
              defaultValue={"Hello"}
              placeholder="Type a message..."
            />
          </div>
          <button type="button" className={styles["singleChat__attach"]} onClick={() => alert("File attachment functionality coming soon...")}>
            {attachIcon}
          </button>
          <button type="button" className={styles["singleChat__send"]} onClick={() => alert("Sending message functionality coming soon...")}>
            {sendIcon}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
