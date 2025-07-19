// Elements
const loginScreen = document.getElementById("loginScreen");
const usernameInput = document.getElementById("usernameInput");
const startBtn = document.getElementById("startBtn");

const mainApp = document.getElementById("mainApp");
const displayName = document.getElementById("displayName");
const modeSelect = document.getElementById("mode");
const timeOptions = document.getElementById("timeOptions");
const beginTest = document.getElementById("beginTest");

const quoteDisplay = document.getElementById("quoteDisplay");
const inputArea = document.getElementById("inputArea");

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const scoreDisplay = document.getElementById("score");

const testArea = document.getElementById("testArea");
const statsPanel = document.getElementById("statsPanel");
const controlPanel = document.getElementById("controlPanel");

const restartBtn = document.getElementById("restartBtn");
const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");
const leaderboardModal = document.getElementById("leaderboardModal");
const leaderboardList = document.getElementById("leaderboardList");
const closeLeaderboard = document.getElementById("closeLeaderboard");

const themeToggle = document.getElementById("toggleTheme");

// variables
let user = "";
let mode = "normal";
let timeLimit = 0;
let currentQuote = "";
let quoteIndex = 0;
let time = 0;
let timer;
let isStarted = false;
let correctChars = 0;
let totalTyped = 0;
let score = 0;

// Sample quotes
const quotes = [
  "hello, welcome to my typing game",
  "Speed is irrelevant if you're going in the wrong direction.",
  "Practice makes perfect.",
  "Accuracy is more important than speed.",
  "Type like no one's watching.",
  "Push your limits every day.",
  "Exited to be a part of Vault of Codes"
];

// login
startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name) {
    user = name;
    loginScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");
    displayName.textContent = user;
  }
});

// mode
modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  timeOptions.classList.toggle("hidden", mode !== "timed");
});

beginTest.addEventListener("click", () => {
  if (mode === "timed") {
    timeLimit = parseInt(timeOptions.value);
  }
  startTest();
});

//start
function startTest() {
  quoteIndex = 0;
  score = 0;
  time = 0;
  isStarted = false;
  correctChars = 0;
  totalTyped = 0;
  inputArea.value = "";
  scoreDisplay.textContent = "0";
  timerDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100";

  testArea.classList.remove("hidden");
  statsPanel.classList.remove("hidden");
  controlPanel.classList.remove("hidden");

  loadNewQuote();
}

// timer
function startTimer() {
  timer = setInterval(() => {
    time++;
    timerDisplay.textContent = time;

    if (mode === "timed" && time >= timeLimit) {
      clearInterval(timer);
      endTest();
    }

    calculateStats();
  }, 1000);
}

// quote load
function loadNewQuote() {
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.innerHTML = "";

  currentQuote.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    quoteDisplay.appendChild(span);
  });

  inputArea.value = "";
}

// input handling
inputArea.addEventListener("input", () => {
  if (!isStarted) {
    isStarted = true;
    startTimer();
  }

  const typed = inputArea.value;
  totalTyped = typed.length;

  const spans = quoteDisplay.querySelectorAll("span");
  correctChars = 0;
  let isComplete = true;

  spans.forEach((span, idx) => {
    const char = typed[idx];
    if (!char) {
      span.classList.remove("correct", "incorrect");
      isComplete = false;
    } else if (char === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correctChars++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
      isComplete = false;
    }
  });

  if (isComplete && typed.length === currentQuote.length) {
    score += Math.round((correctChars / time) * 10);
    scoreDisplay.textContent = score;
    loadNewQuote();
  }

  calculateStats();
});

// analyse stats
function calculateStats() {
  const wpm = time > 0 ? Math.round((correctChars / 5) / (time / 60)) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
}

// end
function endTest() {
  inputArea.disabled = true;
  saveToLeaderboard();
}

//restart
restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  inputArea.disabled = false;
  startTest();
});

// theme switch
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

//view leaderboards
viewLeaderboardBtn.addEventListener("click", () => {
  leaderboardModal.classList.remove("hidden");
  loadLeaderboard();
});

closeLeaderboard.addEventListener("click", () => {
  leaderboardModal.classList.add("hidden");
});

function saveToLeaderboard() {
  const entry = {
    name: user,
    score,
    mode,
    time: timeLimit || time
  };

  const key = `leaderboard_${mode}_${entry.time}`;
  let board = JSON.parse(localStorage.getItem(key)) || [];
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  board = board.slice(0, 5);
  localStorage.setItem(key, JSON.stringify(board));
}

function loadLeaderboard() {
  const key = `leaderboard_${mode}_${timeLimit || time}`;
  const board = JSON.parse(localStorage.getItem(key)) || [];
  leaderboardList.innerHTML = "";

  board.forEach((entry, idx) => {
    const div = document.createElement("div");
    div.innerHTML = `${idx + 1}. <strong>${entry.name}</strong> - ${entry.score} pts`;
    leaderboardList.appendChild(div);
  });

  if (board.length === 0) {
    leaderboardList.innerHTML = "<p>No records yet for this mode/time.</p>";
  }
}