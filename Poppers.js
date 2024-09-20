const getElements = (selector) => {
  const elements = [...document.querySelectorAll(selector)];
  return elements.length === 1 ? elements[0] : elements;
};

const playArea = {
  stats: getElements(".stats"),
  main: getElements(".main"),
  game: getElements(".game"),
  btns: getElements(".btn"),
  pages: getElements(".page"),
};

const player = {};
let gameObject;

document.addEventListener("DOMContentLoaded", getData);

//This function makes an HTTP request to a URL (https://discoveryvip.com/shared/json.php?f=game) to fetch JSON data from a server using the fetch API.

function getData() {
  //for buttons
  playArea.main.classList.add("visible");
  fetch("https://discoveryvip.com/shared/json.php?f=game")
    .then(function (
      response // Convert the response to JSON
    ) {
      return response.json();
    })
    .then(function (data) {
      gameObject = data.data;
      buildBoard();
    });
}

playArea.btns.addEventListener("click", play);

function play() {
  player.score = 0;
  player.items = 3;
  playArea.main.classList.remove("visible");
  playArea.game.classList.add("visible");
  player.gameOver = false;
  calculateLabel();
}

function calculateLabel(newPop) {
  // If the label already exists, clear its content
  let label = playArea.stats.querySelector(".label");
  if (!label) {
    let label = document.createElement("div");
    label.setAttribute("class", "label");
    playArea.stats.appendChild(label);
  }

  if (player.score >= 0) {
    player.score += newPop.new;
    label.innerHTML = "Score " + player.score + " Lives " + player.items;
  }
   if (player.score <= 0) {
    player.items--;
    player.score += newPop.new;
    label.innerHTML = "Score " + player.score + " Lives " + player.items;
    if (player.score <= 0 && player.items == 0) {
      playArea.gameOver = true;
      label.innerHTML = "Game Over";
      play();
    }
  }
}

function showPop(e) {
  let newPop = e.target;
  newPop.old = newPop.innerHTML;
  newPop.classList.add("active");

  const value = Math.floor(Math.random() * gameObject.length);
  newPop.innerHTML = gameObject[value].icon + "<br>" + gameObject[value].value;
  newPop.new = gameObject[value].value;
  //  Setting a Timeout for the Pop to Disappear
  setTimeout(() => {
    newPop.classList.remove("active");
    newPop.innerHTML = newPop.old;
    calculateLabel(newPop);
  }, 500);
}

function buildBoard() {
  let rows = 4;
  let cols = 4;
  let count = 0;

  for (let y = 0; y < cols; y++) {
    let divMain = document.createElement("div");
    divMain.setAttribute("class", "row");
    divMain.style.width = cols * 100;
    for (let x = 0; x < rows; x++) {
      let div = document.createElement("div");
      div.setAttribute("class", "pop");
      count++;
      div.innerText = count;
      div.count = count;
      // Add event listener to each .pop element
      div.addEventListener("click", showPop);
      divMain.appendChild(div);
    }
    playArea.game.appendChild(divMain);
  }
}
