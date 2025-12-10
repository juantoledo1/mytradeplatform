import type { Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
import { motion } from "framer-motion";
import ReactDom from "react-dom";
import styles from "./modal.module.scss";
import { closeIcon } from "../../base/SVG";

interface ModalProps {
  title: string;
  text?: string;
  setModal: Dispatch<SetStateAction<string | null>>;
  children?: ReactNode;
}

const portalId = "popups";

const Modal = ({ title, text, setModal, children }: ModalProps) => {
  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      setModal(null);
    }
  };

  const handleCloseClick = () => setModal(null);

  const portalTarget = document.getElementById(portalId);

  if (!portalTarget) {
    console.error(`No element with ID '${portalId}' found in the DOM.`);
    return null;
  }

  return ReactDom.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0 }}
      className={styles["modal"]}
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        exit={{ opacity: 0, x: 0 }}
        className={styles["modal__inner"]}
      >
        <div className={styles["modal__head"]}>
          <div className={styles["modal__head-title"]}>{title}</div>
          {text && <div className={styles["modal__head-text"]}>{text}</div>}
          <button
            onClick={handleCloseClick}
            type="button"
            className={styles["modal__head-close"]}
          >
            {closeIcon}
          </button>
        </div>
        <div className={styles["modal__body"]}>{children ?? "No content available"}</div>
      </motion.div>
    </motion.div>,
    portalTarget
  );
};

export { Modal };
