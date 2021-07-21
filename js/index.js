import Chronometer from "./Chronometer.js";
import CookingGame from "./CookingGame.js";
import { baseIngredientsTaco, randomIngredientsTaco, baseIngredientsBurger, randomIngredientsBurger } from "./data.js";

let baseIngredients;
let randomIngredients;
let playerSelectionList = [];

const randomCombinationElm = document.getElementById("random-combination");
const listOfAllIngredientsElm = document.getElementById("list-of-all-ingredients");

// get query params
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("recipe");
if (myParam === "taco") {
  baseIngredients = baseIngredientsTaco;
  randomIngredients = randomIngredientsTaco;
} else if (myParam === "burger") {
  baseIngredients = baseIngredientsBurger;
  randomIngredients = randomIngredientsBurger;
}

const allIngredients = baseIngredients.concat(randomIngredients);

// LEVEL 1
const cookingGame = new CookingGame(baseIngredients, randomIngredients, 100, 4);
const chronometer = new Chronometer(30);

// function startNewGame(level = 1) {
//   if (level === 2) {
//     // cookingGame.randomIngredients = myArray;
//     cookingGame.maxPoints = 400;
//   }
//   const recipe = cookingGame.createRandomRecipe();
//   renderRecipe(recipe);
//   chronometer.start(printTime);
// }

function startNewGame() {
  const recipe = cookingGame.createRandomRecipe();
  renderRecipe(recipe);
  chronometer.start(printTime);
}

function renderRecipe(recipe) {
  recipe.forEach((item) => {
    const randomRecipeItem = document.createElement("li");
    randomCombinationElm.appendChild(randomRecipeItem);
    randomRecipeItem.setAttribute("style", `background-image: url("${item.img}")`);
  });
}

// generate all ingredients list
for (let i = 0; i < allIngredients.length; i++) {
  const listedIngredient = document.createElement("li");
  listOfAllIngredientsElm.appendChild(listedIngredient);
  listedIngredient.setAttribute("class", "ingredient");
  listedIngredient.setAttribute("style", `background-image: url("${allIngredients[i].img}")`);
  listedIngredient.setAttribute("data-ingredient", allIngredients[i].name);
}

// Displaying player selection
const playerSelectionElm = document.getElementById("player-selection");

document.querySelector("#list-of-all-ingredients").addEventListener("click", function (e) {
  const tryAgainMessage = document.querySelector("#try-again-button");
  tryAgainMessage.setAttribute("style", "display:none");
  const wellDoneMessage = document.querySelector("#well-done-button");
  wellDoneMessage.setAttribute("style", "display:none");
  // if the selection not full yet, add another item
  if (playerSelectionList.length < cookingGame.recipeLength) {
    playerSelectionElm.innerHTML = "";

    if (e.target.classList.contains("ingredient")) {
      const indexOfClickedElement = allIngredients.findIndex(
        (i) => i.name === e.target.getAttribute("data-ingredient")
      );
      playerSelectionList.unshift(allIngredients[indexOfClickedElement]);

      playerSelectionList.forEach((item) => {
        const listItem = document.createElement("li");
        playerSelectionElm.appendChild(listItem);
        listItem.setAttribute("style", `background-image: url("${item.img}")`);
        listItem.setAttribute("data-ingredient", item.name);
      });
    }
  }
});

function clearPlayerSelection() {
  playerSelectionElm.innerHTML = "";
  playerSelectionList = [];
}

function submitPlayerSelection() {
  const originalArray = cookingGame.randomRecipe.map((item) => item.name);
  const createdArray = playerSelectionList.map((item) => item.name);
  if (JSON.stringify(originalArray) === JSON.stringify(createdArray)) {
    cookingGame.playerPoints += 100;
    displayPoints();
    if (checkIfWon()) {
      alert(`WOW, YOU WON THE GAME!!`);
      cookingGame.randomRecipe = [];
      randomCombinationElm.innerHTML = "";
    } else {
      const wellDoneMessage = document.querySelector("#well-done-button");
      wellDoneMessage.setAttribute("style", "display:block");
      cookingGame.randomRecipe = [];
      randomCombinationElm.innerHTML = "";
      renderRecipe();
    }
  } else {
    const tryAgainMessage = document.querySelector("#try-again-button");
    tryAgainMessage.setAttribute("style", "display:block");
  }
  clearPlayerSelection();
}

// CLEAR BUTTON
const clearButton = document.getElementById("clear-selection");
clearButton.addEventListener("click", clearPlayerSelection);

// SUBMIT BUTTON
const submitButton = document.getElementById("submit-selection");
submitButton.addEventListener("click", submitPlayerSelection);

// DISPLAY POINTS
const scoreTable = document.getElementById("score-table");
scoreTable.innerHTML = `PLAYER POINTS:  ${cookingGame.playerPoints} / ${cookingGame.maxPoints}`;

function displayPoints() {
  scoreTable.innerHTML = `${cookingGame.playerPoints} / ${cookingGame.maxPoints}`;
}

function checkIfWon() {
  if (cookingGame.playerPoints === cookingGame.maxPoints && chronometer.currentTime > 0) {
    chronometer.stop();
    secDecElement.innerHTML = 0;
    secUniElement.innerHTML = 0;
    return true;
  }
}

// TIMER
const secDecElement = document.getElementById("secDec");
const secUniElement = document.getElementById("secUni");

function printTime() {
  if (chronometer.currentTime < 1) {
    chronometer.stop();
    secDecElement.innerHTML = 0;
    secUniElement.innerHTML = 0;

    cookingGame.randomRecipe = [];
    randomCombinationElm.innerHTML = "";
    clearPlayerSelection();
    cookingGame.randomRecipe = [];
    randomCombinationElm.innerHTML = "";
    alert("BETTER LUCK NEXT TIME!");
  } else {
    printSeconds();
  }

  function printSeconds() {
    let seconds = chronometer.computeTwoDigitNumber(chronometer.getSeconds());
    let firstDigit = seconds.toString()[0];
    let secondDigit = seconds.toString()[1];

    secDecElement.innerHTML = firstDigit;
    secUniElement.innerHTML = secondDigit;
  }
}

// MODAL
const modalElm = document.getElementById("exampleModal");
modalElm.setAttribute("data-backdrop", "static");

$(window).on("load", function () {
  $("#exampleModal").modal("show");
});

$("#exampleModal").on("hidden.bs.modal", function () {
  startNewGame();
});
