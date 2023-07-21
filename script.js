// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");
const scoreDisplay = document.getElementById("scoreDisplay");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoresArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;

function bestScoresToDOM() {
  bestScores.forEach((each, index) => {
    each.textContent = `${bestScoresArray[index].bestScore}s`;
  });
}

function checkLocalStorage() {
  if (localStorage.getItem("best-scores")) {
    bestScoresArray = JSON.parse(localStorage.getItem("best-scores"));
  } else {
    bestScoresArray = [
      {
        questions: 10,
        bestScore: finalTimeDisplay,
      },
      {
        questions: 25,
        bestScore: finalTimeDisplay,
      },
      {
        questions: 50,
        bestScore: finalTimeDisplay,
      },
      {
        questions: 99,
        bestScore: finalTimeDisplay,
      },
    ];
    localStorage.setItem("best-scores", JSON.stringify(bestScoresArray));
  }
  bestScoresToDOM();
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomNumber(+questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log(correctEquations, wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNumber(9);
    secondNumber = getRandomNumber(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomNumber(9);
    secondNumber = getRandomNumber(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomNumber(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  // equationsToDOM();
}

correctNumber = 0;
incorrectNumber = 0;

function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  setBestTime();
  scoreDisplay.textContent = `Correct: ${correctNumber}/${playerGuessArray.length}`;
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}
function showScorePage() {
  setTimeout(() => (playAgainBtn.hidden = false), 1500);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

function setBestTime() {
  bestScoresArray.forEach((each, index) => {
    if (+questionAmount == each.questions) {
      const s = +bestScoresArray[index].bestScore;
      console.log(questionAmount, each, finalTime, s);
      if (s == 0 || s > finalTime) {
        bestScoresArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  bestScoresToDOM();
  localStorage.setItem("best-scores", JSON.stringify(bestScoresArray));
}
function checkTime() {
  if (playerGuessArray.length == +questionAmount) {
    clearInterval(timer);
    equationsArray.forEach((each, i) => {
      if (each.evaluated == playerGuessArray[i]) {
        correctNumber++;
      } else {
        incorrectNumber++;
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }
}

function addTime() {
  timePlayed += 0.1;
  checkTime();
}

function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(() => addTime(), 100);
  gamePage.removeEventListener("click", startTimer);
}

function select(bool) {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  playerGuessArray.push(String(bool));
}

function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}
function equationsToDOM() {}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  createEquations();
  let content = "";
  itemContainer.textContent = "";
  equationsArray.forEach((each) => {
    content += `<div class='item'><h1>${each.value}</h1></div>`;
  });
  itemContainer.innerHTML = `<div class='height-240'></div>
  <div class='selected-item'></div>${content}`;
  // Spacer
  // const topSpacer = document.createElement("div");
  // topSpacer.classList.add("height-240");
  // // Selected Item
  // const selectedItem = document.createElement("div");
  // selectedItem.classList.add("selected-item");
  // // Append
  // itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  // equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

function countdownStart() {
  countdown.textContent = 3;
  let interval = setInterval(() => {
    if (countdown.textContent == 1) {
      clearInterval(interval);
    }
    countdown.textContent--;
    if (countdown.textContent == "0") countdown.textContent = "GO";
  }, 1000);
}

function showCountdown() {
  if (questionAmount) {
    countdownPage.hidden = false;
    splashPage.hidden = true;
    populateGamePage();
    countdownStart();
    setTimeout(showGamePage, 4000);
  } else {
    alert("Please choose an option");
  }
}

function getRadioValue() {
  let radioValue;
  radioInputs.forEach((each) => {
    if (each.checked) {
      radioValue = each.value;
    }
  });
  return radioValue;
}
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  showCountdown();
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((each) => {
    each.classList.remove("selected-label");
    if (each.children[1].checked) each.classList.add("selected-label");
  });
});

startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

checkLocalStorage();
