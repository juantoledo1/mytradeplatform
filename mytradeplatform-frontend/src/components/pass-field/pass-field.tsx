import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import classNames from "classnames";
import { eyeIcon } from "../../base/SVG";
import styles from "./pass-field.module.scss";

interface PassFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  error?: boolean;
  errorText?: string;
  icon?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const PassField = ({
  error = false,
  errorText,
  value,
  placeholder = "",
  onChange,
  disabled = false,
  icon,
  className,
  ...inputProps
}: PassFieldProps) => {
  const [showPass, setShowPass] = useState(false);

  const togglePasswordVisibility = () => setShowPass((prev) => !prev);

  return (
    <div
      className={classNames(
        styles["input"],
        styles["pass"],
        className,
        {
          [styles.error]: error,
          [styles.uniq]: Boolean(icon),
        }
      )}
    >
      {icon && <span className={styles["input__icon"]}>{icon}</span>}
      <input
        disabled={disabled}
        type={showPass ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
      <button type="button" onClick={togglePasswordVisibility}>
        {eyeIcon}
      </button>
      {error && errorText && <p className={styles["error"]}>{errorText}</p>}
    </div>
  );
};
