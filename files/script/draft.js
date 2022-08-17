/* cet objet contient l'état du système et son interface.
 */
let count = {
    winCount: 0,
    lostCount: 0
  }
  var p4 = {
  
    dom_board: [],
    // un entier: 1 ou 2 (le numéro du prochain player)
    turn: 1,
    /* 
       0: continue
       -1: égalité
       1: win
       2: lose
     */
    game_status: 0,
    // Nombre de move joués
    move: 0,
    // Nombre de lignes
    n: 6,
    // Nombre de colonnes
    m: 7,
  
    init: function (parent, lignes, colonnes) {
      document.getElementById('counts').innerText = `Wins : ${count.winCount} Defeats : ${count.lostCount}`;
      if (lignes) this.n = lignes;
      if (colonnes) this.m = colonnes;
  
      t = document.createElement('table');
      t.id = 'board';
  
      for (var i = this.n - 1; i >= 0; i--) {
        var tr = document.createElement('tr');
        this.dom_board[i] = [];
        for (var j = 0; j < this.m; j++) {
          var td = document.createElement('td');
          td.dataset.column = j;
  
          tr.appendChild(td);
          this.dom_board[i][j] = td;
        }
        t.appendChild(tr);
      }
      parent.innerHTML = '';
      parent.appendChild(t);
  
      t.addEventListener('click', function (e) {
        p4.handler(e);
      });
    },
  
    set: function (row, column, player) {
      // Color case
      this.dom_board[row][column].className = 'player' + player;
      this.move++;
      // tour suivant : 3 - 2 = 1, 3 - 1 = 2
      this.turn = 3 - this.turn;
    },
  
    // ajouter rond dans une colonne 
    play: function (column) {
      // Vérifier si la partie est encore en cours
      if (this.game_status != 0) {
        return;
      }
  
      // Trouver la première case libre dans la colonne
      var row;
      for (var i = 0; i < this.n; i++) {
        if (!this.dom_board[i][column].className) {
          row = i;
          break;
        }
      }
      //Si la colonne est pleine
      if (row === undefined) {
        return;
      }
  
      // Effectuer le coup
      this.set(row, column, this.turn);
  
      // Vérifier s'il y a un gagnant ou si la partie est finie
      if (this.win(row, column, 'player' + (3 - this.turn))) {
        this.game_status = 3 - this.turn;
      } else if (this.move >= this.n * this.m) {
        this.game_status = -1;
      }
  
      document.getElementById('restart').addEventListener('click',p4.resetButton);
      switch (this.game_status) {
        case -1:
          desc = 'There is equality';
          document.getElementById('description').innerText = desc;
          document.getElementById('counts').innerText = `Wins : ${count.winCount} Defeats : ${count.lostCount}`;
          break;
        case 1:
          desc = 'You have won';
          count.winCount++;
          document.getElementById('description').innerText = desc;
          document.getElementById('counts').innerText = `Wins : ${count.winCount} Defeats : ${count.lostCount}`;
          break;
        case 2:
            
          count.lostCount++;
          desc = 'You lost';
          document.getElementById('description').innerText = desc;
          document.getElementById('counts').innerText = `Wins : ${count.winCount} Defeats : ${count.lostCount}`;
          break;
      }
      
    },
  
    //le gestionnaire d'événements
    handler: function (event) {
      var column = event.target.dataset.column;
  
      //attention, les variables dans les datasets sont TOUJOURS 
      //des chaînes de caractère. Si on veut être sûr de ne pas faire de bêtise,
      //il vaut mieux la convertir en entier avec parseInt
      if (column) {
        this.play(parseInt(column));
      }
      if (this.getTurn() == 2) {
        bestMoove = this.minmax(this.getTab(), 7, Number.NEGATIVE_INFINITY, +Number.POSITIVE_INFINITY, true);
        console.log(bestMoove);
        this.play(parseInt(bestMoove["Moove"]));
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
          if (this.dom_board[i][j].className == "player1") {
            string += "1 ";
            resTab[i].push(1);
          } else if (this.dom_board[i][j].className == "player2") {
            string += "2 ";
            resTab[i].push(2);
          } else {
            string += "0 ";
            resTab[i].push(0);
          }
        }
        //console.log(string)
      }
      return resTab;
    },
    is_won: function (board, player) {
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
    is_terminal_node: function (board) {
      return (is_won(board, 1) || is_won(board, 2) || getMovePlayable(board).length == 0)
    },
    //n = ligne
    //m = colonne
    evaluate_window: function (window, player) {
      countOwn = 0;
      countAdv = 0;
      for (var i = 0; i < 4; i++) {
        if (window[i] == player) countOwn++;
        else if (window[i] != 0) countAdv++;
      }
      //console.log("countOwn : "+countOwn);
      //console.log("Count adv : "+countAdv)
      if (countOwn == 4) return 100;
      else if (countOwn == 3 && countAdv == 0) return 5;
      else if (countOwn == 2 && countAdv == 0) return 2;
      else if (countAdv == 3 && countOwn == 0) return -4;
      return 0;
    },
    score_position: function (board, player) {
      var score = 0;
      //on test toutes les lignes possibles à réaliser
      for (i = 0; i < this.n; i++) {
        for (j = 0; j < this.m - 3; j++) {
          window_test = [];
          window_test.push(board[i][j]);
          window_test.push(board[i][j + 1]);
          window_test.push(board[i][j + 2]);
          window_test.push(board[i][j + 3]);
          score += this.evaluate_window(window_test, player);
          //console.log(window_test);
        }
      }
      for (i = 0; i < this.m; i++) {
        for (j = 0; j < this.n - 3; j++) {
          window_test = [];
          window_test.push(board[j][i]);
          window_test.push(board[j + 1][i]);
          window_test.push(board[j + 2][i]);
          window_test.push(board[j + 3][i])
          score += this.evaluate_window(window_test, player);
          //console.log(window_test);
          //console.log(score)
        }
      }
      //diagonale qui monte
      for (i = 0; i < this.n - 3; i++) {
        for (j = 0; j < this.m - 3; j++) {
          window_test = []
          window_test.push(board[i][j]);
          window_test.push(board[i + 1][j + 1]);
          window_test.push(board[i + 2][j + 2]);
          window_test.push(board[i + 3][j + 3]);
          score += this.evaluate_window(window_test, player);
          //console.log(window_test);
          //console.log(score);
        }
      }
  
      for (i = 0; i < this.n - 3; i++) {
        for (j = 0; j < this.m - 3; j++) {
          window_test = [];
          window_test.push(board[i + 3][j]);
          window_test.push(board[i + 3 - 1][j + 1]); //ahah
          window_test.push(board[i + 3 - 2][j + 2]);
          window_test.push(board[i][j + 3]);
          //console.log(window_test);
          //console.log(score);
        }
      }
      return score;
    },
    getRandomInt: function (max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    get_open_row: function (board, col) {
      for (i = 0; i < this.n; i++) {
        if (board[i][col] == 0) return i;
      }
      return n - 1;
    },
    minmax: function (board, depth, alpha, beta, maximizingPlayer) {
      var valid_moove = this.getMovePlayable(board);
      var res = new Object();
      //var res = []
      is_terminal_node = this.is_won(board, 1) || this.is_won(board, 2);
      if (depth == 0 || is_terminal_node) {
        if (is_terminal_node) {
          if (this.is_won(board, 2)) {
            res["Moove"] = 'None';
            res["Score"] = Number.POSITIVE_INFINITY;
            //console.log(depth);
            //console.log(res);
            return res;
          } else if (this.is_won(board, 1)) {
            res["Moove"] = 'None';
            res["Score"] = Number.NEGATIVE_INFINITY;
            //console.log(res);
            //console.log(depth);
            //console.log(res);
            return res;
          } else {
            res["Moove"] = 'None';
            res["Score"] = 0;
            //console.log(depth);
            //console.log(res);
          }
        } else {
          res["Moove"] = 'None';
          res["Score"] = this.score_position(board, 2);
          //console.log(res);
          //console.log(depth);
          //console.log(res);
          return res;
        }
      } else {
        if (maximizingPlayer) {
          value = Number.NEGATIVE_INFINITY;
          var choices = this.getMovePlayable(board);
          var number_of_choice = choices.length;
          var column = this.getRandomInt(number_of_choice);
          for (var i = 0; i < number_of_choice; i++) {
            var tempBoard = []
            var col = choices[i];
            row = this.get_open_row(board, col);
            for (z = 0; z < this.n; z++) {
              tempBoard.push(Array.from(board[z]))
            }
            tempBoard[row][col] = 2;
            var new_score = this.minmax(tempBoard, depth - 1, alpha, beta, false)
            if (new_score["Score"] > value) {
              value = new_score["Score"];
              column = col;
            }
            var alpha = Math.max(alpha, value);
            if (alpha >= beta) {
              break;
            }
          }
          res["Moove"] = column;
          res["Score"] = value;
        } else {
          var value = Number.POSITIVE_INFINITY;
          var choices = this.getMovePlayable(board);
          var number_of_choice = choices.length;
          var column = this.getRandomInt(number_of_choice);
          for (i = 0; i < number_of_choice; i++) {
            var tempBoard = [];
            var col = choices[i];
            row = this.get_open_row(board, col);
            for (j = 0; j < this.n; j++) {
              tempBoard.push(Array.from(board[j]));
            }
            tempBoard[row][col] = 1;
            var new_score = this.minmax(tempBoard, depth - 1, alpha, beta, true)
            if (new_score["Score"] < value) {
              value = new_score["Score"];
              column = col;
            }
            var beta = Math.min(beta, value)
            if (alpha >= beta) {
              break;
            }
  
          }
          res["Moove"] = column;
          res["Score"] = value;
        }
      }
      //console.log(depth);
      //console.log(res);
      return res;
    },
  
    makeMoove: function (board) {
      bestMoove = this.minmax(this.getTab(), 2, Number.NEGATIVE_INFINITY, +Number.POSITIVE_INFINITY, 2);
      console.log(bestMoove)
    },
    /* 
     Cette fonction vérifie si le coup dans la case `row`, `column` par
     le player `cname` est un coup gagnant.
     
     Renvoie :
       true  : si la partie est gagnée par le player `cname`
       false : si la partie continue
   */
    win: function (row, column, cname) {
      // Horizontal
      var count = 0;
      for (var j = 0; j < this.m; j++) {
        count = (this.dom_board[row][j].className == cname) ? count + 1 : 0;
        if (count >= 4) return true;
      }
      // Vertical
      count = 0;
      for (var i = 0; i < this.n; i++) {
        count = (this.dom_board[i][column].className == cname) ? count + 1 : 0;
        if (count >= 4) return true;
      }
      // Diagonal
      count = 0;
      var shift = row - column;
      for (var i = Math.max(shift, 0); i < Math.min(this.n, this.m + shift); i++) {
        count = (this.dom_board[i][i - shift].className == cname) ? count + 1 : 0;
        if (count >= 4) return true;
      }
      // Anti-diagonal
      count = 0;
      shift = row + column;
      for (var i = Math.max(shift - this.m + 1, 0); i < Math.min(this.n, shift + 1); i++) {
        count = (this.dom_board[i][shift - i].className == cname) ? count + 1 : 0;
        if (count >= 4) return true;
      }
  
      return false;
    },
  
    // Cette fonction vide le board et remet à zéro l'état
    //Utilisation de p4 plutôt que this car this renvoie le bouton quand on utilise un bouton
    reset: function () {
      document.getElementById('description').innerText ='';
      for (var i = 0; i < this.n; i++) {
        for (var j = 0; j < this.m; j++) {
          this.dom_board[i][j].className = "";
        }
      }
      this.move = 0;
      this.game_status = 0;
    },
  
    resetButton: function () {
      console.log(p4.n);
      for (var i = 0; i < p4.n; i++) {
        for (var j = 0; j < p4.m; j++) {
          p4.dom_board[i][j].className = "";
        }
      }
      p4.move = 0;
      p4.game_status = 0;
      p4.turn = 1;
      var trash = document.getElementById("resultat");
      var banniere = document.getElementById("banniere");
      var trash2 = document.getElementById("bouton");
      var wrapper = document.getElementById("wrapper");
      banniere.removeChild(trash);
      wrapper.removeChild(trash2);
  
  
  
    },
  
    getTurn: function () {
      return this.turn;
    },
  
  
  }
  
  // On initialise le board et on l'ajoute à l'arbre du DOM
  // (dans la balise d'identifiant `jeu`).
  p4.init(document.querySelector('#jeu'));