import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
  checkIcon,
  cubeIcon,
  flagIcon,
  messageIcon,
  shieldIcon,
  starSolid,
} from "@/base/SVG";
import styles from "../notifications.module.scss";

export type FilterId =
  | "all"
  | "shipping"
  | "escrow"
  | "messages"
  | "reviews"
  | "disputes"
  | "trades";

interface FilterProps {
  activeFilter: FilterId;
  setActiveFilter: Dispatch<SetStateAction<FilterId>>;
  newNotificationsCount: number;
}

export default function Filter({
  activeFilter,
  setActiveFilter,
  newNotificationsCount,
}: FilterProps) {
  const filters: Array<{
    id: FilterId;
    label: string;
    icon?: ReactNode;
    count?: number;
  }> = [
    { id: "all", label: "All", count: newNotificationsCount },
    { id: "shipping", label: "Shipping", icon: cubeIcon },
    { id: "escrow", label: "Escrow", icon: shieldIcon },
    { id: "messages", label: "Messages", icon: messageIcon },
    { id: "reviews", label: "Reviews", icon: starSolid },
    { id: "disputes", label: "Disputes", icon: flagIcon },
    { id: "trades", label: "Trades", icon: checkIcon },
  ];

  return (
    <div className={styles["filter"]}>
      <div className={styles["filter__row"]}>
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            className={activeFilter === filter.id ? styles["active"] : ""}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.icon}
            {filter.label}
            {filter.count && filter.id === "all" && filter.count > 0 && (
              <span>{filter.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

