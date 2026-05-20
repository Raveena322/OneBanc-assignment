import React from "react";
import { BadgeIndianRupee, Receipt, ShoppingBag, TramFront, Wallet } from "lucide-react";

const categoryIcons = {
  Bills: Receipt,
  Shopping: ShoppingBag,
  Travel: TramFront,
  Income: Wallet,
  Recharge: BadgeIndianRupee,
};

function formatAmount(value) {
  const abs = Math.abs(value ?? 0);
  const sign = value >= 0 ? "+" : "-";
  return `${sign}Rs ${new Intl.NumberFormat("en-IN").format(abs)}`;
}

function formatDate(dateTime) {
  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TransactionHistoryScreen({ data, loading, error, onRetry }) {
  if (loading) {
    return (
      <section className="screen">
        <h3>Transaction history</h3>
        <div className="skeleton-list">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="screen">
        <h3>Transaction history</h3>
        <div className="card state-card">
          <p>Server error while loading transactions.</p>
          <button onClick={onRetry}>Retry</button>
        </div>
      </section>
    );
  }

  if (!data?.length) {
    return (
      <section className="screen">
        <h3>Transaction history</h3>
        <div className="card state-card">
          <p>No transactions</p>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <h3>Transaction history</h3>
      <div className="history-list">
        {data.map((item) => {
          const Icon = categoryIcons[item.category] ?? Receipt;
          return (
            <article key={item.id} className="card history-item">
              <div className="history-left">
                <span className="history-icon">
                  <Icon size={16} />
                </span>
                <div>
                  <p>{item.title}</p>
                  <small>{formatDate(item.dateTime)}</small>
                </div>
              </div>
              <div className="history-right">
                <strong className={item.amount >= 0 ? "positive" : "negative"}>
                  {formatAmount(item.amount)}
                </strong>
                <small>{item.status}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
