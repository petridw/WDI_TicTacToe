angular
  .module("ticTacToeApp")
  .controller("GameController", ['$firebase', GameController]);

function GameController($firebase) {
  //------------------------------------------------------------------
  // Local variables (only in controller's scope)
  //------------------------------------------------------------------
  var gamesRef = new Firebase("https://petri-tic-tac-toe.firebaseio.com/games");

  //blank game template
  var blankBoard = {
    rows: {  row1: {
            s1: { val: "", filled: false, winner: false },
            s2: { val: "", filled: false, winner: false },
            s3: { val: "", filled: false, winner: false }
          }, row2: {
            s1: { val: "", filled: false, winner: false },
            s2: { val: "", filled: false, winner: false },
            s3: { val: "", filled: false, winner: false },
          }, row3: {
            s1: { val: "", filled: false, winner: false },
            s2: { val: "", filled: false, winner: false },
            s3: { val: "", filled: false, winner: false },
          }},
    turn: "x",
    winner: "",
    gameInProgress: false,
    postGame: false
  };

  //------------------------------------------------------------------
  // Properties available to the View
  //------------------------------------------------------------------
  this.board = {};

  //------------------------------------------------------------------
  // Functions available to the View
  //------------------------------------------------------------------
  this.resetBoard = resetBoard;

  //------------------------------------------------------------------
  // Functions
  //------------------------------------------------------------------

  //******************************************************
  // Add a new game board to the /games/ firebase 
  //******************************************************
  function getNewBoard() {
    console.log("in getNewBoard...");

    var games = $firebase(gamesRef).$asArray();

    //once games is loaded
    games.$loaded().then(function(ref) {
      games.$add(blankBoard).then(function(ref) {
        var key = ref.key();
        console.log("added record with key: " + key);

        this.board = games.$getRecord(key);
        console.log("have new board: " + this.board);

      }, catchError);
    }, catchError);

    var newestGame = games[games.length];

    console.log("newest game: " + newestGame);
  }

  function resetBoard() {
    console.log("in resetBoard()");

    this.board = getNewBoard();
  }

  function catchError(error) {
    console.error("in catchError: ", error);
  }









}