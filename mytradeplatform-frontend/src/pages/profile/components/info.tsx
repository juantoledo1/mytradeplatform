import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { cubeIcon, likeIcon, medalIcon, starSolid } from "@/base/SVG";
import type { UserProfile } from "@/types";
import styles from "../profile.module.scss";

interface InfoProps {
  userData: UserProfile;
}

interface InfoItemConfig {
  id: string;
  icon: ReactNode;
  title: string;
  value: string;
}

const buildInfoList = (userData: UserProfile): InfoItemConfig[] => [
  {
    id: "averageRating",
    icon: starSolid,
    title: "Average Rating",
    value: `${userData.averageRating ?? 0} / 5`,
  },
  {
    id: "totalTrades",
    icon: cubeIcon,
    title: "Total Trades",
    value: String(userData.tradeCount ?? 0),
  },
  {
    id: "wouldTradeAgain",
    icon: likeIcon,
    title: "Would Trade Again",
    value: `${userData.average_would_trade_again_percentage ?? 0}%`,
  },
  {
    id: "trustScore",
    icon: medalIcon,
    title: "Trust Score",
    value: String(userData.trustScore ?? 0),
  },
];

export default function Info({ userData }: InfoProps) {
  const infoList = buildInfoList(userData);

  return (
    <div className={styles["info"]}>
      <div className={styles["info__row"]}>
        {infoList.map((item) => (
          <InfoItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

const InfoItem = ({ icon, title, value }: InfoItemConfig) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const numericValue = parseFloat(value);

    if (Number.isNaN(numericValue)) {
      setAnimatedValue(0);
      return;
    }

    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = start + (numericValue - start) * progress;

      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const displayValue = () => {
    if (value.includes("/")) {
      const [, denominator] = value.split("/");
      return `${animatedValue.toFixed(1)} / ${denominator.trim()}`;
    }
    if (value.includes("%")) {
      return `${Math.round(animatedValue)}%`;
    }
    if (value.includes(".")) {
      return animatedValue.toFixed(1);
    }
    return Math.round(animatedValue).toString();
  };

  return (
    <div className={styles["infoItem"]}>
      <div className={styles["infoItem__icon"]}>{icon}</div>
      <p>{title}</p>
      <h4>{displayValue()}</h4>
    </div>
  );
};

