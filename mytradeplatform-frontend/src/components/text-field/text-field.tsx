import type { ChangeEventHandler, TextareaHTMLAttributes } from "react";
import { useState } from "react";
import styles from "./text-field.module.scss";

interface TextFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows" | "onChange"> {
  rows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

export const TextField = ({
  value,
  rows,
  placeholder = "",
  onChange,
  disabled = false,
  className,
  ...textAreaProps
}: TextFieldProps) => {
  const [expanded, setExpanded] = useState(false);

  const resolvedRows = rows ?? (expanded ? 10 : 5);

  return (
    <div className={className ?? styles["input"]}>
      <textarea
        rows={resolvedRows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={(event) => {
          setExpanded(true);
          textAreaProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          setExpanded(false);
          textAreaProps.onBlur?.(event);
        }}
        {...textAreaProps}
      />
    </div>
  );
};
