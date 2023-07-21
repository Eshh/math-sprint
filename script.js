import shuffle from "./shuffle.js";

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

// Equations
let questionAmount = 0;
let equationsArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

// Scroll

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomNumber(+questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log(correctEquations, wrongEquations, questionAmount);
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
  console.log(equationsArray);
  shuffle(equationsArray);
  // equationsToDOM();
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
