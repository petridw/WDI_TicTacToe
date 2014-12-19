angular
  .module("ticTacToeApp", ['firebase'])
  .controller("GameController", ['$firebase', GameController]);

function GameController($firebase) {

  var vm = this;

  //------------------------------------------------------------------
  // Local variables (only in controller's scope)
  //------------------------------------------------------------------
  var gamesRef = new Firebase("https://petri-tic-tac-toe.firebaseio.com/games");

  var blankBoard = {
    rows: [ [ { val: "", filled: false, winner: false },
              { val: "", filled: false, winner: false },
              { val: "", filled: false, winner: false } ],
            [ { val: "", filled: false, winner: false },
              { val: "", filled: false, winner: false },
              { val: "", filled: false, winner: false } ], 
            [ { val: "", filled: false, winner: false },
              { val: "", filled: false, winner: false },
              { val: "", filled: false, winner: false } ]
          ],
    turn: true,
    winner: "",
    gameInProgress: false,
    postGame: false,
    messages: [{name: "", message: ""}],
    player1: "",
    player2: ""
  };

  //------------------------------------------------------------------
  // Variables available to the View
  //------------------------------------------------------------------
  vm.games = $firebase(gamesRef).$asArray();
  vm.recentGames = $firebase(gamesRef.limitToLast(10)).$asArray();
  vm.currentGame = null;
  vm.searchString = null;
  vm.searchGame = null;

  //------------------------------------------------------------------
  // Functions available to the View
  //------------------------------------------------------------------
  vm.resetGame = resetGame;
  vm.getGame = getGame;
  vm.clickSquare = clickSquare;
  vm.setCurrentGame = setCurrentGame;

  //------------------------------------------------------------------
  // Functions - Firebase
  //------------------------------------------------------------------

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Add a new game and set it to the current game
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function addGame() {
    console.log("in addGame...");

    //only make new game if current game is empty
    if ((vm.currentGame === null) || (vm.currentGame.gameInProgress || vm.currentGame.postGame)) {
      vm.games.$add(blankBoard)
        .then(function(ref) {
          setCurrentGame(ref.key());
          // vm.currentGame.time = Firebase.ServerValue.TIMESTAMP;
          vm.currentGame.time = new Date().getTime();
          saveCurrentGame();
        }, catchError);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Set datetime of blank board to now
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function setDate() {
    blankBoard.date = new Date().getTime();
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Given a key, set the current game to that game
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function setCurrentGame(key) {
    console.log("in setCurrentGame...");
    console.log("was given key: " + key)

    vm.currentGame = getGame(key);

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Return reference to a specific game, given the key
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function getGame(key) {
    console.log("in getGame...");

    var game = vm.games.$getRecord(key);

    return game;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Reset the play area to a fresh state
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function resetGame() {
    console.log("in resetGame...");

    addGame();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Catch errors from angular fire promises and log them
  // to console
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function catchError(error) {
    console.error("in catchError: ", error);
  }

  //------------------------------------------------------------------
  // Functions - Game Logic
  //------------------------------------------------------------------

  function clickSquare (square) {
    //start game if it hasn't been started
    if (!vm.currentGame.gameInProgress) {
      startGame();
    }

    //if square isn't marked, mark it & change turns
    if (!square.filled) {
      square.filled = true;

      square.val = vm.currentGame.turn ? "x" : "o";

      checkWinner();

      //change turns
      vm.currentGame.turn = !vm.currentGame.turn;

      //send changes to firebase
      saveCurrentGame();
    }
  }

  function saveCurrentGame() {
    console.log("saving game state...");
    vm.games.$save(vm.currentGame);
  }

  function startGame() {
    vm.currentGame.gameInProgress = true;
  }

  function checkWinner() {
    if (checkRows() || checkCols() || checkDiags()) {
      endGame(false);
    } else if (checkTie()) {
      endGame(true);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Check all rows on current gameboard for a winner
  // return true if there's a winner, false otherwise
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function checkRows() {
    console.log("in checkRows...");

    for (var i = 0; i < vm.currentGame.rows.length; i++) {
      if (checkSet(vm.currentGame.rows[i])) 
        return true;
    }
    return false;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Check all columns on current gameboard for a winner
  // return true if there's a winner, false otherwise
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function checkCols() {
    console.log("in checkCols...");

    var setToCheck;

    for (var i = 0; i < vm.currentGame.rows.length; i++) {
      set = [];

      //build a set (array) of all squares at this column index
      for (var ii = 0; ii < vm.currentGame.rows.length; ii++) {
        set[ii] = vm.currentGame.rows[ii][i];
      }
      if (checkSet(set)) return true;
    }
    return false;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Check all diags on current gameboard for a winner
  // return true if there's a winner, false otherwise
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function checkDiags() {
    var set1 = [vm.currentGame.rows[0][0],
                vm.currentGame.rows[1][1],
                vm.currentGame.rows[2][2]];
    var set2 = [vm.currentGame.rows[2][0],
                vm.currentGame.rows[1][1],
                vm.currentGame.rows[0][2]];

    if (checkSet(set1) || checkSet(set2)) return true;

    return false;
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // If every spot on the gameboard is taken, return true
  // otherwise return false
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function checkTie() {
    console.log("in checkTie...");

    var allFilled = vm.currentGame.rows.every(function(row){
      return row.every(function(square){
        return (square.val !== "");
      });
    });

    return allFilled;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Given an array of squares, check if it's a winning set
  //   - if it's a winning set, then set their "winner" boolean
  //     to true
  // Returns: true - entire set is "x", or entire set is "o"
  //          false - otherwise
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function checkSet(squares) {
      var winner = false;

      var allX = squares.every(function(square){return square.val ==="x";});
      var allO = squares.every(function(square){return square.val ==="o";});

      if (allX || allO) {
        winner = true;

        //set "winner" prop for each square to true so view can show the winning set
        squares.forEach(function(c, i, squares) {squares[i].winner = true;});
      }

      return winner;
  }

  function endGame(tie) {
    vm.currentGame.winner = tie ? "Cat's game!" : (vm.currentGame.turn ? "X wins!" : "O wins!");
    vm.currentGame.gameInProgress = false;
    vm.currentGame.postGame = true;
  }

  function gameIsEmpty() {
    return false;
  }

}