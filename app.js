const Game = {
  SIZE: 4,
  TILE_SIZE: 100,
  GAP: 10,

  tileObjects: [],
  boardData: [],

  /**
   * Initializes the data representation of the board as a 2d table
   */
  init() {
    const app = document.getElementById("app");
    const board = document.createElement("div");
    board.id = "board";
    app.appendChild(board);

    this.boardData = Array(this.SIZE)
      .fill()
      .map(() => Array(this.SIZE).fill(0));
  },

  /**
   * Resets tileObjects and boardData for a new game
   */
  reset() {
    this.boardData = Array(this.SIZE)
      .fill()
      .map(() => Array(this.SIZE).fill(0));

    this.tileObjects.forEach((t) => t.element.remove());
    this.tileObjects = [];

    this.spawnNumber();
  },

  /**
   * Creates a new tile as a div
   */
  createTile(row, col, value) {
    const newDiv = document.createElement("div");
    newDiv.className = "tile";
    newDiv.appendChild(document.createTextNode(value));

    const x = this.GAP + col * (this.GAP + this.TILE_SIZE);
    const y = this.GAP + row * (this.GAP + this.TILE_SIZE);

    newDiv.style.transform = `translate(${x}px, ${y}px) scale(0)`;

    document.getElementById("board").appendChild(newDiv);

    newDiv.getBoundingClientRect();
    newDiv.style.transform = `translate(${x}px, ${y}px) scale(1)`;

    this.tileObjects.push({
      row: row,
      col: col,
      value: value,
      element: newDiv,
    });
  },

  /**
   * Returns a list of coordinates for squares with no tiles in them
   */
  getFreeSquares() {
    const freeSquares = [];
    for (let row = 0; row < this.SIZE; ++row) {
      for (let col = 0; col < this.SIZE; ++col) {
        if (this.boardData[row][col] === 0) freeSquares.push({ row, col });
      }
    }
    return freeSquares;
  },

  /**
   * Spawns a 2 or a 4 in a random free tile
   */
  spawnNumber() {
    const freeSquares = this.getFreeSquares();
    if (freeSquares.length === 0) return;

    const index = Math.floor(Math.random() * freeSquares.length);
    const { row, col } = freeSquares[index];
    const value = Math.random() < 0.9 ? 2 : 4;
    this.boardData[row][col] = value;
    this.createTile(row, col, value);
  },

  /**
   * Process a row, eg. an array of four numbers
   */
  processLine(numbers, reverse = false) {
    // filter zeros
    numbers = numbers.filter((n) => n !== 0);
    if (reverse) numbers.reverse();
    // combine
    for (let i = 0; i < numbers.length - 1; ++i) {
      if (numbers[i] !== 0 && numbers[i] === numbers[i + 1]) {
        numbers[i] *= 2;
        numbers[i + 1] = 0;
      }
    }
    // put the zeros at the end
    numbers = numbers.filter((n) => n !== 0);
    while (numbers.length < this.SIZE) numbers.push(0);

    if (reverse) numbers.reverse();
    return numbers;
  },

  /**
   * Get a row or column from boardData and return it as a row/array
   */
  getLine(index, isColumn = false) {
    if (isColumn) return this.boardData.map((row) => row[index]);
    else return [...this.boardData[index]];
  },

  /**
   * Put the processed line back into the boardData
   */
  setLine(index, newLine, isColumn = false) {
    if (isColumn) {
      for (let i = 0; i < this.SIZE; i++) this.boardData[i][index] = newLine[i];
    } else {
      this.boardData[index] = [...newLine];
    }
  },

  /**
   * Make a move!
   */
  move(key) {
    const isColumn = key === "ArrowUp" || key === "ArrowDown";
    const reverse = key === "ArrowRight" || key === "ArrowDown";
    let change = false;

    for (let i = 0; i < this.SIZE; ++i) {
      let line = this.getLine(i, isColumn);
      let newLine = this.processLine(line, reverse);
      // check for change
      for (let i = 0; change === false && i < line.length; ++i)
        if (line[i] !== newLine[i]) change = true;

      this.setLine(i, newLine, isColumn);
    }

    if (change) {
      this.moveDivs(isColumn, reverse);
      this.spawnNumber();
      if (this.isGameOver()) {
        const overlay = document.getElementById("gameOverOverlay");
        overlay.classList.add("show");
      }
    }
  },

  /**
   * Move the actual divs
   */
  moveDivs(isColumn, reverse) {
    let newTileObjects = [];

    // Build lines
    let lines = [];
    for (let i = 0; i < this.SIZE; ++i) {
      let tiles = this.tileObjects
        .filter((t) => (isColumn ? t.col === i : t.row === i))

        .sort((a, b) => {
          let key = isColumn ? "row" : "col";
          return reverse ? b[key] - a[key] : a[key] - b[key];
        });
      lines.push(tiles);
    }

    // Combine numbers, prune zeros
    for (let lineIndex = 0; lineIndex < lines.length; ++lineIndex) {
      let line = lines[lineIndex];
      for (let i = 0; i < line.length - 1; ++i) {
        if (line[i].value === line[i + 1].value) {
          line[i].value *= 2;
          line[i + 1].value = 0;
          line[i + 1].element.remove();
          ++i;
        }
      }
      line = line.filter((t) => t.value !== 0);

      // Update the divs
      for (let i = 0; i < line.length; ++i) {
        if (isColumn && reverse) line[i].row = this.SIZE - 1 - i;
        else if (isColumn) line[i].row = i;
        else if (reverse) line[i].col = this.SIZE - 1 - i;
        else line[i].col = i;

        line[i].element.firstChild.nodeValue = line[i].value;
        const x = this.GAP + line[i].col * (this.GAP + this.TILE_SIZE);
        const y = this.GAP + line[i].row * (this.GAP + this.TILE_SIZE);
        line[i].element.style.transform = `translate(${x}px, ${y}px)`;
      }
      newTileObjects.push(...line);
    }
    this.tileObjects = newTileObjects;
  },

  /**
   * Well is it?
   */
  isGameOver() {
    if (this.getFreeSquares().length > 0) return false;

    for (let y = 0; y < this.SIZE - 1; ++y) {
      for (let x = 0; x < this.SIZE - 1; ++x) {
        if (
          this.boardData[y][x] === this.boardData[y][x + 1] ||
          this.boardData[y][x] === this.boardData[y + 1][x]
        )
          return false;
      }
    }
    return true;
  },
};

Game.init();
Game.spawnNumber();

document.getElementById("retryButton").addEventListener("click", () => {
  const overlay = document.getElementById("gameOverOverlay");
  overlay.classList.remove("show");
  Game.reset();
});

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
    Game.move(e.key);
});

// Source - https://stackoverflow.com/a
// Posted by givanse, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-20, License - CC BY-SA 4.0

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      Game.move("ArrowLeft");
    } else {
      Game.move("ArrowRight");
    }
  } else {
    if (yDiff > 0) {
      Game.move("ArrowUp");
    } else {
      Game.move("ArrowDown");
    }
  }
  xDown = null;
  yDown = null;
}
