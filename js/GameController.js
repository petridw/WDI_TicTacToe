angular
  .module("ticTacToeApp")
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
    postGame: false
  };

  //------------------------------------------------------------------
  // Variables available to the View
  //------------------------------------------------------------------
  vm.games = $firebase(gamesRef).$asArray();
  vm.currentGame = null;
  vm.searchString = null;
  vm.searchGame = null;

  //------------------------------------------------------------------
  // Functions available to the View
  //------------------------------------------------------------------
  vm.resetGame = resetGame;
  vm.getGame = getGame;
  vm.clickSquare = clickSquare;

  //------------------------------------------------------------------
  // Functions - Firebase
  //------------------------------------------------------------------

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Add a new game and set it to the current game
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function addGame() {
    console.log("in addGame...");

    var key;

    vm.games.$add(blankBoard)
      .then(setCurrentGame, catchError);

  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Given a key, set the current game to that game
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function setCurrentGame(ref) {
    console.log("in setCurrentGame...");

    var key = ref.key();

    vm.currentGame = getGame(key);

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Get a specific game reference
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function getGame(key) {
    //needs to return a game $asObject
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
    if (vm.currentGame.gameInProgress) {
      startGame();
    }

    //if square isn't marked, mark it & change turns
    if (!square.filled) {
      square.filled = true;

      square.val = vm.currentGame.turn ? "x" : "o";

      //$scope.checkWinner();

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
    vm.currentGame.winMessage = "";

  }

  function checkWinner() {
    if (checkRows() || checkCols() || checkDiags()) {
      
    }
  }


}