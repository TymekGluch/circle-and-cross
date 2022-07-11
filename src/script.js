const CLASSES = {
  FIELD: 'game-board__field',
};
const TYPES = {
  CIRCLE: '--circle',
  CROSS: '--cross',
  WIN: '--win',
};
const WINNING = [
  ["0.0","0.1","0.2"],
  ["1.0","1.1","1.2"],
  ["2.0","2.1","2.2"],
  ["0.0","1.0","2.0"],
  ["0.1","1.1","2.1"],
  ["0.2","1.2","2.2"],
  ["0.0","1.1","2.2"],
  ["0.2","1.1","2.0"],
];
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
const usernameCircle = document.querySelector(`#username-circle`);
const usernameCross = document.querySelector(`#username-cross`);
const form = document.querySelector(`#players`);
const playerNameElement = document.querySelector(`#playername`);
const formHidden = document.querySelector(`#formHidden`);

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

const checkInputs = () => {
  const usernameCricleValue = usernameCircle.value.trim();
  const usernameCrossValue = usernameCross.value.trim();
  const isCirclePlayerError = usernameCricleValue === '';
  const isCrossPlayerError = usernameCrossValue === '';

  isCirclePlayerError ? setError(usernameCircle, 'Is empty') : setSuccess(usernameCircle);
  isCrossPlayerError ? setError(usernameCross, 'Is empty') : setSuccess(usernameCross);

  if(!isCirclePlayerError && !isCrossPlayerError) {
    playerOne.name = usernameCricleValue;
    playerTwo.name = usernameCrossValue;
    
    formHidden.classList.add(`form-section--hidden`);
    setDisabled([startButton], false);
  }
}
const setError = (input, message) => {
  const formControl = input.parentElement;
  const small = formControl.querySelector(`small`);

  small.innerText = message;

  formControl.className = 'form-section__input-container error';
}
const setSuccess = (input) => {
  const formControl = input.parentElement;

  formControl.className = 'form-section__input-container success';
}

const start = () => {
  setDisabled([...fields, refreshButton], false, (field) => {
    field.classList.remove(
      `${CLASSES.FIELD}${TYPES.CIRCLE}`,
      `${CLASSES.FIELD}${TYPES.CROSS}`,
      `${CLASSES.FIELD}${TYPES.WIN}`,
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
    playerNameElement.innerText = currentPlayer.name;
    currentBoard[row][cell] = currentPlayer.type;
    setDisabled([target], true, (field) =>
      field.classList.add(`${CLASSES.FIELD}${currentPlayer.type}`)
    );
    const winPosition = getWinPosition(currentBoard, currentPlayer.type)
    if (winPosition) {
      setDisabled(fields, true, (element) => {
        if(winPosition.includes(element.dataset.id)) {
          element.classList.add(`${CLASSES.FIELD}${TYPES.WIN}`);
        }
      });
      paused();
    } else {
      currentPlayer = [playerOne, playerTwo].find(
        (player) => player.type !== currentPlayer.type
      );
    }
  }
};

const getWinPosition = (boardArray, currentType) => {
  const winningPosition = WINNING.find((position) => {
    return position.filter((field) => {
      const [row, cell] = field.split(".");
      return boardArray[row][cell] === currentType;
    }).length === 3 ;
  });
  return !!winningPosition ? winningPosition : null;
};

const paused = () => {
  board.removeEventListener('click', round);
};

const refresh = () => {
  start();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  checkInputs();
});
startButton.addEventListener('click', start);
refreshButton.addEventListener('click', refresh);