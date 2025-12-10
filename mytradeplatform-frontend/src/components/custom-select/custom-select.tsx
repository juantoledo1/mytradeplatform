import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { chevronBottom } from "@/base/SVG";
import styles from "./custom-select.module.scss";

type SelectOptionKey = string | number;

export interface SelectOption {
  id?: SelectOptionKey;
  value: string;
  icon?: ReactNode;
  [key: string]: unknown;
}

interface CustomSelectProps {
  selected?: SelectOption | null;
  list: SelectOption[];
  comparisonKey?: string;
  onChange?: (option: SelectOption) => void;
}

const CustomSelect = ({
  selected = null,
  list,
  comparisonKey = "value",
  onChange,
}: CustomSelectProps) => {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [currentList, setCurrentList] = useState<SelectOption[]>(list);
  const [currentSelected, setCurrentSelected] = useState<SelectOption | null>(
    selected
  );

  const handleSelect = (item: SelectOption) => {
    setCurrentSelected(item);
    onChange?.(item);
    setActive(false);
  };

  const toggleActive = () => {
    setActive((prev) => !prev);
  };

  useEffect(() => {
    setCurrentList(
      !currentSelected
        ? list
        : list.filter((item) => {
            const key = comparisonKey;
            return item[key] !== currentSelected[key];
          })
    );
  }, [list, currentSelected, comparisonKey]);

  useEffect(() => {
    setCurrentSelected(selected ?? null);
  }, [selected]);

  useEffect(() => {
    const handleWindowClick = ({ target }: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(target as Node)) {
        setActive(false);
      }
    };

    if (active) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }

    return () => window.removeEventListener("click", handleWindowClick);
  }, [active]);

  return (
    <div
      className={classNames(styles["select"], {
        [styles.active]: active,
      })}
      ref={wrapper}
    >
      <div className={styles["select__selected"]} onClick={toggleActive}>
        {currentSelected ? currentSelected.value : "---"}
        {chevronBottom}
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0, y: 10 }}
            className={styles["select__options"]}
          >
            {currentList.map((item) => (
              <div
                className={styles["select__option"]}
                key={String(item.id ?? item.value)}
                onClick={() => handleSelect(item)}
              >
                {item.value}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
