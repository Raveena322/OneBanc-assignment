import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import PayScreen from "./screens/PayScreen";
import RewardsScreen from "./screens/RewardsScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";

const tabs = ["home", "pay", "history", "rewards"];
const DARK_MODE_KEY = "onebanc-dark-mode";

// API base (set via Vite env var VITE_API_BASE in production)
const API_BASE = import.meta.env.VITE_API_BASE || "";

function readDarkModePreference() {
  try {
    return localStorage.getItem(DARK_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

function saveDarkModePreference(value) {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(value));
  } catch {
    // Ignore storage errors and keep app usable.
  }
}

export default function App() {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [tab, setTab] = useState("home");
  const [darkMode, setDarkMode] = useState(readDarkModePreference);
  const [authStage, setAuthStage] = useState("splash");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsError, setTransactionsError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [paymentState, setPaymentState] = useState({ upiId: "", amount: "", success: false });

  useEffect(() => {
    saveDarkModePreference(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => setAuthStage("login"), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authStage !== "app") return;
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard`);
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        if (active) setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    }

    async function loadTransactions() {
      try {
        const response = await fetch(`${API_BASE}/api/transactions`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        if (active) {
          setTransactions(data.items ?? []);
          setTransactionsError("");
        }
      } catch (error) {
        if (active) setTransactionsError("Server error");
      }
    }

    loadDashboard();
    loadTransactions();
    return () => {
      active = false;
    };
  }, [authStage]);

  async function requestOtp() {
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!response.ok) throw new Error("OTP request failed");
      setAuthStage("otp");
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  }

  async function verifyOtp() {
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      if (!response.ok) throw new Error("OTP verification failed");
      setAuthStage("app");
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  }

  function handlePay() {
    if (!paymentState.upiId || !paymentState.amount) return;
    setPaymentState((state) => ({ ...state, success: true }));
    setTimeout(() => {
      setPaymentState({ upiId: "", amount: "", success: false });
    }, 1300);
  }

  async function retryTransactions() {
    setTransactionsError("");
    try {
      const response = await fetch(`${API_BASE}/api/transactions`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setTransactions(data.items ?? []);
    } catch (error) {
      setTransactionsError("Server error");
    }
  }

  const handleSwipeStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
    touchStartY.current = event.changedTouches[0].clientY;
  };

  const handleSwipeEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const delta = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const threshold = 70;
    const currentIndex = tabs.indexOf(tab);

    if (Math.abs(deltaY) > Math.abs(delta)) return;

    if (delta < -threshold && currentIndex < tabs.length - 1) {
      setTab(tabs[currentIndex + 1]);
    } else if (delta > threshold && currentIndex > 0) {
      setTab(tabs[currentIndex - 1]);
    }
  };

  const screen = useMemo(() => {
    if (tab === "home") return <HomeScreen data={dashboard?.home} />;
    if (tab === "pay")
      return (
        <PayScreen
          data={dashboard?.pay}
          paymentState={paymentState}
          setPaymentState={setPaymentState}
          onPay={handlePay}
        />
      );
    if (tab === "history") {
      return (
        <TransactionHistoryScreen
          data={transactions}
          loading={loading}
          error={transactionsError}
          onRetry={retryTransactions}
        />
      );
    }
    return <RewardsScreen data={dashboard?.rewards} />;
  }, [dashboard, tab, paymentState, transactions, loading, transactionsError]);

  if (authStage !== "app") {
    return (
      <main className={`app-shell auth-shell ${darkMode ? "dark" : ""}`}>
        <AnimatePresence mode="wait">
          {authStage === "splash" && (
            <motion.section
              key="splash"
              className="auth-screen center-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1>OneBanc</h1>
              <p className="muted">Your money, simplified.</p>
              <div className="spinner" />
            </motion.section>
          )}
          {authStage === "login" && (
            <motion.section
              key="login"
              className="auth-screen"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
            >
              <h2>Login</h2>
              <input
                className="auth-input"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <button onClick={requestOtp} disabled={authLoading}>
                {authLoading ? "Sending..." : "Send OTP"}
              </button>
            </motion.section>
          )}
          {authStage === "otp" && (
            <motion.section
              key="otp"
              className="auth-screen"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
            >
              <h2>Verify OTP</h2>
              <p className="muted">Use demo OTP: 1234</p>
              <input
                className="auth-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
              />
              <button onClick={verifyOtp} disabled={authLoading}>
                {authLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main className={`app-shell ${darkMode ? "dark" : ""}`}>
      <Header darkMode={darkMode} onToggleTheme={() => setDarkMode((s) => !s)} />

      <AnimatePresence mode="wait">
        <motion.div
          className="screen-stage"
          key={tab}
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {loading ? (
            <div className="skeleton-list">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : (
            screen
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav tabs={tabs} activeTab={tab} onChange={setTab} />
    </main>
  );
}
