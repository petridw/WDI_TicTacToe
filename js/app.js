app = angular.module('ticTacToeApp', []);

app.controller('GameController', ['$scope', function($scope) {

  $scope.board = [];
  $scope.boardSize = 3;
  $scope.turn = true;
  $scope.gameInProgress = false;

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
  };

  $scope.resetGame = function() {
    var sizeSlider;

    //enable slider
    sizeSlider = document.getElementById("size-slider");
    sizeSlider.disabled = false;

    //make a new board
    $scope.makeBoard();

  };

}]);