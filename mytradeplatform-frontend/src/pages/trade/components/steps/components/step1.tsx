import { useState } from "react";
import classNames from "classnames";
import {
  checkIcon,
  infoIcon,
  shieldIcon,
  timerIcon,
} from "@/base/SVG";
import styles from "../steps.module.scss";

const tradeTypes = [
  {
    id: "quick",
    icon: timerIcon,
    title: "Quick Trade",
    tooltip: "No escrow - trust based trading with direct shipping. Simple process designed to facilitate a smooth trade.",
    description:
      "No escrow - trust based trading with direct shipping. Simple process designed to facilitate a smooth trade.",
    features: [
      "Direct shipping (discounted labels)",
      "Best for trusted traders or low-value items",
      "No platform liability",
    ],
  },
  {
    id: "vault",
    icon: shieldIcon,
    title: "Vault Trade",
    tooltip: "Secured by escrow with funds held in The Vault until both users confirm delivery.",
    description:
      "Secured by escrow with funds held in The Vault until both users confirm delivery.",
    features: [
      "Both users deposit funds into The Vault until trade is complete",
      "Option for cash top-ups if trade is uneven",
      "Professional dispute resolution",
      "Recommended for high-value items or new traders",
    ],
  },
];

export default function Step1() {
  const [activeId, setActiveId] = useState("quick");

  return (
    <div className={styles["type"]}>
      <div className={styles["type__row"]}>
        {tradeTypes.map((trade) => (
          <div
            key={trade.id}
            className={classNames(styles["typeItem"], {
              [styles["active"]]: trade.id === activeId,
            })}
            onClick={() => setActiveId(trade.id)}
          >
            <div className={styles["typeItem__title"]}>
              <h4>
                {trade.icon}
                {trade.title}
              </h4>
              <button type="button" onClick={(e) => {
                e.preventDefault();
                alert(trade.tooltip);
              }}>
                {infoIcon}
                <span>{trade.tooltip}</span>
              </button>
            </div>
            <div className={styles["typeItem__text"]}>
              <p>{trade.description}</p>
            </div>
            <ul>
              {trade.features.map((feature, index) => (
                <li key={index}>
                  <span>{checkIcon}</span>
                  <p>{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
