import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './Tabs.module.scss';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  items: { name: string; value: string }[];
}

const Tabs: React.FC<TabsProps> = (props) => {
  const { value, onChange, className, items } = props;
  const { t } = useTranslation();

  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const changeValue = (newValue: string, event: React.MouseEvent) => {
    onChange(newValue);

    const target = event.target as HTMLDivElement;
    if (underlineRef.current && target) {
      const { offsetLeft, offsetWidth } = target;

      underlineRef.current.style.transform = `translateX(${offsetLeft}px)`;
      underlineRef.current.style.width = `${offsetWidth}px`;
    }
  };

  useEffect(() => {
    const tabsEl = tabsRef.current;
    const underlineEl = underlineRef.current;

    const indexCurrentFilter = items.findIndex(item => item.value === value);
    const filterEl = filterRefs.current[indexCurrentFilter]!;

    if (!tabsEl || !underlineEl || !filterEl) return;

    const updateUnderlinePosition = () => {
      const { offsetLeft, offsetWidth } = filterEl;
      underlineEl.style.transform = `translateX(${offsetLeft}px)`;
      underlineEl.style.width = `${offsetWidth}px`;
    };

    updateUnderlinePosition();

    const resizeObserver = new ResizeObserver(updateUnderlinePosition);
    resizeObserver.observe(tabsEl);

    return () => {
      resizeObserver.unobserve(tabsEl);
      resizeObserver.disconnect();
    };
  }, [value]);

  return (
    <div className={classNames(styles.Tabs, [className])} ref={tabsRef}>
      <div ref={underlineRef} className={styles.underline} />

      {items.map((item, index) => (
        <div
          key={item.value}
          className={classNames(styles.item, [], {
            [styles.active]: value === item.value,
          })}
          ref={(el) => (filterRefs.current[index] = el)}
          onClick={(event) => changeValue(item.value, event)}
        >
          {t(item.name) as string}
        </div>
      ))}
      {}
    </div>
  );
};

export default Tabs;
