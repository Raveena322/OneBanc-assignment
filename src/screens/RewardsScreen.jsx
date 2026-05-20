import React from "react";

function formatRupees(value) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value ?? 0)}`;
}

export default function RewardsScreen({ data }) {
  const earnTasks = data?.earnTasks ?? [];
  const redeemOptions = data?.redeemOptions ?? [];

  return (
    <section className="screen active">
      <div className="card rewards-top">
        <p className="muted light">Your reward points</p>
        <h2>{new Intl.NumberFormat("en-IN").format(data?.points ?? 0)} pts</h2>
        <p>Worth {formatRupees(data?.value)}</p>
        <div className="progress">
          <div style={{ width: `${data?.progressPercent ?? 0}%` }} />
        </div>
        <small>{data?.tierRemaining ?? 0} pts to Platinum tier</small>
      </div>
      <section>
        <h3>Earn more</h3>
        <div className="task-list">
          {earnTasks.map((task) => (
            <article key={task.title} className="card task">
              <p>{task.title}</p>
              <small>{task.reward}</small>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h3>Redeem instantly</h3>
        <div className="quick-grid">
          {redeemOptions.map((item) => (
            <button key={item}>{item}</button>
          ))}
        </div>
      </section>
    </section>
  );
}
