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
        complete: false
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

    // if ($scope.checkHorizWin()) {
    //   $scope.endGame();
    // }

    $scope.checkAllRows();

  };

  $scope.checkAllRows = function() {
    for (var i = 0; i < $scope.board.length; i++) {
      if ($scope.checkRow($scope.board[i])) {$scope.endGame();}
    }
  };

  $scope.checkRow = function(row) {
    var allX = row.cols.filter(function(x){return x.val ==  "x";});
    var allO = row.cols.filter(function(x){return x.val === "o";});

    if (allX.length === row.cols.length) {
      return true;
    } else if (allO.length === row.cols.length) {
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