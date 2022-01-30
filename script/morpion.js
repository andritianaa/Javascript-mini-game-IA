console.log('Mandeha');

window.addEventListener('DOMContentLoaded', () => {
  setup();
});

//initialisation
const BOARDSTATE = {
  player: 1,
  ai: 2,
  blank: 3,
  draw: 4,
};

let GAMESTATE = null;

function setup() {
  createBoard();
  initializeState();
}

//fonction creation table 3x3 
function createBoard() {
  const rows = document.getElementById('rows');
  for (let x = 0; x < 3; x++) {
    const currentRow = document.createElement('div');
    currentRow.id = 'row' + x;
    currentRow.className = 'row';
    rows.appendChild(currentRow);

    for (let y = 0; y < 3; y++) {
      const node = document.createElement('img');
      node.className = 'square';
      //identifiant case
      node.id = x + '.' + y;
      node.onclick = handlePlayerClick;
      currentRow.appendChild(node);
    }
  }
}

function initializeState() {
  GAMESTATE = {
    turn: 'player',
    active: true,
  };
}

function handlePlayerClick(evt) {
  const isBlank = !evt.target.src.length;
  if (isBlank &&
    GAMESTATE.active &&
    GAMESTATE.turn == 'player') {
    evt.target.src = 'x.png';
    checkGameOver();
    AISelectMove();
  }
}

function checkGameOver() {
  const winner = evaluateBoard(getBoardStates());
  if (winner == null) {
    return;
  }

  GAMESTATE.active = false;

  let desc = '';

  if (winner == BOARDSTATE.ai) {
    desc = 'Vous avez perdu';
  } else if (winner == BOARDSTATE.player) {
    desc = 'Vous avez gagné';
  } else {
    desc = 'Il y a égalité'
  }

  document.getElementById('description').innerText = desc;
}

function getBoardStates() {
  const boardStates = [];
  for (let x = 0; x < 3; x++) {
    const row = [];
    for (let y = 0; y < 3; y++) {
      const node = document.getElementById(x + '.' + y);
      if (node.src.includes('x.png')) {
        row.push(BOARDSTATE.player);
      } else if (node.src.includes('o.png')) {
        row.push(BOARDSTATE.ai);
      } else {
        row.push(BOARDSTATE.blank);
      }
    }
    boardStates.push(row);
  }
  return boardStates;
}

function getSquareElementNodes() {
  const nodes = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      nodes.push(document.getElementById(x + '.' + y))
    }
  }
  return nodes;
}

function highlightSquares(blinks) {
  if (blinks === undefined) {
    blinks = 5;
  }

  const nodes = getSquareElementNodes();
  for (const n of nodes) {
    n.className = 'square';
  }
  if (blinks >= 0) {
    setTimeout(() => {
      AISelectMove(blinks - 1);
    }, 250);
    const x = Math.floor(Math.random() * 3);
    const y = Math.floor(Math.random() * 3);
    const node = document.getElementById(x + '.' + y);
    node.className = 'square highlight';
    return true;
  }
  return false;
}

function AISelectMove(blinks) {
  GAMESTATE.turn = 'ai';

//manao animation ohatrany hoe miheritreritra (juste pour animation)
  if (highlightSquares(blinks)) {
    return;
  }

  const boardStates = getBoardStates();
  const [_, choice] = minimax(boardStates, BOARDSTATE.ai);

  if (choice != null) {
    const [x, y] = choice;
    document.getElementById(x + '.' + y).src = 'o.png';
  }

  checkGameOver();

  GAMESTATE.turn = 'player';
}

function evaluateBoard(boardStates) {
  const winningStates = [
    // Horizontales
    [
      [0, 0],
      [0, 1],
      [0, 2]
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2]
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0]
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1]
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2]
    ],

    // Diagonales
    [
      [0, 0],
      [1, 1],
      [2, 2]
    ],
    [
      [2, 0],
      [1, 1],
      [0, 2]
    ],
  ];

  for (const possibleState of winningStates) {
    let currentPlayer = null;
    let isWinner = true;
    for (const [x, y] of possibleState) {
      const occupant = boardStates[x][y];
      if (currentPlayer == null && occupant != BOARDSTATE.blank) {
        currentPlayer = occupant;
      } else if (currentPlayer != occupant) {
        isWinner = false;
      }
    }
    if (isWinner) {
      return currentPlayer;
    }
  }

  let hasMoves = false;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARDSTATE.blank) {
        hasMoves = true;
      }
    }
  }
  if (!hasMoves) {
    return BOARDSTATE.draw;
  }

  return null;
}

function minimax(boardStates, player) {
  // First check if the game has already been won.
  const winner = evaluateBoard(boardStates);
  if (winner == BOARDSTATE.ai) {
    return [1, null];
  } else if (winner == BOARDSTATE.player) {
    return [-1, null];
  }

  let move, moveScore;
  if (player == BOARDSTATE.ai) {
    [moveScore, move] = minimaxMaximize(boardStates);
  } else {
    [moveScore, move] = minimaxMinimize(boardStates);
  }

  if (move == null) {
    moveScore = 0;
  }

  // No move, so it's a draw
  return [moveScore, move];
}

function minimaxMaximize(boardStates) {
  let moveScore = Number.NEGATIVE_INFINITY;
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARDSTATE.blank) {
        const newBoardStates = boardStates.map(r => r.slice());

        newBoardStates[x][y] = BOARDSTATE.ai;

        const [newMoveScore, _] = minimax(
          newBoardStates, BOARDSTATE.player);

        if (newMoveScore > moveScore) {
          move = [x, y];
          moveScore = newMoveScore;
        }
      }
    }
  }

  return [moveScore, move];
}

function minimaxMinimize(boardStates) {
  let moveScore = Number.POSITIVE_INFINITY;
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARDSTATE.blank) {
        const newBoardStates = boardStates.map(r => r.slice());

        newBoardStates[x][y] = BOARDSTATE.player;

        const [newMoveScore, _] = minimax(
          newBoardStates, BOARDSTATE.ai);

        if (newMoveScore < moveScore) {
          move = [x, y];
          moveScore = newMoveScore;
        }
      }
    }
  }

  return [moveScore, move];
}


function minimax2(boardStates, aiTurn) {
  // First check if the game has already been won.
  const winner = evaluateBoard(boardStates);
  if (winner == BOARDSTATE.ai) {
    return [1, null];
  } else if (winner == BOARDSTATE.player) {
    return [-1, null];
  }

  let moveCost = Number.NEGATIVE_INFINITY;
  if (!aiTurn) {
    moveCost = Number.POSITIVE_INFINITY;
  }
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARDSTATE.blank) {
        const newBoardStates = boardStates.map(r => r.slice());

        if (aiTurn) {
          newBoardStates[x][y] = BOARDSTATE.ai;
        } else {
          newBoardStates[x][y] = BOARDSTATE.player;
        }

        const [newMoveCost, _] = minimax(newBoardStates, !aiTurn);

        if (aiTurn) {
          if (newMoveCost > moveCost) {
            move = [x, y];
            moveCost = newMoveCost;
          }
        } else {
          if (newMoveCost < moveCost) {
            move = [x, y];
            moveCost = newMoveCost;
          }
        }
      }
    }
  }

  if (move != null) {
    return [moveCost, move];
  }

  // No move, so it's a draw
  return [0, null];
}