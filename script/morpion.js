console.log("Morpion start");

window.addEventListener('DOMContentLoaded', () => {
    setup();
});

const BOARD_STATE = {
    player: 1,
    ai: 2,
    blank: 3,
    draw: 4
};

let GAMESTATE = null;

const setup = () => {
    createBoard();
    initializeState();
}

const createBoard = () => {
    const rows = document.getElementById('rows');
    for (let x=0; 3 > x; x++) {
        const currentRow = document.createElement('div');
        currentRow.id = 'row' + x;
        currentRow.className = 'row';
        rows.appendChild(currentRow);

        for (let y = 0; 3 > y; y++) {
            const node = document.createElement('img');
            node.className = 'square';
            node.id = x + "." + y;
            node.onclick = handlePlayerClick;
            currentRow.appendChild(node);
        }
    }
}

const initializeState = () => {
    GAMESTATE = {
        turn: 'player',
        active: true
    };
}

const handlePlayerClick = (e) => {
    const isBlank = !e.target.src.length;
    if (isBlank &&
        GAMESTATE.active &&
        GAMESTATE.turn == 'player') {
        e.target.src = '../media/x.jpg';
        checkGameOver();
        AISelectMove();
    }
}

const checkGameOver = () => {
    const winner = evaluateBoard(getBoardStates());
    if (winner == null) {
        return;
    }

    GAMESTATE.active = false;

    let desc = '';

    if (winner == BOARD_STATE.ai) {
        desc = "Vous avez perdu";
    } else if (winner == BOARD_STATE.player) {
        desc = "Vous avez gagné";
    } else {
        desc = "Il y a égalité";
    }

    document.getElementById('description').innerText = desc;
}

const getBoardStates = () => {
    const boardStates = [];
    for (let x = 0; 3 > x; x++) {
        const row = [];
        for (let y = 0; 3 > y; y++) {
            const node = document.getElementById(x + '.' + y);
            if (node.src.includes('../media/x.jpg')) {
                row.push(BOARD_STATE.player);
            } else if (node.src.includes('../media/o.jpg')) {
                row.push(BOARD_STATE.ai);
            } else {
                row.push(BOARD_STATE.blank);
            }
        }
        boardStates.push(row);
    }
    return boardStates;
}

const getSquareElementNodes = () => {
    const nodes = [];
    for (let x = 0; 3 > x; x++) {
        for (let y = 0; 3 > y; y++) {
            nodes.push(document.getElementById(x + '.' + y));
        }
    }
    return nodes;
}

const highlightSquares = (blinks) => {
    if (blinks === undefined) {
        blinks == 10;
    }

    const nodes = getSquareElementNodes();
    for (const n of nodes) {
        n.className = 'square';
    }
    if (blinks >= 0) {
        setTimeout(() => {
            AISelectMove(blinks - 1);
        }, 20);
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

    if (highlightSquares(blinks)) {
        return;
    }

    const boardStates = getBoardStates();
    const [_, choice] = minimax(boardStates, BOARD_STATE.ai);

    if (choice != null) {
        const [x, y] = choice;
        document.getElementById(x + '.' + y).src = '../media/o.jpg';
    }

    checkGameOver();

    GAMESTATE.turn = 'player';
}

const evaluateBoard = (boardStates) => {
    const winningStates = [
        //horizontales
        [[0, 0],[0, 1],[0, 2]],
        [[1, 0],[1, 1],[1, 2]],
        [[2, 0],[2, 1],[2, 2]],
        [[0, 0],[1, 0],[2, 0]],
        [[0, 1],[1, 1],[2, 1]],
        [[0, 2],[1, 2],[2, 2]],

        //diagonales
        [  [0, 0],  [1, 1],  [2, 2]],
        [[2, 0],[1, 1],[0, 2]],
    ];

    for (const possibleState of winningStates) {
        let currentPlayer = null;
        let isWinner = true;
        for (const [x, y] of possibleState) {
            const occupant = boardStates[x][y];
            if (currentPlayer == null && occupant != BOARD_STATE.blank) {
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
    for (let x = 0; 3 > x; x++) {
        for (let y = 0; 3 > y; y++){
            if(boardStates[x][y] == BOARD_STATE.blank){
                hasMoves = true;
            }
        }
    }
    if(!hasMoves){
        return BOARD_STATE.draw;
    }

    return null;
}

const minimax = (boardStates, player)=>{
    //tester d'abord si la partie n'a pas déjà été gagné
    const winner = evaluateBoard(boardStates);
    if(winner == BOARD_STATE.ai){
        return [1 , null];
    }else if (winner == BOARD_STATE.player){
        return [-1, null];
    }

    let move, moveScore;
    if(player == BOARD_STATE.ai){
        [moveScore, move] = minimaxMaximize(boardStates);
    }else{
        [moveScore, move] = minimaxMinimize(boardStates);
    }

    if(move == null){
        moveScore = 0;
    }

    //aucun mouvement donc égalité
    return [moveScore, move];
}

const minimaxMaximize = (boardStates)=>{
    let moveScore = Number.NEGATIVE_INFINITY;
    let move = null;

    for(let x=0;3>x;x++){
        for(let y=0;3>y;y++ ){
            if(boardStates[x][y] == BOARD_STATE.blank){
                const newBoardStates = boardStates.map(r => r.slice());
                
                newBoardStates[x][y] = BOARD_STATE.ai;

                const [newMoveScore,_] = minimax(
                    newBoardStates,BOARD_STATE.player);

                if(newMoveScore > moveScore){
                    move = [x,y];
                    moveScore = newMoveScore;
                }
            }
        }
    }

    return [moveScore, move];
}

const minimaxMinimize = (boardStates)=>{
    let moveScore = Number.POSITIVE_INFINITY;
    let move = null;

    for(let x = 0;3>x;x++){
        for(let y =0;3>y;y++){
            if(boardStates[x][y]==BOARD_STATE.blank){
                const newBoardStates = boardStates.map(r=> r.slice());

                newBoardStates[x][y] = BOARD_STATE.player;

                const [newMoveScore, _] = minimax(
                    newBoardStates, BOARD_STATE.ai);

                if(moveScore > newMoveScore){
                    move = [x,y];
                    moveScore = newMoveScore;
                }
            }
        }
    }

    return [moveScore, move];
}
//<>