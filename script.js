// 1. Create a gameboard object. Probably just a one-dimensional array of length 9 which can be populated.

function Gameboard() {
  const board = new Array(9).fill(null);

  const printBoard = () => {
    console.log(board.slice(0, 3));
    console.log(board.slice(3, 6));
    console.log(board.slice(6, 9));
  };

  const getBoard = () => board;

  const resetBoard = () => {
    board.fill(null);
    return true;
  };

  //   function for making a move, needs to take in an argument for who made the move and where
  const makeMove = (index, player) => {
    if (index < 0 || index > 8) {
      console.log("Outside of game bounds! Use indexes 0-8");
      return false;
    }
    if (board[index] == null) {
      board[index] = player;
      printBoard();
      return true;
    } else {
      console.log("spot already taken");
      return false;
    }
  };

  return { printBoard, getBoard, makeMove, resetBoard };
}

// 2. Game object which needs to keep track of the game state. Has anyone won? Whose turn is it? Needs to interact with the gameboard.

const GameController = (function () {
  let gameOver = false;
  let isXTurn = true;
  let playerX;
  let playerO;
  let roundCount = 0;
  const board = Gameboard();

  const getBoard = () => board.getBoard();

  const startNewGame = (name1, name2) => {
    playerX = Player(name1, "X");
    playerO = Player(name2, "O");
    board.resetBoard();
    roundCount = 0;
    gameOver = false;
    isXTurn = true;
    console.log(`Game started: ${playerX.name} vs ${playerO.name}`);
  };

  const checkForWinner = (player) => {
    let winner = false;
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];
    winningCombinations.forEach((combination) => {
      const currentBoard = getBoard();
      if (
        currentBoard[combination[0]] === player.marker &&
        currentBoard[combination[1]] === player.marker &&
        currentBoard[combination[2]] === player.marker
      )
        winner = true;
    });
    if (winner) {
      gameOver = true;
      player.addPoint();
      console.log(`${player.name} Won!`);
      DisplayController.displayResult(player.name, "win");
    } else if (roundCount == 9 && !winner) {
      gameOver = true;
      console.log("draw");
      DisplayController.displayResult(player.name, "draw");
    }
  };

  const playRound = (index) => {
    if (gameOver || !playerX) {
      return;
    }
    const activePlayer = isXTurn ? playerX : playerO;

    const success = board.makeMove(index, activePlayer.marker);

    if (success) {
      roundCount++;
      checkForWinner(activePlayer);
      isXTurn = !isXTurn;
    }
  };
  return { startNewGame, playRound, getBoard };
})();

// 3. Player Object which keeps track of username and player score. Also needs to interact with the game.

function Player(name, marker) {
  let score = 0;
  const addPoint = () => score++;
  const getScore = () => score;

  return { name, marker, addPoint, getScore };
}

// Connections to UI

// Starting the game

const DisplayController = (function () {
  const uiBoard = document.querySelector("#gameboard");
  const tiles = [...uiBoard.children];
  const startBtn = document.querySelector("#startBtn");
  const playerX = document.querySelector("#playerX");
  const playerO = document.querySelector("#playerO");
  const result = document.querySelector("#result");

  const updateDisplay = (boardArray) => {
    boardArray.forEach((marker, index) => {
      tiles[index].textContent = marker || "";
    });
  };

  const displayResult = (playerName, resultFromGame) => {
    resultFromGame === "win"
      ? (result.innerHTML = `Result: ${playerName} Won!`)
      : (result.innerHTML = "Result: Draw");
  };

  const init = () => {
    for (let i = 0; i < 9; i++) {
      tiles[i].addEventListener("click", () => {
        GameController.playRound(i);
        updateDisplay(GameController.getBoard());
      });
    }

    startBtn.addEventListener("click", () => {
      const name1 = playerX.value || "Player 1";
      const name2 = playerO.value || "Player 2";
      GameController.startNewGame(name1, name2);
      updateDisplay(GameController.getBoard());
      result.innerHTML = "Result: ";
    });
  };

  return { init, displayResult };
})();

DisplayController.init();
