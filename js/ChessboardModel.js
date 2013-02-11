(function(){

  var ChessboardModel = Backbone.Model.extend({
    initialize: function(params){
      if (params.n) {
        this.clearPieces();
      } else {
        this.setSimpleBoard(params.board);
      }
    },

    clearPieces: function(){
      this.set('board', this.makeEmptyBoard());
    },

    setSimpleBoard: function(simpleBoard){
      this.set('board', this.makeBoardFromSimpleBoard(simpleBoard));
      this.set('n', this.get('board').length);
    },

    makeBoardFromSimpleBoard: function(simpleBoard){
      var that = this;
      return _.map(simpleBoard, function(cols, r){
        return _.map(cols, function(hasPiece, c){
          return {
            row: r,
            col: c,
            piece: hasPiece,
            sign: ((r+c)%2),
            inConflict: function(){
              // todo: how expensive is this inConflict() to compute?
              return (
                that.hasRowConflictAt(r) ||
                that.hasColConflictAt(c) 
                // ||
                // that.hasUpLeftConflictAt(that._getUpLeftIndex(r, c)) ||
                // that.hasUpRightConflictAt(that._getUpRightIndex(r, c))
              );
            }
          };
        }, this);
      }, this);
    },

    makeEmptyBoard: function(){
      var board = [];
      _.times(this.get('n'), function(){
        var row = [];
        _.times(this.get('n'), function(){
          row.push(false);
        }, this);
        board.push(row);
      }, this);
      return this.makeBoardFromSimpleBoard(board);
    },

    // we want to see the first row at the bottom, but html renders things from top down
    // So we provide a reversing function to visualize better
    reversedRows: function(){
      return _.extend([], this.get('board')).reverse();
    },

    togglePiece: function(r, c){
      this.get('board')[r][c].piece = !this.get('board')[r][c].piece;
      this.trigger('change');
    },

    _getUpLeftIndex: function(r, c){
      return r + c;
    },

    _getUpRightIndex: function(r, c){
      return this.get('n') - c + r - 1;
    },


    hasRooksConflict: function(){
      return this.hasAnyRowConflict() || this.hasAnyColConflict();
    },

    hasQueensConflict: function(){
      return this.hasRooksConflict() || this.hasAnyUpLeftConflict() || this.hasAnyUpRightConflict();
    },

    _isInBounds: function(r, c){
      return 0 <= r && r < this.get('n') && 0 <= c && c < this.get('n');
    },


    // todo: fill in all these functions - they'll help you!
    chester: function(){
      return this.attributes.board;
    },

    pieceAt: function (r, c) {
      return this.chester()[r][c].piece;
    },

    hasAnyRowConflict: function(){
      for (var i = 0; i < this.chester().length; i++) {
        if (this.hasRowConflictAt(i)) { 
          return true;
        }
      } 
      return false;
    },

    hasRowConflictAt: function(r){
      var counter = 0;
      for (var i = 0; i < this.chester().length; i++) {
        if (this.pieceAt(r, i) === true) {
          counter = counter + 1;
        } 
      }
      return (counter > 1);
    },

    hasAnyColConflict: function(){
      for (var i = 0; i < this.chester().length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    hasColConflictAt: function(c){
      var counter = 0;
      for (var i = 0; i < this.chester().length; i++) {
        if (this.pieceAt(i, c) === true) {
          counter = counter + 1;
        }
      }
      return (counter > 1);
    },

    hasAnyUpLeftConflict: function(){
      for (var i = 0; i < (this.chester().length*2 - 1); i++) {
        if (this.hasUpLeftConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    hasUpLeftConflictAt: function(upLeftIndex){
      var startPoint = [
        [3,0],
        [3,1],
        [3,2],
        [3,3],
        [2,3],
        [1,3],
        [0,3]
      ];

      var r = startPoint[upLeftIndex][0];
      var c = startPoint[upLeftIndex][1];
      var counter = 0;
      while (r >= 0 && c >= 0) {
        if (this.pieceAt(r--, c--) === true){
          counter++;  
        }
      }
      return (counter > 1);
    },

    hasAnyUpRightConflict: function(){
      for (var i = 0; i < (this.chester().length*2 - 1); i++) {
        if (this.hasUpRightConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    hasUpRightConflictAt: function(upRightIndex){
      var startPoint = [
        [0,0],
        [1,0],
        [2,0],
        [3,0],
        [3,1],
        [3,2],
        [3,3]
      ];
      var r = startPoint[upRightIndex][0];
      var c = startPoint[upRightIndex][1];
      var counter = 0;
      while (r >= 0 && c <= this.chester().length - 1) {
        if (this.pieceAt(r--, c++) === true){
          counter++;  
        }
      }
      return (counter > 1);
    }
  });

  this.ChessboardModel = ChessboardModel;

}());
