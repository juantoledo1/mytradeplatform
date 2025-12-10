import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import {
  checkIcon,
  cubeIcon,
  flagIcon,
  messageIcon,
  shieldIcon,
  starSolid,
} from "@/base/SVG";
import type { Notification } from "@/types";
import styles from "../notifications.module.scss";

interface MainProps {
  notifications: Notification[];
}

type NotificationCategory =
  | "shipping"
  | "escrow"
  | "messages"
  | "reviews"
  | "disputes"
  | "trades"
  | "offer";

const iconMap: Record<NotificationCategory, ReactNode> = {
  shipping: cubeIcon,
  escrow: shieldIcon,
  messages: messageIcon,
  reviews: starSolid,
  disputes: flagIcon,
  trades: checkIcon,
  offer: messageIcon,
};

const calculateTimeDifference = (from: Date, to: Date): string => {
  const diffInMs = to.getTime() - from.getTime();
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes === 1) return "1 minute ago";
  if (diffInHours < 1) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return "1 hour ago";
  if (diffInDays < 1) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 31) return `${diffInDays} days ago`;
  if (diffInMonths === 1) return "1 month ago";
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  if (diffInYears === 1) return "1 year ago";
  return `${diffInYears} years ago`;
};

const resolveCategory = (typeName: string): NotificationCategory => {
  const normalised = typeName.toLowerCase() as NotificationCategory;
  return normalised in iconMap ? normalised : "messages";
};

const Item = ({
  marked_as_read,
  type_name,
  message,
  create_ts,
  partner,
  trade,
  link,
}: Notification) => {
  const category = resolveCategory(type_name);
  const icon = iconMap[category];
  const createdAt = new Date(create_ts);
  const timeLabel = calculateTimeDifference(createdAt, new Date());

  return (
    <Link to={link} className={styles["item__link"]}>
      <div
        className={classNames(
          styles["item"],
          !marked_as_read && styles["new"],
          styles[category]
        )}
      >
        <div className={classNames(styles["item__icon"], styles[category])}>
          {icon}
        </div>
        <div
          className={classNames(
            styles["item__content"],
            !marked_as_read && styles["sm"]
          )}
        >
          <h6>{message}</h6>
          <div className={styles["item__info"]}>
            <p>{timeLabel}</p>
            {partner && (
              <>
                <span></span>
                <p>{partner}</p>
              </>
            )}
            {trade && (
              <>
                <span></span>
                <p>{trade}</p>
              </>
            )}
          </div>
        </div>
        {!marked_as_read && <div className={styles["item__new"]}>New</div>}
      </div>
    </Link>
  );
};

export default function Main({ notifications }: MainProps) {
  if (notifications.length === 0) {
    return (
      <div className={styles["main"]}>
        <div className={styles["no__notifications"]}>
          <p>You currently have no notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["main"]}>
      {notifications.map((notification) => (
        <Item key={notification.id} {...notification} />
      ))}
    </div>
  );
}

