const navButtons = document.querySelectorAll(".nav-btn");
const screens = document.querySelectorAll(".screen");
const toggleBalanceBtn = document.getElementById("toggle-balance");
const balanceText = document.getElementById("balance-text");

let isHidden = false;
const actualBalance = "₹1,24,840";
const hiddenBalance = "₹• • • • • •";

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    navButtons.forEach((btn) => btn.classList.remove("active"));
    screens.forEach((screen) => screen.classList.remove("active"));

    button.classList.add("active");
    document.querySelector(`[data-screen="${target}"]`)?.classList.add("active");
  });
});

toggleBalanceBtn.addEventListener("click", () => {
  isHidden = !isHidden;
  balanceText.textContent = isHidden ? hiddenBalance : actualBalance;
  toggleBalanceBtn.textContent = isHidden ? "Show" : "Hide";
});
