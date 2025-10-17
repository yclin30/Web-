const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("include-uppercase");
const lowercaseCheckbox = document.getElementById("include-lowercase");
const numbersCheckbox = document.getElementById("include-numbers");
const symbolsCheckbox = document.getElementById("include-symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.getElementById("strength-text"); // 修复这里

// 所使用到的字符
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

// 给按钮添加事件
generateButton.addEventListener("click", makePassword);

function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  // 一定要勾选一种字符类型
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    alert("Please select at least one character type.");
    return;
  }

  // 生成密码
  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );
  passwordInput.value = newPassword;

  // 更新密码强度指示条
  updateStrengthMeter(newPassword);
}

// 生成密码
function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  let allCharacters = "";

  if (includeUppercase) allCharacters += uppercaseLetters;
  if (includeLowercase) allCharacters += lowercaseLetters;
  if (includeNumbers) allCharacters += numberCharacters;
  if (includeSymbols) allCharacters += symbolCharacters;

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }
  return password;
}

function updateStrengthMeter(password) {
  const passwordLength = password.length;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

  let strengthScore = 0;

  // 长度得分
  strengthScore += Math.min(passwordLength * 2, 40);

  // 字符类型得分
  if (hasUppercase) strengthScore += 15;
  if (hasLowercase) strengthScore += 15;
  if (hasNumbers) strengthScore += 15;
  if (hasSymbols) strengthScore += 15;

  // 对过短密码强制限制最大分数
  if (passwordLength < 8) {
    strengthScore = Math.min(strengthScore, 40);
  }

  // 确保强度条宽度是有效的百分比
  const safeScore = Math.max(5, Math.min(100, strengthScore));
  strengthBar.style.width = safeScore + "%";

  let strengthLabelText = "";
  let barColor = "";

  if (strengthScore < 40) {
    // 弱密码
    barColor = "var(--weakcolor)";
    strengthLabelText = "Weak";
  } else if (strengthScore < 70) {
    // 中等密码
    barColor = "var(--mediumcolor)";
    strengthLabelText = "Medium";
  } else {
    // 强密码
    barColor = "var(--strongcolor)";
    strengthLabelText = "Strong";
  }

  strengthBar.style.backgroundColor = barColor;
  strengthText.textContent = strengthLabelText; // 修复这里
}

// 页面加载时生成初始密码
window.addEventListener("DOMContentLoaded", makePassword);

// 复制功能
copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;

  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy:", error));
});

function showCopySuccess() {
  const icon = copyButton.querySelector("i");
  icon.classList.remove("fa-copy");
  icon.classList.add("fa-check");
  copyButton.style.color = "#48bb78";

  setTimeout(() => {
    icon.classList.remove("fa-check");
    icon.classList.add("fa-copy");
    copyButton.style.color = "";
  }, 1500);
}