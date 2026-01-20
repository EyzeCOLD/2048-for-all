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

    for (let row = 0; row < this.SIZE; ++row) {
      const dataRow = [];
      for (let col = 0; col < this.SIZE; ++col) {
        dataRow.push(0);
      }
      this.boardData.push(dataRow);
    }
  },

  /**
   * Creates a new tile as a div
   */
  createTile(row, col, value) {
    const newDiv = document.createElement("div");
    newDiv.className = "tile";
    newDiv.appendChild(document.createTextNode(value));

    newDiv.style.transform = `translate(${this.GAP + col * (this.GAP + this.TILE_SIZE)}px, ${this.GAP + row * (this.GAP + this.TILE_SIZE)}px)`;

    document.getElementById("board").appendChild(newDiv);

    this.tileObjects.push({
      row: row,
      col: col,
      value: value,
      element: newDiv,
    });
    console.log(`createTile(): col: ${col}, row: ${row}, val: ${value}`);
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
    const val = Math.random() < 0.9 ? 2 : 4;
    this.boardData[row][col] = val;
    this.createTile(row, col, val);
    console.log(`spawnNumber(): col: ${col}, row: ${row}, val: ${val}`);
  },

  /**
   * Process a row, eg. an array of four numbers
   */
  processLine(numbers, reverse = false) {
    if (reverse) numbers.reverse();
    // filter zeros
    numbers = numbers.filter((n) => n !== 0);
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

    return reverse ? numbers.reverse() : numbers;
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
      for (let index = 0; index < this.SIZE; index++) {
        if (isColumn) {
          let tilesInCol = this.tileObjects.filter(
            (tile) => tile.col === index,
          );
        } else {
          let tilesInRow = this.tileObjects.filter(
            (tile) => tile.row === index,
          );
        }
      }
      Game.spawnNumber();
    }
  },
};

Game.init();
Game.spawnNumber();
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
    Game.move(e.key);
  if (Game.getFreeSquares().length === 0) console.log("You lose");
});
