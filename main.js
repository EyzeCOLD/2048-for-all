document.getElementById("retryButton").addEventListener("click", () => {
  const overlay = document.getElementById("gameOverOverlay");
  overlay.classList.remove("show");
  Game.reset();
});

const initInput = () => {
    const script = document.createElement("script");
    script.src = "touch-input.js";
    document.head.appendChild(script);

  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
      Game.move(e.key);
  });
};

const scaleGameBoard = () => {
  const board = document.getElementById("board");
  const scaleX = window.innerWidth / 460;
  const scaleY = window.innerHeight / 460;
  const scale = Math.floor(Math.min(scaleX, scaleY) * 100) / 100;
  board.style.transform = `scale(${scale})`;
};

window.addEventListener("resize", scaleGameBoard);
window.addEventListener("load", scaleGameBoard);

Game.run();

const startButton = document.getElementById("startButton");
startButton.focus();
startButton.addEventListener("click", () => {
  const overlay = document.getElementById("startScreenOverlay");
  overlay.classList.remove("show");

  initInput();
});
