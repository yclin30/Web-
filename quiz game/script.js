// --- DOM 元素获取 ---
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score"); // FIX: 现在可以正确获取
const messageText = document.getElementById("message-text"); // FIX: 获取 p 标签而不是 div
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress"); // FIX: 现在可以正确获取

// --- 题目数据 ---
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

// --- 游戏状态变量 ---
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// --- 事件监听器 ---
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// --- 函数定义 ---

function startQuiz() {
  // 重置游戏状态
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  // 更新总题数显示
  const totalQuestions = quizQuestions.length;
  totalQuestionsSpan.textContent = totalQuestions;
  maxScoreSpan.textContent = totalQuestions;

  // 切换屏幕
  startScreen.classList.remove("active");
  resultScreen.classList.remove("active"); // 确保结果页也隐藏
  quizScreen.classList.add("active");

  // 显示第一个问题
  showQuestion();
}

function showQuestion() {
  // 重置回答状态
  answersDisabled = false;

  // 更新问题编号
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  // 更新进度条
  const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  // 清空并填充问题和答案
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // 为所有按钮添加 'correct' 或 'incorrect' 样式
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else {
      button.classList.add("incorrect");
    }
    button.disabled = true;
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }


  // 延迟1秒后进入下一个问题或显示结果
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    messageText.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    messageText.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    messageText.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    messageText.textContent = "Not bad! Try again to improve!";
  } else {
    messageText.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  // 直接调用 startQuiz 即可，它包含了所有重置逻辑
  startQuiz();
}