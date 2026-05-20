import React, { useState } from "react";
import { motion } from "framer-motion";

function formatRupees(value) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value ?? 0)}`;
}

export default function HomeScreen({ data }) {
  const [hidden, setHidden] = useState(false);
  const sparkline = data?.sparkline ?? [24, 36, 42, 58, 47, 67, 76];
  const quickActions = data?.quickActions ?? [];
  const insights = data?.insights ?? [];

  return (
    <section className="screen active">
      <motion.div className="card hero" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="muted light">Total balance</p>
        <div className="balance-row">
          <h2>{hidden ? "Rs • • • • • •" : formatRupees(data?.totalBalance)}</h2>
          <button className="ghost-btn" onClick={() => setHidden((s) => !s)}>
            {hidden ? "Show" : "Hide"}
          </button>
        </div>
        <div className="sparkline">
          {sparkline.map((height) => (
            <span key={height} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="hero-actions">
          <button>Add Money</button>
          <button>Send</button>
          <button>Scan</button>
        </div>
      </motion.div>

      <section>
        <h3>Quick actions</h3>
        <div className="quick-grid">
          {quickActions.map((item) => (
            <button key={item}>{item}</button>
          ))}
        </div>
      </section>

      <section>
        <h3>AI spending insights</h3>
        <article className="card premium-card">
          <p>{data?.aiInsight ?? "Insights will appear once activity is synced."}</p>
        </article>
      </section>

      <section>
        <h3>Spending analytics</h3>
        <div className="card analytics-card">
          <div>
            <p className="muted">Spent this month</p>
            <strong>{formatRupees(data?.monthlySpend)}</strong>
          </div>
          <div>
            <p className="muted">Budget left</p>
            <strong>{formatRupees((data?.monthlyBudget ?? 0) - (data?.monthlySpend ?? 0))}</strong>
          </div>
        </div>
      </section>

      <section>
        <h3>Recent transactions</h3>
        <div className="insight-list">
          {(data?.recentTransactions ?? []).map((tx) => (
            <article className="card list-item" key={tx.id}>
              <div>
                <p>{tx.title}</p>
                <small>{tx.status}</small>
              </div>
              <strong>{formatRupees(tx.amount)}</strong>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3>Cashback & rewards</h3>
        <div className="card cashback-card">
          <p>Available cashback</p>
          <strong>{formatRupees(data?.cashback)}</strong>
        </div>
      </section>

      <section>
        <h3>Smart insights</h3>
        <div className="insight-list">
          {insights.map((insight) => (
            <article key={insight} className="card insight">
              <p>{insight}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
