console.log('Mandeha');
let win;
let lost;
//alaina avy ary amin'ny locale storage ny win sy lost
if(localStorage.getItem("winCountMorpion")){
  win = localStorage.getItem("winCountMorpion");
}else{
  win = 0;
}
if(localStorage.getItem("lostCountMorpion")){
  lost = localStorage.getItem("lostCountMorpion");
}else{
  lost = 0;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('counts').innerText = `Victoires : ${win} Défaites : ${lost}`;
  setup();
});

//initialisation
const GRIDSTATE = {
  player: 1,
  ai: 2,
  blank: 3,
  draw: 4,
};

let GAMESTATE = null;

const setup = () => {
  createBoard();
  initializeState();
}

document.getElementById('restart').addEventListener('click',() => {
  const rows = document.getElementById('rows');
  document.getElementById('description').innerText ='';
  rows.innerHTML='';
  createBoard();
  initializeState();
})
//fonction creation table 3x3 
const createBoard = () => {
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

const initializeState = () => {
  GAMESTATE = {
    turn: 'player',
    active: true,
  };
}

const handlePlayerClick = (evt) => {
  const isBlank = !evt.target.src.length;
  if (isBlank &&
    GAMESTATE.active &&
    GAMESTATE.turn == 'player') {
    evt.target.src = 'x.png';
    checkGameOver();
    AISelectMove();
  }
}

const checkGameOver = () => {
  const winner = evaluateBoard(getGridStates());
  if (winner == null) {
    return;
  }

  GAMESTATE.active = false;

  let desc = '';

  if (winner == GRIDSTATE.ai) {
    desc = 'Vous avez perdu';
    lost++;
    localStorage.setItem("lostCountMorpion", lost);
  } else if (winner == GRIDSTATE.blank) {
    desc = 'Vous avez gagné';
    win++;
    localStorage.setItem("lostCountMorpion", lost);
  } else {
    desc = 'Il y a égalité';
  }
  document.getElementById('counts').innerText = `Victoires : ${win} Défaites : ${lost}`;
  document.getElementById('description').innerText = desc;
}

const getGridStates = () => {
  const GRIDSTATEs = [];
  for (let x = 0; x < 3; x++) {
    const row = [];
    for (let y = 0; y < 3; y++) {
      const node = document.getElementById(x + '.' + y);
      if (node.src.includes('x.png')) {
        row.push(GRIDSTATE.player);
      } else if (node.src.includes('o.png')) {
        row.push(GRIDSTATE.ai);
      } else {
        row.push(GRIDSTATE.blank);
      }
    }
    GRIDSTATEs.push(row);
  }
  return GRIDSTATEs;
}

const getSquareElementNodes = () => {
  const nodes = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      nodes.push(document.getElementById(x + '.' + y))
    }
  }
  return nodes;
}

const highlightSquares = (blinks) => {
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
    }, 10);
    const x = Math.floor(Math.random() * 3);
    const y = Math.floor(Math.random() * 3);
    const node = document.getElementById(x + '.' + y);
    node.className = 'square highlight';
    return true;
  }
  return false;
}

const AISelectMove = (blinks) => {
  GAMESTATE.turn = 'ai';

  //manao animation ohatrany hoe miheritreritra (juste pour animation)
  if (highlightSquares(blinks)) {
    return;
  }

  const GRIDSTATEs = getGridStates();
  const [_, choice] = minimax(GRIDSTATEs, GRIDSTATE.ai);

  if (choice != null) {
    const [x, y] = choice;
    document.getElementById(x + '.' + y).src = 'o.png';
  }

  checkGameOver();

  GAMESTATE.turn = 'player';
}

//toutes les états possibles pour qu'un joueur peut gagner
const evaluateBoard = (GRIDSTATEs) => {
  const winningStates = [
    // états en horizontales et verticales
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

    // états en diagonales
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

  //comparer les états des cases occupés par le joueur courant, celui qui vient de placer au tableau précédent
  //si il y a correspondance, ce joueur gagne
  for (const possibleState of winningStates) {
    let currentPlayer = null;
    //variable de teste
    let isWinner = true;

    for (const [x, y] of possibleState) {
      const occupant = GRIDSTATEs[x][y];
      if (currentPlayer == null && occupant != GRIDSTATE.blank) {
        currentPlayer = occupant;
      } else if (currentPlayer != occupant) {
        isWinner = false;
      }
    }
    //aucune correspondance alors isWinner reste inchangé donc le joueur courrent gagne
    if (isWinner) {
      return currentPlayer;
    }
  }

  let hasMoves = false;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (GRIDSTATEs[x][y] == GRIDSTATE.blank) {
        hasMoves = true;
      }
    }
  }
  if (!hasMoves) {
    return GRIDSTATE.draw;
  }

  return null;
}

const minimax = (GRIDSTATEs, player) => {
  // tester si la partie a déjà été gagné
  const winner = evaluateBoard(GRIDSTATEs);
  if (winner == GRIDSTATE.ai) {
    return [1, null];
  } else if (winner == GRIDSTATE.player) {
    return [-1, null];
  }

  let move, moveScore;
  if (player == GRIDSTATE.ai) {
    [moveScore, move] = minimaxMax(GRIDSTATEs);
  } else {
    [moveScore, move] = minimaxMin(GRIDSTATEs);
  }

  if (move == null) {
    moveScore = 0;
  }

  // No move, so it's a draw
  return [moveScore, move];
}

const minimaxMax = (GRIDSTATEs) => {
  let moveScore = Number.NEGATIVE_INFINITY;
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (GRIDSTATEs[x][y] == GRIDSTATE.blank) {
        const newGRIDSTATEs = GRIDSTATEs.map(r => r.slice());

        newGRIDSTATEs[x][y] = GRIDSTATE.ai;

        const [newMoveScore, _] = minimax(
          newGRIDSTATEs, GRIDSTATE.player);

        if (newMoveScore > moveScore) {
          move = [x, y];
          moveScore = newMoveScore;
        }
      }
    }
  }

  return [moveScore, move];
}

const minimaxMin = (GRIDSTATEs) => {
  let moveScore = Number.POSITIVE_INFINITY;
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (GRIDSTATEs[x][y] == GRIDSTATE.blank) {
        const newGRIDSTATEs = GRIDSTATEs.map(r => r.slice());

        newGRIDSTATEs[x][y] = GRIDSTATE.player;

        const [newMoveScore, _] = minimax(
          newGRIDSTATEs, GRIDSTATE.ai);

        if (newMoveScore < moveScore) {
          move = [x, y];
          moveScore = newMoveScore;
        }
      }
    }
  }

  return [moveScore, move];
}