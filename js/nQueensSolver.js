var solveNQueens = function(n){

  model = new ChessboardModel({n:n});
  board = model.attributes.board;

  var solution = placeNextQueen(0);

  // the above is a pre-baked solution for when n = 4.
  // Write code here that will find solutions for any n
  // hint: you'll want to start by building your own matrix to put in the solution variable

  // this line hooks into the visualizer
  window.chessboardView.model.setSimpleBoard(solution);
  console.log(solution + " is a solution!");
  return solution;
}


var placeNextQueen = function (col) {
  for(var i = 0; i < board.length; i++) {
    board[col][i].piece = true;
    if(col === board.length - 1) {
      if(isQueensSolution()) {
        console.log("returning solved board");
        return board;
      }
    } else {
      placeNextQueen(col+1);
    }
    board[col][i].piece = false;
  }
};

var isQueensSolution = function() {
  var rowProblem = model.hasAnyRowConflict();
  var columnProblem = model.hasAnyColConflict();
  var diagLeftProblem = model.hasAnyUpLeftConflict();
  var diagRightProblem = model.hasAnyUpRightConflict();
  return (!rowProblem && !columnProblem && !diagLeftProblem && !diagRightProblem)
}

var mapBoard = function(board) {
  var total = []
  _.each(board, function (row) {
    _.each(row, function(square){
      total.push(square.piece)
    });
  });
  console.log(total);
};