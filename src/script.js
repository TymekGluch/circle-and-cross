const CLASSES = {
  FIELD: 'game-board__field',
};
const TYPES = {
  CIRCLE: '--circle',
  CROSS: '--cross',
};
const playerOne = {
  name: 'Ryszard',
  type: TYPES.CIRCLE,
};
const playerTwo = {
  name: 'Maciek',
  type: TYPES.CROSS,
};

const startButton = document.querySelector(`#start-button`);
const board = document.querySelector(`#board`);
const refreshButton = document.querySelector(`#refresh-button`);
const fields = Array.from(document.querySelectorAll(`.${CLASSES.FIELD}`));

let currentPlayer = playerOne;
let currentBoard;

const createBoard = () => {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
};
const setDisabled = (elements = [], isDisabled = true, callback = () => {}) => {
  elements.forEach((element) => {
    element.disabled = isDisabled;
    callback(element);
  });
};

const start = () => {
  setDisabled([...fields, refreshButton], false, (field) => {
    field.classList.remove(
      `${CLASSES.FIELD}${TYPES.CIRCLE}`,
      `${CLASSES.FIELD}${TYPES.CROSS}`
    );
  });
  setDisabled([startButton, true]);
  currentBoard = createBoard();
  currentPlayer = playerOne;
  board.addEventListener('click', round);
};

const round = (event) => {
  const { target } = event;
  if (
    target.classList.contains(CLASSES.FIELD) &&
    !target.classList.contains(`${CLASSES.FIELD}${TYPES.CIRCLE}`) &&
    !target.classList.contains(`${CLASSES.FIELD}${TYPES.CROSS}`)
  ) {
    const [row, cell] = target.dataset.id.split('.');
    currentBoard[row][cell] = currentPlayer.type;
    setDisabled([target], true, (field) =>
      field.classList.add(`${CLASSES.FIELD}${currentPlayer.type}`)
    );
    if (isWin(currentBoard, currentPlayer.type)) {
      setDisabled(fields, true);
      paused();
    } else {
      currentPlayer = [playerOne, playerTwo].find(
        (player) => player.type !== currentPlayer.type
      );
    }
  }
};

const isWin = (boardArray, currentType) => {
  if (
    boardArray.filter(
      (row) => row.filter((item) => item === currentType).length === 3
    ).length >= 1
  ) {
    return true;
  }
  if (
    Array.from({ length: 3 }).filter((_, col) => {
      const column = boardArray.map((array) => array[col]);
      return column.filter((cell) => cell === currentType).length === 3;
    }).length >= 1
  ) {
    return true;
  }
  if (
    (boardArray[0][0] === currentType &&
      boardArray[1][1] === currentType &&
      boardArray[2][2] === currentType) ||
    (boardArray[0][2] === currentType &&
      boardArray[1][1] === currentType &&
      boardArray[2][0] === currentType)
  ) {
    return true;
  }
  return false;
};

const paused = () => {
  board.removeEventListener('click', round);
};

const refresh = () => {
  start();
};

startButton.addEventListener('click', start);
refreshButton.addEventListener('click', refresh);