var Game = {
  defaultIndexArray: [1,2,3,4,5,6,7,8,9],
  // Preparing ticket data.
  prepareTicket: function(limit) {
    var inputArray = this.generateNumbers(limit);
    var output = this.filterUnique(inputArray);
    return output;//.sort(function(a, b) {return a-b;});
  },
  // Preparing random numbers.
  generateNumbers : function(limit) {
    var numbers = new Array();
    var lm = limit || 100;
    for(i = 1; i<= lm; i++) {
      numbers.push(parseInt(Math.random() * i) + 1);
    }

    return numbers;
  },
  // Render tambola ticket.
  getTicket : function() {
    var ticket = this.prepareTicket();

    var renderableTicket = [];
    var output = [];
    for (var i = 0; i <3 ; i++)
    {
      var shuffledArray = this.arrayShuffle(this.defaultIndexArray);
      var cols = [];
      for(var j = 0; j < 9 ; j++) {

        if (shuffledArray[j] % 2 != 0)
        {
          // Increasing array index of ticket to get different numbers every row.
          cols.push(ticket[(i * 9) + j]);
        }
        else {
          cols.push('');
        }
      }
      output.push(cols);
    }
    return output;
  },
  // Method apply a unique filter to array.
  filterUnique : function(inputArray) {
    var output = [];
    for (j=0; j<inputArray.length ; j++) {
      if (output.indexOf(inputArray[j]) == -1) {
        output.push(inputArray[j]);
      }
    }
    return output;
  },
  // Shuffles an array.
  arrayShuffle : function(oldArray) {
	  var newArray = oldArray.slice();
 	  var len = newArray.length;
	  var i = len;
	  while (i--) {
	 	  var p = parseInt(Math.random()*len);
		  var t = newArray[i];
  		newArray[i] = newArray[p];
	  	newArray[p] = t;
 	  }
	  return newArray;
  }
};

module.exports = Game;