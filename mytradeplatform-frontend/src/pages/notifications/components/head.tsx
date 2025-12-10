import { doubleCheck } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../notifications.module.scss";

interface HeadProps {
  onMarkAllAsRead: () => void | Promise<void>;
}

export default function Head({ onMarkAllAsRead }: HeadProps) {
  return (
    <div className={styles["head"]}>
      <div className={styles["head__title"]}>
        <h1 className="sm">Notifications</h1>
        <p>Stay updated on your trades and activity</p>
      </div>
      <div className={styles["head__button"]}>
        <CustomButton
          iconPos="left"
          title="Mark All as Read"
          styleType="solid"
          size="sm"
          icon={doubleCheck}
          onClick={() => {
            void onMarkAllAsRead();
          }}
        />
      </div>
    </div>
  );
}
