let win;
let lost;
 
//alaina avy ary amin'ny locale storage ny win sy lost
if (localStorage.getItem("winCountLine")) {
  win = localStorage.getItem("winCountLine");
} else {
  win = 0;
}
if (localStorage.getItem("lostCountLine")) {
  lost = localStorage.getItem("lostCountLine");
} else {
  lost = 0;
}

var ligne4 = {
  //tableau board
  boardEl: [],
  // 1 joueur , 2 IA
  turn: 1,

  //   0: contiue
  //  -1: egalité
  //   1:victoire
  //   2: perdu

  GAMESTATE: 0,
  moves: 0,
  //n lignes m cols
  n: 6,
  m: 7,
  init: function (parent, lignes, colonnes) {
    document.getElementById('counts').innerText = `Victoires : ${win} Défaites : ${lost}`;
    if (lignes) this.n = lignes;
    if (colonnes) this.m = colonnes;

    t = document.createElement('table');
    t.id = 'board';

    for (var i = this.n - 1; i >= 0; i--) {
      var tr = document.createElement('tr');
      this.boardEl[i] = [];
      for (var j = 0; j < this.m; j++) {
        var td = document.createElement('td');
        td.dataset.column = j;

        tr.appendChild(td);
        this.boardEl[i][j] = td;
      }
      t.appendChild(tr);
    }
    parent.innerHTML = '';
    parent.appendChild(t);

    t.addEventListener('click', function (e) {
      ligne4.handler(e);
    });
  },

  set: function (row, column, player) {
    // On colore la case
    this.boardEl[row][column].className = 'player' + player;
    // On compte le coup
    this.moves++;
    // On passe le tour : 3 - 2 = 1, 3 - 1 = 2
    this.turn = 3 - this.turn;
  },

  //manampy occupation ray
  play: function (column) {
    // vérifier si la partie est encore en cours
    if (this.GAMESTATE != 0) {
      return;
    }

    // trouver la première case libre dans la colonne
    var row;
    for (var i = 0; i < this.n; i++) {
      if (!this.boardEl[i][column].className) {
        row = i;
        break;
      }
    }
    //colonne est pleine
    if (row === undefined) {
      return;
    }

    this.set(row, column, this.turn);

    // check si il y a gagant ou board plein
    if (this.win(row, column, 'player' + (3 - this.turn))) {
      this.GAMESTATE = 3 - this.turn;
    } else if (this.moves >= this.n * this.m) {
      this.GAMESTATE = -1;
    }

    document.getElementById('restart').addEventListener('click', ligne4.resetButton);
    switch (this.GAMESTATE) {

      case -1:
        desc = 'Il y a égalité';
        document.getElementById('counts').innerText = `Victoires : ${win} Défaites : ${lost}`;
        document.getElementById('description').innerText = desc;
        break;

      case 1:
        desc = 'Vous avez gagné';
        win++;
        localStorage.setItem("winCountLine", win);
        document.getElementById('counts').innerText = `Victoires : ${win} Défaites : ${lost}`;
        document.getElementById('description').innerText = desc;
        break;

      case 2:
        lost++;
        localStorage.setItem("lostCountLine", lost);
        desc = 'Vous avez perdu';
        document.getElementById('counts').innerText = `Victoires : ${win} Défaites : ${lost}`;
        document.getElementById('description').innerText = desc;
        break;
    }

  },


  handler: function (event) {
    var column = event.target.dataset.column;

    if (column) {
      this.play(parseInt(column));
    }
    if (this.getTurn() == 2) {
      bestMove = this.minmax(this.getTab(), 7, Number.NEGATIVE_INFINITY, +Number.POSITIVE_INFINITY, true);
      this.play(parseInt(bestMove["move"]));
    }
  },

  getTab: function () {
    var resTab = []
    for (var i = 0; i < this.n; i++) {
      resTab.push([]);
    }
    for (var i = this.n - 1; i >= 0; i--) {
      var string = "";
      for (var j = 0; j < this.m; j++) {
        if (this.boardEl[i][j].className == "player1") {
          string += "1 ";
          resTab[i].push(1);
        } else if (this.boardEl[i][j].className == "player2") {
          string += "2 ";
          resTab[i].push(2);
        } else {
          string += "0 ";
          resTab[i].push(0);
        }
      }
    }
    return resTab;
  },
  isWon: function (board, player) {
    // On vérifie les ligne
    for (var i = 0; i < this.m - 3; i++) {
      for (var j = 0; j < this.n; j++) {
        if (board[j][i] == player && board[j][i + 1] == player && board[j][i + 2] == player && board[j][i + 3] == player) {
          return true;
        }
      }
    }
    //On vérifie les colonnes
    for (var i = 0; i < this.m; i++) {
      for (var j = 0; j < this.n - 3; j++) {
        if (board[j][i] == player && board[j + 1][i] == player && board[j + 2][i] == player && board[j + 3][i] == player) {
          return true;
        }
      }
    }
    //on vérifie les diagonales qui montent
    for (var i = 0; i < this.m - 3; i++) {
      for (var j = 0; j < this.n - 3; j++) {
        if (board[j][i] == player && board[j + 1][i + 1] == player && board[j + 2][i + 2] == player && board[j + 3][i + 3] == player) {
          return true;
        }
      }
    }
    //on vérifie les diagonales qui descendent
    for (var i = 0; i < this.m - 3; i++) {
      for (var j = 3; j < this.n; j++) {
        if (board[j][i] == player && board[j - 1][i + 1] == player && board[j - 2][i + 2] == player && board[j - 3][i + 3] == player) {
          return true;
        }
      }
    }
    return false;
  },

  getMovePlayable: function (board) {
    var resTab = [];
    for (var j = 0; j < this.m; j++) {
      if (board[this.n - 1][j] == 0) resTab.push(j)
    }
    return resTab;
  },
  isTerminal: function (board) {
    return (isWon(board, 1) || isWon(board, 2) || getMovePlayable(board).length == 0)
  },
  //n = ligne
  //m = colonne
  evaluate: function (window, player) {
    countOwn = 0;
    countAdv = 0;
    for (var i = 0; i < 4; i++) {
      if (window[i] == player) countOwn++;
      else if (window[i] != 0) countAdv++;
    }
    if (countOwn == 4) return 100;
    else if (countOwn == 3 && countAdv == 0) return 5;
    else if (countOwn == 2 && countAdv == 0) return 2;
    else if (countAdv == 3 && countOwn == 0) return -4;
    return 0;
  },
  scorePosition: function (board, player) {
    var score = 0;
    //on test toutes les lignes possibles à réaliser
    for (i = 0; i < this.n; i++) {
      for (j = 0; j < this.m - 3; j++) {
        test = [];
        test.push(board[i][j]);
        test.push(board[i][j + 1]);
        test.push(board[i][j + 2]);
        test.push(board[i][j + 3]);
        score += this.evaluate(test, player);
      }
    }
    for (i = 0; i < this.m; i++) {
      for (j = 0; j < this.n - 3; j++) {
        test = [];
        test.push(board[j][i]);
        test.push(board[j + 1][i]);
        test.push(board[j + 2][i]);
        test.push(board[j + 3][i])
        score += this.evaluate(test, player);
      }
    }
    //diagonale qui monte
    for (i = 0; i < this.n - 3; i++) {
      for (j = 0; j < this.m - 3; j++) {
        test = []
        test.push(board[i][j]);
        test.push(board[i + 1][j + 1]);
        test.push(board[i + 2][j + 2]);
        test.push(board[i + 3][j + 3]);
        score += this.evaluate(test, player);
      }
    }

    for (i = 0; i < this.n - 3; i++) {
      for (j = 0; j < this.m - 3; j++) {
        test = [];
        test.push(board[i + 3][j]);
        test.push(board[i + 3 - 1][j + 1]);
        test.push(board[i + 3 - 2][j + 2]);
        test.push(board[i][j + 3]);
      }
    }
    return score;
  },
  getRandomInt: function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
  getFreeRow: function (board, col) {
    for (i = 0; i < this.n; i++) {
      if (board[i][col] == 0) return i;
    }
    return n - 1;
  },
  minmax: function (board, depth, alpha, beta, maximizingPlayer) {
    var validMove = this.getMovePlayable(board);
    var res = new Object();
    isTerminal = this.isWon(board, 1) || this.isWon(board, 2);
    if (depth == 0 || isTerminal) {
      if (isTerminal) {

        if (this.isWon(board, 2)) {

          res["move"] = 'None';
          res["Score"] = Number.POSITIVE_INFINITY;
          return res;

        } else if (this.isWon(board, 1)) {

          res["move"] = 'None';
          res["Score"] = Number.NEGATIVE_INFINITY;
          return res;

        } else {

          res["move"] = 'None';
          res["Score"] = 0;

        }
      } else {

        res["move"] = 'None';
        res["Score"] = this.scorePosition(board, 2);
        return res;

      }
    } else {

      if (maximizingPlayer) {

        value = Number.NEGATIVE_INFINITY;
        var choices = this.getMovePlayable(board);
        var nombreDeChoix = choices.length;
        var column = this.getRandomInt(nombreDeChoix);

        for (var i = 0; i < nombreDeChoix; i++) {

          var tempBoard = []
          var col = choices[i];
          row = this.getFreeRow(board, col);

          for (z = 0; z < this.n; z++) {
            tempBoard.push(Array.from(board[z]));
          }
          tempBoard[row][col] = 2;
          var newScore = this.minmax(tempBoard, depth - 1, alpha, beta, false);

          if (newScore["Score"] > value) {

            value = newScore["Score"];
            column = col;

          }
          var alpha = Math.max(alpha, value);
          if (alpha >= beta) {
            break;
          }
        }
        res["move"] = column;
        res["Score"] = value;
      } else {
        var value = Number.POSITIVE_INFINITY;
        var choices = this.getMovePlayable(board);
        var nombreDeChoix = choices.length;
        var column = this.getRandomInt(nombreDeChoix);
        for (i = 0; i < nombreDeChoix; i++) {
          var tempBoard = [];
          var col = choices[i];
          row = this.getFreeRow(board, col);
          for (j = 0; j < this.n; j++) {
            tempBoard.push(Array.from(board[j]));
          }
          tempBoard[row][col] = 1;
          var newScore = this.minmax(tempBoard, depth - 1, alpha, beta, true)
          if (newScore["Score"] < value) {
            value = newScore["Score"];
            column = col;
          }
          var beta = Math.min(beta, value)
          if (alpha >= beta) {
            break;
          }

        }
        res["move"] = column;
        res["Score"] = value;
      }
    }
    return res;
  },

  makemove: function (board) {
    bestMove = this.minmax(this.getTab(), 2, Number.NEGATIVE_INFINITY, +Number.POSITIVE_INFINITY, 2);
  },
  
  // true si la partie est gagnée par le player cname
  // false si la partie continue
 
  win: function (row, column, cname) {
    // Horizontale
    var count = 0;
    for (var j = 0; j < this.m; j++) {
      count = (this.boardEl[row][j].className == cname) ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Verticale
    count = 0;
    for (var i = 0; i < this.n; i++) {
      count = (this.boardEl[i][column].className == cname) ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Diagonale
    count = 0;
    var shift = row - column;
    for (var i = Math.max(shift, 0); i < Math.min(this.n, this.m + shift); i++) {
      count = (this.boardEl[i][i - shift].className == cname) ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // diagonale inverse
    count = 0;
    shift = row + column;
    for (var i = Math.max(shift - this.m + 1, 0); i < Math.min(this.n, shift + 1); i++) {
      count = (this.boardEl[i][shift - i].className == cname) ? count + 1 : 0;
      if (count >= 4) return true;
    }

    return false;
  },

  // Cette fonction vide le board et remet à zéro l'état
  reset: function () {
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.m; j++) {
        this.boardEl[i][j].className = "";
      }
    }
    this.moves = 0;
    this.GAMESTATE = 0;
  },

  resetButton: function () {
    document.getElementById('description').innerText = '';
    for (var i = 0; i < ligne4.n; i++) {
      for (var j = 0; j < ligne4.m; j++) {
        ligne4.boardEl[i][j].className = "";
      }
    }
    ligne4.moves = 0;
    ligne4.GAMESTATE = 0;
    ligne4.turn = 1;
  },
  getTurn: function () {
    return this.turn;
  },
}

// init dans row
ligne4.init(document.querySelector('#rows'));