import React from "react";

export default function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="top-bar">
      <div>
        <p className="muted">Good afternoon</p>
        <h1>OneBanc</h1>
      </div>
      <div className="header-actions">
        <button className="theme-btn" onClick={onToggleTheme}>
          {darkMode ? "Light" : "Dark"}
        </button>
        <button className="avatar-btn" aria-label="Profile">
          AB
        </button>
      </div>
    </header>
  );
}
