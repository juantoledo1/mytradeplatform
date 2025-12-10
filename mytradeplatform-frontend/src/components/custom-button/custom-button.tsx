import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import classNames from "classnames";
import styles from "./custom-button.module.scss";

type ButtonStyle =
  | "primary"
  | "secondary"
  | "delete"
  | "solid"
  | "uniq"
  | "deposit";

type IconPosition = "left" | "right";

type ButtonSize = "sm";

interface CustomButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Visual style variant mapped to SCSS modifiers */
  styleType?: ButtonStyle;
  /** Primary text label rendered inside the button */
  title: string;
  /** Optional icon placement */
  iconPos?: IconPosition;
  /** Optional icon element */
  icon?: ReactNode;
  /** Optional size modifier */
  size?: ButtonSize;
  /** Click handler redefined to preserve typing after omission */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const CustomButton = ({
  styleType = "primary",
  title,
  type = "button",
  onClick,
  disabled = false,
  iconPos = "right",
  icon,
  size,
  className,
  ...buttonProps
}: CustomButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles.button,
        className,
        {
          [styles.primary]: styleType === "primary",
          [styles.secondary]: styleType === "secondary",
          [styles.delete]: styleType === "delete",
          [styles.solid]: styleType === "solid",
          [styles.uniq]: styleType === "uniq",
          [styles.deposit]: styleType === "deposit",
          [styles.left]: iconPos === "left",
          [styles.sm]: size === "sm",
          [styles.disabled]: disabled,
        }
      )}
      {...buttonProps}
    >
      {iconPos === "left" && icon}
      {title}
      {iconPos === "right" && icon}
    </button>
  );
};
