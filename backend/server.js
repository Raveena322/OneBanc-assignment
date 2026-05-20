import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dashboardData = {
  home: {
    totalBalance: 124840,
    sparkline: [24, 36, 42, 58, 47, 67, 76],
    monthlySpend: 28320,
    monthlyBudget: 40000,
    cashback: 1240,
    aiInsight:
      "You can save around Rs 3,200 this month by reducing food delivery and moving card bill autopay to UPI cashback days.",
    quickActions: [
      "UPI Pay",
      "Scan QR",
      "Recharge",
      "Bill Pay",
      "Transfer",
      "Cards",
      "Split Bill",
      "Request",
    ],
    insights: [
      "Food spend is 18% higher this week.",
      "Electricity bill due in 2 days.",
      "Save Rs 2,500 to hit your monthly goal.",
    ],
    recentTransactions: [
      {
        id: "tx-1",
        title: "Swiggy",
        amount: -420,
        dateTime: "2026-05-20T08:20:00Z",
        status: "Completed",
        category: "Food",
      },
      {
        id: "tx-2",
        title: "Salary Credit",
        amount: 78000,
        dateTime: "2026-05-19T04:40:00Z",
        status: "Completed",
        category: "Income",
      },
      {
        id: "tx-3",
        title: "Electricity Bill",
        amount: -1480,
        dateTime: "2026-05-18T13:10:00Z",
        status: "Processing",
        category: "Bills",
      },
    ],
  },
  pay: {
    favorites: ["RI", "SK", "AM", "NK", "VR"],
    bills: [
      { name: "Electricity", dueText: "Due Tomorrow", amount: 1480 },
      { name: "Credit Card", dueText: "Due in 4 days", amount: 12000 },
    ],
  },
  rewards: {
    points: 12450,
    value: 1245,
    tierRemaining: 550,
    progressPercent: 62,
    earnTasks: [
      { title: "Pay 3 bills this week", reward: "+300 points" },
      { title: "Refer a friend", reward: "+500 points" },
      { title: "Spend Rs 1000 on UPI", reward: "+150 points" },
    ],
    redeemOptions: ["Cashback", "Gift Cards", "Bill Credit", "Travel"],
  },
};

const transactionsData = [
  {
    id: "txn-101",
    title: "Uber",
    amount: -290,
    dateTime: "2026-05-19T18:15:00Z",
    status: "Completed",
    category: "Travel",
  },
  {
    id: "txn-102",
    title: "Amazon",
    amount: -1999,
    dateTime: "2026-05-19T12:45:00Z",
    status: "Completed",
    category: "Shopping",
  },
  {
    id: "txn-103",
    title: "Airtel Recharge",
    amount: -399,
    dateTime: "2026-05-18T08:31:00Z",
    status: "Failed",
    category: "Recharge",
  },
  {
    id: "txn-104",
    title: "Freelance Payout",
    amount: 15200,
    dateTime: "2026-05-17T16:55:00Z",
    status: "Completed",
    category: "Income",
  },
];

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "onebanc-backend" });
});

app.get("/api/dashboard", (_req, res) => {
  res.json(dashboardData);
});

app.get("/api/transactions", (_req, res) => {
  const shouldFail = _req.query.fail === "1";
  if (shouldFail) {
    return res.status(500).json({ message: "Could not load transactions." });
  }
  return res.json({ items: transactionsData });
});

app.post("/api/auth/request-otp", (req, res) => {
  const { phone } = req.body ?? {};
  if (!phone || String(phone).length < 10) {
    return res.status(400).json({ message: "Invalid phone number." });
  }
  return res.json({ success: true, otpHint: "1234" });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { otp } = req.body ?? {};
  if (otp === "1234") {
    return res.json({ success: true, token: "demo-token" });
  }
  return res.status(401).json({ success: false, message: "Invalid OTP" });
});

app.listen(PORT, () => {
  console.log(`OneBanc backend running on http://localhost:${PORT}`);
});
