app = angular.module('ticTacToeApp', []);

app.controller('GameController', ['$scope', function($scope) {

  // $scope.board = [
  //   ["b", "b", "b"],
  //   ["b", "b", "b"],
  //   ["b", "b", "b"]
  // ];

  $scope.board = [];
  $scope.boardSize = 3;

  //whenever boardSize changes, dynamically update the board
  $scope.$watch("boardSize", function() {
 
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
  });

  $scope.startGame = function() {
    var sizeSlider;

    //disable the size slider so that the board can't be reset
    //during the game
    sizeSlider = document.getElementById("size-slider");
    sizeSlider.disabled = true;
  };


}]);