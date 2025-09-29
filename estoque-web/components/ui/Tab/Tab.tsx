"use client";

import React from "react";
import Link from "next/link";
import styles from "./Tab.module.css";
import { ButtonText } from "../Typograph";

interface TabItem {
  id: string;
  label: string;
  url: string; // 🔹 agora é obrigatório
}

interface TabProps {
  items: TabItem[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({
  items,
  selectedTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={`${styles["tab-container"]} ${className || ""}`}>
      {items.map((item) => {
        const isSelected = selectedTab === item.id;

        return (
          <Link
            key={item.id}
            href={item.url}
            className={`${styles["tab-item"]} ${isSelected ? styles["tab-selected"] : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <ButtonText className={styles["tab-label"]}>{item.label}</ButtonText>
            <div
              className={`${styles["tab-indicator"]} ${isSelected ? styles.active : ""}`}
            />
          </Link>
        );
      })}
    </div>
  );
};
