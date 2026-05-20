import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

function formatRupees(value) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value ?? 0)}`;
}

export default function PayScreen({ data, paymentState, setPaymentState, onPay }) {
  const favorites = data?.favorites ?? [];
  const bills = data?.bills ?? [];

  return (
    <section className="screen active">
      <div className="card qr-scanner">
        <p className="muted">QR Scanner</p>
        <div className="scanner-box">
          <div className="scan-line" />
        </div>
      </div>
      <div className="card pay-hero">
        <h2>Pay & Transfer</h2>
        <label className="search-wrap">
          <Search className="icon" size={16} />
          <input type="text" placeholder="Search by name, UPI ID, bank" />
        </label>
        <div className="pay-actions">
          <button className="primary">Scan & Pay</button>
          <button>Pay Phone</button>
          <button>Self Transfer</button>
          <button>Bank</button>
        </div>

        <div className="payment-form">
          <input
            type="text"
            value={paymentState.upiId}
            onChange={(event) =>
              setPaymentState((state) => ({ ...state, upiId: event.target.value }))
            }
            placeholder="Enter UPI ID"
          />
          <input
            type="number"
            value={paymentState.amount}
            onChange={(event) =>
              setPaymentState((state) => ({ ...state, amount: event.target.value }))
            }
            placeholder="Enter amount"
          />
          <button className="primary" onClick={onPay}>
            Pay now
          </button>
        </div>
      </div>
      <section>
        <h3>Favorite people</h3>
        <div className="favorites">
          {favorites.map((person) => (
            <button key={person}>{person}</button>
          ))}
        </div>
      </section>
      <section>
        <h3>Bills & recharges</h3>
        <div className="bill-list">
          {bills.map((bill) => (
            <article key={bill.name} className="card list-item">
              <div>
                <p>{bill.name}</p>
                <small>{bill.dueText}</small>
              </div>
              <strong>{formatRupees(bill.amount)}</strong>
            </article>
          ))}
        </div>
      </section>

      {paymentState.success && (
        <motion.div
          className="card success-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p>Payment successful</p>
        </motion.div>
      )}
    </section>
  );
}
