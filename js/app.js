ticTacToeApp = angular.module('ticTacToeApp', ['firebase']);

app.controller('GameController', ['$scope', '$firebase', 
  function($scope, $firebase) {

    //---------FIREBASE---------
    var ref = new Firebase("https://petri-tic-tac-toe.firebaseio.com/games");    

    this.board = getBoard();

    setupBoard();

    function getBoard() {
      var games = $firebase(ref).$asArray();

      //add new game, once it's added get the key
      var gameKey;

      games.$add({
        rows: [],
        boardSize: 3,
        turn: true,
        winner: "",
        gameInProgress: false,
        postGame: false
      }).then(function(ref){
        gameKey = ref.key();
      });

      console.log("gameKey is: " + gameKey);
      return games.$indexFor(gameKey);

    }

    function setupBoard() {
      this.board.rows.$add({
        index: "",
        squares: []
      });

      for (var i = 0; i < this.board.rows.length; i++) {
      }
    }

    //--------------------------

    // $scope.board = [];
    // $scope.boardSize = 3;
    // $scope.turn = true;
    // $scope.winMessage = "";
    // $scope.gameInProgress = false;
    // $scope.postGame = false;

    //whenever boardSize changes, dynamically update the board
    // $scope.$watch("boardSize", function() {
    //   $scope.makeBoard();
    // });

    //Make the gameboard
//     $scope.makeBoard = function() {
   
//       $scope.board = [];
   
//       for (var i = 0; i < $scope.boardSize; i++) {
// g
//         console.log("pushing row " + i);
        
//         //add the row
//         $scope.board.push(
//         {
//           index: i,
//           cols: [],
//         });

//         //add the columns
//         for (var ii = 0; ii < $scope.boardSize; ii++) {
//           console.log("row " + i + ", pushing col " + ii);
//           $scope.board[i].cols.push(
//           {
//             index: ii,
//             val: "",
//             filled: false,
//             winner: false
//           });
//         }
//       }
//     };

 

    // $scope.getBoard = function() {

    //   $scope.resetGame();

    //   var board = $firebase(ref).$asArray();

    //   board.$loaded().then(function() {
    //     console.log("board: " + board);

    //   });

    //   for (var i = 0; i < $scope.boardSize; i++) {
    //     //add rows
    //     board.$add([{val: "heh"}, {val: "heh2"}, {val: "heh3"}]);



    //     //add squares
    //     // for (var ii = 0; ii < $scope.boardSize; ii++) {
    //     //   board[i].squares.$add({ val: "", filled: "false", winner: false});
    //     }
    // };

    $scope.clickSquare = function (col) {
      //start game if it hasn't been started
      if (!$scope.gameInProgress) {
        $scope.startGame();
      }

      //if square isn't marked, mark it & change turns
      if (!col.filled) {
        col.filled = true;

        if ($scope.turn) {
          col.val = "x";
        } else {
          col.val = "o";
        }

        $scope.checkWinner();

        //change turns
        $scope.turn = !$scope.turn;
      }


    };

    $scope.startGame = function() {
      // var sizeSlider;

      //disable the size slider so that the board can't be reset
      //during the game
      // sizeSlider = document.getElementById("size-slider");
      // sizeSlider.disabled = true;

      $scope.gameInProgress = true;
      $scope.winMessage = "";

    };

    $scope.resetGame = function() {
      // var sizeSlider;

      //enable slider
      // sizeSlider = document.getElementById("size-slider");
      // sizeSlider.disabled = false;

      $scope.gameInProgress = false;
      $scope.winMessage = "";
      $scope.turn = true;
      $scope.postGame = false;

      //make a new board
      //$scope.makeBoard();

    };

    $scope.checkWinner = function() {

      if ($scope.checkRows() || $scope.checkCols() ||  $scope.checkDiags()) {
        $scope.endGame(false);
      } else if ($scope.checkTie()) {
        $scope.endGame(true);
      }

    };

    //*****
    //if board is full, return true
    //otherwise return false
    //*****
    $scope.checkTie = function() {
      var col;
      var lineFull;

      for (var i = 0; i < $scope.board.length; i++) {
        col = $scope.board[i].cols;
        lineFull = col.filter(function(x) {
          return x.filled? true : false;
        });
        if (lineFull.length !== $scope.board.length) {
          return false;
        }
      }
      return true;
    };

    //****
    // If any row is a winner return true, otherwise false
    //****
    $scope.checkRows = function() {
      for (var i = 0; i < $scope.board.length; i++) {
        if ($scope.checkSegment($scope.board[i].cols)) { 
          // for (var ii=0; ii < $scope.board.length; ii++) { $scope.board[i].cols[ii].winner=true; }
          return true;
        }
      }
      return false;
    };

    //****
    // If any column is a winner return true, otherwise false
    //****
    $scope.checkCols = function() {
      var col;

      for (var i = 0; i < $scope.board.length; i++) {
        col = [];
        for (var ii = 0; ii < $scope.board.length; ii++) {
          col.push({ val: $scope.board[ii].cols[i].val });
        }

        if ($scope.checkSegment(col)) { return true; }
      }

      return false;
    };

    //****
    // If any diagonal is a winner return true, otherwise false
    //****
    $scope.checkDiags = function() {
      var seg1 = [];
      var seg2 = [];

      var ii = $scope.board.length-1;

      for (var i = 0; i < $scope.board.length; i++) {
        seg1.push({ val: $scope.board[i].cols[i].val });
        seg2.push({ val: $scope.board[ii].cols[i].val });

        ii--;
      }

      if ($scope.checkSegment(seg1) || $scope.checkSegment(seg2)) {
        return true;
      } else {
        return false;
      }
    };

    //****
    // Given an array of objects, check if all of object's val properties are "x", 
    // or if they're all "o". Return true in the above cases and false otherwise
    //****
    $scope.checkSegment = function(seg) {
      var allX = seg.filter(function(x){return x.val === "x";});
      var allO = seg.filter(function(x){return x.val === "o";});

      if (allX.length === seg.length) {
        return true;
      } else if (allO.length === seg.length) {
        return true;
      } else {
        return false;
      }
    };

    //****
    //End the game and display a 
    $scope.endGame = function(tie) {

      $scope.gameInProgress = false;
      $scope.postGame = true;

      if (tie) {
        $scope.winMessage = ("Tie game :(");
      } else {
        $scope.winMessage = (($scope.turn) ? "X" : "O") + " wins!!!";
      }
    };
  }
]);
