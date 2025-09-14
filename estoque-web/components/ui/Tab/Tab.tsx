"use client";

import React from "react";
import Link from "next/link";
import "./Tab.css";

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
    <div className={`tab-container button ${className || ""}`}>
      {items.map((item) => {
        const isSelected = selectedTab === item.id;

        return (
          <Link
            key={item.id}
            href={item.url}
            className={`tab-item ${isSelected ? "tab-selected" : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="tab-label">{item.label}</span>
            {isSelected && <div className="tab-indicator" />}
          </Link>
        );
      })}
    </div>
  );
};
