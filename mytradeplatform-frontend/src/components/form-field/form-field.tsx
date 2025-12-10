import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";
import styles from "./form-field.module.scss";

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
  errorText?: string;
  icon?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const FormField = ({
  error = false,
  errorText,
  value,
  type = "text",
  placeholder = "",
  onChange,
  disabled = false,
  icon,
  className,
  ...inputProps
}: FormFieldProps) => {
  return (
    <div
      className={classNames(
        styles["input"],
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
      {error && errorText && <p className={styles["error"]}>{errorText}</p>}
    </div>
  );
};
