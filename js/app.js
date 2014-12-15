app = angular.module('ticTacToeApp', []);

app.controller('GameController', ['$scope', function($scope) {

  $scope.board = [];
  $scope.boardSize = 3;
  $scope.turn = true;
  $scope.winMessage = "";
  $scope.gameInProgress = false;
  $scope.postGame = false;

  //whenever boardSize changes, dynamically update the board
  $scope.$watch("boardSize", function() {
    $scope.makeBoard();
  });

  $scope.makeBoard = function() {
 
    $scope.board = [];
 
    for (var i = 0; i < $scope.boardSize; i++) {

      console.log("pushing row " + i);
      
      //add the row
      $scope.board.push(
      {
        index: i,
        cols: [],
      });

      //add the columns
      for (var ii = 0; ii < $scope.boardSize; ii++) {
        console.log("row " + i + ", pushing col " + ii);
        $scope.board[i].cols.push(
        {
          index: ii,
          val: "",
          filled: false
        });
      }
    }
  };

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
    var sizeSlider;

    //disable the size slider so that the board can't be reset
    //during the game
    sizeSlider = document.getElementById("size-slider");
    sizeSlider.disabled = true;

    $scope.gameInProgress = true;
    $scope.winMessage = "";

  };

  $scope.resetGame = function() {
    var sizeSlider;

    //enable slider
    sizeSlider = document.getElementById("size-slider");
    sizeSlider.disabled = false;

    $scope.gameInProgress = false;
    $scope.winMessage = "";
    $scope.turn = true;
    $scope.postGame = false;

    //make a new board
    $scope.makeBoard();

  };

  $scope.checkWinner = function() {

    if ($scope.checkRows() || $scope.checkCols() ||  $scope.checkDiags()) {
      $scope.endGame();
    }

  };

  $scope.checkRows = function() {
    var row;
    for (var i = 0; i < $scope.board.length; i++) {
      if ($scope.checkSegment($scope.board[i].cols)) { return true; }
    }
    return false;
  };

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

  $scope.checkDiags = function() {
    var seg1 = [];
    var seg2 = [];

    var ii = $scope.board.length-1;

    for (var i = 0; i < $scope.board.length; i++) {
      seg1.push({ val: $scope.board[i].cols[i].val });
      seg2.push({ val: $scope.board[ii].cols[i].val });

      ii--;
    }

    if ($scope.checkSegment(seg1) || $scope.checkSegment(seg2)) {return true;}
    else {return false}
  };

  //****
  // Given an array of objects, check if every prop "val" is an "x", or if
  // each is an "o". Return true in the above cases and false otherwise
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

  $scope.endGame = function() {
    $scope.gameInProgress = false;
    $scope.postGame = true;
    $scope.winMessage = (($scope.turn) ? "green" : "orange") + " wins!!!";
  };

}]);