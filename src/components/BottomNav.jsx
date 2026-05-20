import React from "react";
import { Gift, History, House, SendHorizontal } from "lucide-react";

const icons = {
  home: <House className="icon" size={16} strokeWidth={2.2} />,
  pay: <SendHorizontal className="icon" size={16} strokeWidth={2.2} />,
  history: <History className="icon" size={16} strokeWidth={2.2} />,
  rewards: <Gift className="icon" size={16} strokeWidth={2.2} />,
};

export default function BottomNav({ tabs, activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`nav-btn ${activeTab === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {icons[tab]}
          <span>{tab[0].toUpperCase() + tab.slice(1)}</span>
        </button>
      ))}
    </nav>
  );
}
