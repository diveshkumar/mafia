// Javascript file for custom events.
var currentSocketId = '';

function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}
// Ticket Handling.
var Ticket = {
  totalNumbersToMark: 15,
  isFirstRowWinner: false,
  isSecondRowWinner: false,
  isThirdRowWinner: false,
  isCornersWinner: false,
  isFullHouseWinner: false,
  validateCompletion: function(ticket) {
    var markedNumbers = ticket.find('.marked').length;
    var calculateCompletion = Math.round((markedNumbers / this.totalNumbersToMark) * 100);
    return calculateCompletion;
  },
  validateWinning: function(ticket) {
    // for checking four corners
    var nonEmptyNumbers = this.getNonEmptyPlaceholders(ticket);
    if (!this.isCornersWinner) {
      this.isCornersWon(nonEmptyNumbers, ticket);
    }
    if (!this.isFirstRowWinner) {
      this.isLineWinner(nonEmptyNumbers, ticket, 0);
    }
    if (!this.isSecondRowWinner) {
      this.isLineWinner(nonEmptyNumbers, ticket, 1);
    }
    if (!this.isThirdRowWinner) {
      this.isLineWinner(nonEmptyNumbers, ticket, 2);
    }
    
      this.isFullHouseWinner();
    
  },
  getNonEmptyPlaceholders: function(ticket) {
    var ticketCols = $('.game-ticket').find('.ticket-col');
    var filledPlaces = [];
    // Returning only filled in values' indexes.
    $.each(ticketCols, function(key, value) {
      if (value.innerHTML !== "") {
        filledPlaces.push(key);
      }
    });
    return filledPlaces;
  },
  isCornersWon: function(nonEmptyNumbers, ticket) {
    // Ticket values mapped.
    var first_place = nonEmptyNumbers[0];
    var second_place = nonEmptyNumbers[4];
    var third_place = nonEmptyNumbers[10];
    var fourth_place = nonEmptyNumbers[14];
    // Placeholders on ticket to match against for corner winner.
    var first_placeholder = ticket.find('.ticket-col').eq(first_place);
    var second_placeholder = ticket.find('.ticket-col').eq(second_place);
    var third_placeholder = ticket.find('.ticket-col').eq(third_place);
    var fourth_placeholder = ticket.find('.ticket-col').eq(fourth_place);
    // Matching condition for four corners.
    if (first_placeholder.hasClass('marked') && second_placeholder.hasClass('marked') &&
            third_placeholder.hasClass('marked') && fourth_placeholder.hasClass('marked')) {
      this.isCornersWinner = true;
      console.log('You are a winnner!!! - Corners');
    }
  },
  isLineWinner: function(nonEmptyNumbers, ticket, offset) {
    offset = offset || 0;
    pointer = offset * 5;
    // Ticket values mapped.
    var first_place = nonEmptyNumbers[pointer++];
    var second_place = nonEmptyNumbers[pointer++];
    var third_place = nonEmptyNumbers[pointer++];
    var fourth_place = nonEmptyNumbers[pointer++];
    var fifth_place = nonEmptyNumbers[pointer++];

    // Placeholders on ticket to match against for corner winner.
    var first_placeholder = ticket.find('.ticket-col').eq(first_place);
    var second_placeholder = ticket.find('.ticket-col').eq(second_place);
    var third_placeholder = ticket.find('.ticket-col').eq(third_place);
    var fourth_placeholder = ticket.find('.ticket-col').eq(fourth_place);
    var fifth_placeholder = ticket.find('.ticket-col').eq(fifth_place);

    // Matching condition for four corners.
    if (first_placeholder.hasClass('marked') && second_placeholder.hasClass('marked') &&
            third_placeholder.hasClass('marked') && fourth_placeholder.hasClass('marked') &&
            fifth_placeholder.hasClass('marked')) {
      switch (offset) {
        case 0:
          this.isFirstRowWinner = true;
          console.log('First Row Winner!!!');
          break;
        case 1:
          this.isSecondRowWinner = true;
          console.log('Second Row Winner!!!');
          break;
        case 2:
          this.isThirdRowWinner= true;
          console.log('Third Row Winner!!!');
          break;
      }
    }
  },
  isFullHouseWinner: function() {
    if ($('.game-ticket .marked').length === 15) {
      console.log('Yeppie!!! Full house winner.');
    }
  }

};


$(document).ready(function() {


  (function() {

    // If game page is there.
    if ($('.game-page').length != 0) {

      var counter = 1;
      var max_iterations = 100;
      var duration = 3000;
      // Setting an interval to fetch next number.
      var interval = setInterval(function() {
        // Emitting to every stack.
        socket.emit('send');
        // Counter increment for next number from array.
        counter++;
        // If counter has reached maximum iterations (100) then clear interval and stop
        // emitting.
        if (counter > max_iterations)
        {
          clearInterval(interval);
        }
      }, duration);

      // Broadcasting current number on screen.
      socket.on('drawNumber', function(data) {
        $('.current-number').html(data.data);
      });

    }

    // If engine page is available. 
    else if ($('.engine-page').length > 0) {
      socket.on('myTicket', function(data) {
        console.log(data);
      });
      socket.on('anotherTicket', function(data) {

        if (data.sockets !== "undefined") {
          $('.tickets-container h1.big-title').remove();
          $.each(data.sockets, function(cKey, cValue) {

            var user = 'user-' + cKey;
            // getting each key for value.
            var ticket = getCookie(user);
            console.log(ticket);
            if (typeof ticket !== "undefined") {
              ticket = JSON.parse(ticket);

              var output = "<div class='game-ticket'>";
              $.each(ticket, function(key, value) {
                output += "<div class='ticket-row'>";
                $.each(value, function(key, col) {
                  output += "<div class='ticket-col'>" + col + "</div>";
                });
                output += "</div>";
              });
              output += "</div>";

            }
            console.log('--------');
            console.log(output);
            console.log('---------');
            $('.tickets-container').append(output);
          });
        }
      });
      ////////////////////////////////////////////////////////////////
      ////// APPENDING TICKET ////////////////////////////////////////
      ////////////////////////////////////////////////////////////////
      socket.on('appendTicket', function(data) {
        if (data.socket !== "undefined") {

          var user = 'user-' + data.socket;
          // getting each key for value.
          var ticket = getCookie(user);

          if (typeof ticket !== "undefined") {
            ticket = JSON.parse(ticket);
            var output = "<div class='game-ticket abc'>";

            $.each(ticket, function(key, value) {
              output += "<div class='ticket-row'>";
              $.each(value, function(key, col) {
                output += "<div class='ticket-col'>" + col + "</div>";
              });
              output += "</div>";
            });

            if (myName.length) {
              output += "<div class='user-name'><h3>" + myName + "</h3></div>";
            }
            output += "</div>";
            $('.tickets-container').append(output);
          }

        }
      });
    }
    // Splash page.
    else if ($('.splash-page').length > 0) {
      socket.on('info', function(data) {
        setCookie('user-' + data.socket, '', 1);
      });
    }

  })();
});