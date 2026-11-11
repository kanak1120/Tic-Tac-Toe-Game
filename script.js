const WIN_LINES = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8],
  [0, 4, 8], 
  [2, 4, 6]
];

const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const overlay = document.getElementById("overlay");
const popup = overlay.querySelector(".popup");
const popupIcon = document.getElementById("popupIcon");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const playAgainBtn = document.getElementById("playAgain");
const scores = { X: 0, O: 0, D: 0 };

let board, current, gameOver;

function startGame() {
  board = Array(9).fill("");
  current = "X";
  gameOver = false;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.disabled = false;
    cell.className = "cell";
  });
  statusEl.textContent = "X's turn";
  hidePopup();
}

function hasWon() {
  return WIN_LINES.some(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function handleMove(index) {
  if (gameOver || board[index]) return;

  board[index] = current;
  const cell = cells[index];
  cell.textContent = current;
  cell.classList.add(current.toLowerCase());
  cell.disabled = true;

  if (hasWon()) {
    endGame(current);
    return;
  }

  if (board.every(Boolean)) {
    endGame("draw");
    return;
  }

  current = current === "X" ? "O" : "X";
  statusEl.textContent = `${current}'s turn`;
}

function endGame(result) {
  gameOver = true;
  cells.forEach(cell => (cell.disabled = true));

  if (result === "draw") {
    scores.D++;
    statusEl.textContent = "It's a draw.";
    showPopup("draw", "🤝", "It's a draw!", "Well played, both of you.");
  } else {
    scores[result]++;
    statusEl.textContent = `${result} wins!`;
    showPopup(result.toLowerCase(), "🎉", `Congratulations! ${result} wins!`, `Player ${result} takes this round.`);
  }
  updateScores();
}

function showPopup(type, icon, title, message) {
  popup.className = `popup ${type}`;
  popupIcon.textContent = icon;
  popupTitle.textContent = title;
  popupMessage.textContent = message;
  overlay.hidden = false;
  playAgainBtn.focus();
}

function hidePopup() {
  overlay.hidden = true;
}

function updateScores() {
  document.getElementById("scoreX").textContent = scores.X;
  document.getElementById("scoreO").textContent = scores.O;
  document.getElementById("scoreD").textContent = scores.D;
}

cells.forEach(cell =>
  cell.addEventListener("click", () => handleMove(Number(cell.dataset.index)))
);
document.getElementById("reset").addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

startGame();