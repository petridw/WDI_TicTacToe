angular
  .module("ticTacToeApp")
  .controller("GameController", ['$firebase', GameController]);

function GameController($firebase) {
  var ref = new Firebase("https://petri-tic-tac-toe.firebaseio.com/games");    


  function getBoard() {
    var games = $firebase(ref).$asArray();

    //add new game, once it's added get the key
    var gameKey;

    games.$add({
      rows: {row1: {
              s1: {
                val: "",
                filled: false,
                winner: false
              },
              s2: {
                val: "",
                filled: false,
                winner: false
              },
              s3: {
                val: "",
                filled: false,
                winner: false
              }
            }, row2: {
              s1: {
                val: "",
                filled: false,
                winner: false
              },
              s2: {
                val: "",
                filled: false,
                winner: false
              },
              s3: {
                val: "",
                filled: false,
                winner: false
              }
            }, row3: {
              s1: {
                val: "",
                filled: false,
                winner: false
              },
              s2: {
                val: "",
                filled: false,
                winner: false
              },
              s3: {
                val: "",
                filled: false,
                winner: false
              }
            }},
      boardSize: 3,
      turn: true,
      winner: "",
      gameInProgress: false,
      postGame: false
    }).then(function(ref){
      gameKey = ref.key();
    });
  }
}