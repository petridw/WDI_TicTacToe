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
    readyToStart: false,
    gameInProgress: false,
    postGame: false,
    messages: [{name: "", content: ""}],
    player1: "",
    player2: ""
  };


  //------------------------------------------------------------------
  // Variables available to the View
  //------------------------------------------------------------------
  vm.currentGame = null;
  vm.games = $firebase(gamesRef).$asArray();
  // vm.recentGames = $firebase(gamesRef.limitToLast(10)).$asArray();
  vm.games.$loaded().then(setMostRecentGame, catchError);

  vm.searchString = null;
  vm.searchGame = null;
  vm.playerName = "";
  vm.playerTeam = "";
  vm.newMessage = "";
  vm.lobbySearch = null;
  vm.winMessage = "";
  vm.messageColor = "black";
  vm.messageColorStyle = {color: vm.messageColor};
  vm.hideChat = false;
  vm.hideLobbies = false;

  //------------------------------------------------------------------
  // Functions available to the View
  //------------------------------------------------------------------
  vm.addGame = addGame;
  vm.getGame = getGame;
  vm.clickSquare = clickSquare;
  vm.setCurrentGame = setCurrentGame;
  vm.joinTeam = joinTeam;
  vm.sendMessage = sendMessage;
  vm.startGame = startGame;
  vm.leaveTeam = leaveTeam;
  vm.scrollMessages = scrollMessages;
  vm.setMessageColor = setMessageColor;

  //------------------------------------------------------------------
  // Functions - Firebase
  //------------------------------------------------------------------

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Set current game to the most recent game  
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function setMostRecentGame() {

    console.log("setting current game...");

      vm.currentGame = vm.games[vm.games.length-1];


    console.log("current game set to: " + vm.currentGame.rows);

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Clear out empty games
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function clearEmptyGames() {

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Join a team
  // 
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function joinTeam(team) {
    console.log("in joinTeam...");

    console.log("game in prog? " + vm.currentGame.gameInProgress);

    //can't join a team unless you have a name and game isn't in progress already
    if ((vm.playerName.length > 0) && (!vm.currentGame.gameInProgress)) {

      if ((team === "x") && (vm.currentGame.player1 === "")) {

        //if player is switching from team "o" then...
        if (vm.playerTeam === "o") {
          vm.currentGame.player2 = "";
        }
        vm.currentGame.player1 = vm.playerName;
        vm.playerTeam = "x";
      } else if ((team === "o") && (vm.currentGame.player2 === "")) {

        //if player is already on team x then they should switch teams
        if (vm.playerTeam === "x") {
          vm.currentGame.player1 = "";
        }

        vm.currentGame.player2 = vm.playerName;
        vm.playerTeam = "o";
      }

      setGameReadyState();
      saveCurrentGame();
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Leave team
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function leaveTeam() {
    if (vm.playerTeam === "x") {
      vm.playerTeam = "";
      vm.currentGame.player1 = "";
    } else if (vm.playerTeam === "o") {
      vm.playerTeam = "";
      vm.currentGame.player2 = "";
    }

    saveCurrentGame();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Add a new game and set it to the current game
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function addGame() {
    console.log("in addGame...");

    //only make new game if current game is empty
    // if ((vm.currentGame === null) || (vm.currentGame.gameInProgress || vm.currentGame.postGame)) {
    
    vm.games.$add(blankBoard)
      .then(function(ref) {
        setCurrentGame(ref.key());
        // vm.currentGame.time = Firebase.ServerValue.TIMESTAMP;
        vm.currentGame.time = new Date().getTime();
        saveCurrentGame();
      }, catchError);
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Given a key, set the current game to that game
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function setCurrentGame(key) {
    console.log("in setCurrentGame...");
    console.log("was given key: " + key);

    vm.currentGame = getGame(key);

    //if player is on a team in the game then set it
    if (vm.playerName === vm.currentGame.player1) {
      vm.playerTeam = "x";
    } else if (vm.playerName === vm.currentGame.player2) {
      vm.playerTeam = "o";
    }

    vm.playerTeam = "";

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

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Send message
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function sendMessage() {
    console.log("in sendMessage...");
    if ((vm.playerName !== "") && (vm.newMessage !== "")) {
      vm.currentGame.messages.push({ name: vm.playerName, content: vm.newMessage });
      saveCurrentGame();

      vm.newMessage = "";

      scrollMessages();
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Save current game state to Firebase
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function saveCurrentGame() {
    console.log("saving game state...");
    vm.games.$save(vm.currentGame);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Scroll to bottom of messages window
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function scrollMessages() {
      //scroll the message list to the bottom
      var messageList = document.getElementsByClassName("message-list-container");
      messageList[0].scrollTop = messageList[0].scrollHeight;

      console.log("scrolling message window down " + messageList[0].scrollHeight + "px");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Set player's message color
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function setMessageColor() {
    vm.messageColorStyle = {color: vm.messageColor};

    console.log("style for messages: " + vm.messageColorStyle);
  }

  //------------------------------------------------------------------
  // Functions - Game Logic
  //------------------------------------------------------------------

  function clickSquare (square) {
    console.log("in clickSquare...");

    if (checkIfMyTurn()) {

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
  }

  function startGame() {
    console.log("in startGame...");

    setGameReadyState();

    console.log("ready to start: " + vm.currentGame.readyToStart);
    if (vm.currentGame.readyToStart) {
      vm.currentGame.gameInProgress = true;
      vm.currentGame.readyToStart = false;
    }

    saveCurrentGame();
  }

  function checkWinner() {
    var winningSets = [
                        vm.currentGame.rows[0],
                        vm.currentGame.rows[1],
                        vm.currentGame.rows[2],
                        [vm.currentGame.rows[0][0], vm.currentGame.rows[1][0], vm.currentGame.rows[2][0]],
                        [vm.currentGame.rows[0][1], vm.currentGame.rows[1][1], vm.currentGame.rows[2][1]],
                        [vm.currentGame.rows[0][2], vm.currentGame.rows[1][2], vm.currentGame.rows[2][2]],
                        [vm.currentGame.rows[0][0], vm.currentGame.rows[1][1], vm.currentGame.rows[2][2]],
                        [vm.currentGame.rows[2][0], vm.currentGame.rows[1][1], vm.currentGame.rows[0][2]]
                      ];

    for (var i = 0; i < winningSets.length; i++) {
      if (checkSet(winningSets[i])) {
        endGame(false);
        return true;
      }
    }
    
    if (checkTie()) {
      endGame(true);
      return true;
    }
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


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // End the game based on tie status and which player's turn
  // it was when the game ended
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function endGame(tie) {
    vm.currentGame.winner = tie ? "Cat's game!" : 
                                  (vm.currentGame.turn ? vm.currentGame.player1 + " wins!" : 
                                                         vm.currentGame.player2 + " wins!");
    vm.currentGame.gameInProgress = false;
    vm.currentGame.postGame = true;
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Check if game is ready to start
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -   
  function setGameReadyState() {
    if ((vm.currentGame.player1.length > 0) && (vm.currentGame.player2.length > 0)) {
      vm.currentGame.readyToStart = true;
      return true;
    }

    vm.currentGame.readyToStart = false;
    return false;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Check if it's the player's turn
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function checkIfMyTurn() {
    console.log("in checkIfMyTurn...");
    if (vm.currentGame.gameInProgress) {
      if ((vm.playerTeam === "x") && (vm.currentGame.turn) && (vm.playerName === vm.currentGame.player1) ||
          (vm.playerTeam === "o") && (!vm.currentGame.turn) && (vm.playerName === vm.currentGame.player2)){
        return true;
      }
    }
    return false;
  }
}


