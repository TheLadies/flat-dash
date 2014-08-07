/* Copyright © 2013 Fog Creek Software, Inc. All rights reserved.
 * Released under the MIT license
 *  The nStatus field is only used if status_override = false.*/

// some constants and enums
var RATE_VARIANCE = 8; // for determining random animation rate in milliseconds
var RATE_BASE = 8; // for determining random animation rate in milliseconds  
var BOARD_ROWS = 15; // total number of rows displayed on the solari board
var SECOND_SECTION_START = 9; // the first row that contains a next due case
var LETTER_HEIGHT = 26; // height of a single letter frame (in pixels) in the letter image
var FIRST_CHAR_CODE = 48; // the first ASCII character that is represented in the letter image
var LAST_CHAR_CODE = 90; // the last ASCII character that is represented in the letter image
var CHAR_FACTOR = 2; // every N character in the letter image is a "real" character
var IMAGE_HEIGHT = 20; // height of a single product or status image frame (in pixels)
var IMAGE_FACTOR = 2; // every N picture in the letter image is a "real" image (i.e., not an in-between frame)
var USERNAME_BOXES = 20; // number of letter boxes displayed in the departure column
var TIME_BOXES = 4; // number of letter boxes displayed in the time column
var PULL_BOXES = 3; // number of letter boxes displayed in the track column
var REFRESH_TIME = 60; //refresh time in seconds
var EMPTY_ROW = {
  "sTime": "",
  "sUsername": "",
  "sTimeFrame": "",
  "nPullRequests" : 0
};

//if true, the status column will be handled automatically according to time and date. false will override status with nStatus from payload
var status_override = true;
var URL = "";

//used to add extra params that change over time.  /example_realtime makes use of this
var URL_SUFFIX = "";

var LAST_STATUS = 4;
var NextDueStatus = ["", "soon", "null", "overdue", ""];
var solari_setup_done = 0;
var syncing = false;
var current_board = [];

//an attempt to reduce slowdown from animations
jQuery.fx.interval = 20;

function ToUpper(code) {
  if (code > 96 && code < 123) {
      code -= 32;
  }
  return code;
}

//constructs the solariBoard within the given div. If no parameter is given, adds the board to "body"
function addSolariBoard(divSelector) {
  if (solari_setup_done === 1) {
      return;
  }
 
  if (arguments.length === 0) {
      $("body").append("<div id=\"solariBoardDiv\" style=\"width:970px;margin:0 auto;overflow:hidden\"></div>");
      divSelector = "#solariBoardDiv";
  }
     
  //The html structure of the solari board. This implementation is pretty ugly, but it's a simple, single-append solution. 
  var $solari = $("<div class=\"column solari_grid\">" +
    "<a id='show-solari' href=\"index.html\" onclick=\"localStorage['StopSolari']=0\">Show Solari Board</a>" +
    "<div id=\"solari\" class=\"panel\">" +
    "<div id=\"usernames\">" +
    "<header class=\"solari-board-header rounded\"> " +
    "<div class=\"solari-board-icon\"> Flatiron Ruby-005 Pull Requests From This </div>" +
    "<div id=\"time-frame\">" +
    "<div class=\"inner low\">" +
    "<span class=\"time-week\">00:00</span>" +
    "</div>" +
    "</div>" +
    "<div class=\"clockContainer\">" +
    "<ul class=\"clockList\">" +
    "<li id=\"hours\">12</li>" +
    "<li id=\"point\">:</li>" +
    "<li id=\"min\">00</li>" +
    "<li id=\"ampm\"> pm</li>" +
    "</ul>" +
    "</div>" +
    "</header>" +
    "<div class=\"bubble-chart\">"+
    "</div>"+
    "<ul class=\"solari-board-columns rounded\">" +
    "<li class=\"time\">Time</li>" +
    "<li class=\"username\">Username</li>" +
    "<li class=\"pull-requests\">Pull Requests</li>" +
    "</ul>" +
    "<ul class=\"solari-board-rows rounded\">" +
    "</ul>" +
    "</div>" +
    "<div id=\"last-updated\">Last updated: <span>n/a</span></div>" +
    "</div>" +
    "</div>" +
    "</div>").html();
  //add the board html
  $(divSelector).append($solari);

  //set up time-week
  setInterval(function () {
    var date = new Date();
    // Convert to 12 hour format
    var hours = date.getHours();
    $("#hours").html(hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours));
    // Add a leading zero to the minutes value and am/pm
    var minutes = date.getMinutes();
    $("#min").html((minutes < 10 ? "0" : "") + minutes);

    // Set am/pm
    $("#ampm").html(hours < 12 ? " am" : " pm");
  }, 1); // every 15 seconds is plenty accurate


  // show the solari board.
  // if (!localStorage['StopSolari'] || localStorage['StopSolari'] === '0') {
  //   $('#solari').show();
    $('#show-solari').hide();
  // } else {
  //   $('#solari').hide();
  //   $('#show-solari').show();
  //   return;
  // }

  $('li.pull-requests').click(function () {
    updateSolariBoard();
  });

  // we want people who don't care about the solari board to be able to hide it.
  // $('#time-frame').click(function () {
  //   localStorage['StopSolari'] = '1';
  //   $('#solari').hide();
  //   $('#show-solari').show();
  // });
  // and show it
  var $section;

  // build the solari board
  for (var add_rows = 0; add_rows < BOARD_ROWS; add_rows++) {
    // initialize the board with default "empty" board data objects
    current_board[add_rows] = EMPTY_ROW;

    if ($section === undefined) {
      $section = $('#usernames .solari-board-rows');
    }
    // add a row
    $section.append('<li class=board-data id=row' + add_rows + '><ul><li class=time></li><li class=username></li></li><li class="pull-requests"><div class=pull-icon></div></li></ul></li>');

    // add the letter boxes in the time column
    for (var add_time_col = 0; add_time_col < TIME_BOXES; add_time_col++) {
      $('#row' + add_rows + ' li.time').append('<div id=time-row' + add_rows + 'box' + add_time_col + ' class=letterbox></div>');
      // insert a dot after the second box
      if (add_time_col === 1) {
        $('#row' + add_rows + ' li.time').append('<div class=colon>:</div>');
      }
    }

      // add the letter boxes in the middle column
    for (var add_cols = 0; add_cols < USERNAME_BOXES; add_cols++) {
      $('#row' + add_rows + ' li.username').append('<div id=username-row' + add_rows + 'box' + add_cols + ' class=letterbox></div>');
    }

    // add the letter boxes in the pull-requests column
    for (var add_pull_requests_col = 0; add_pull_requests_col < PULL_BOXES; add_pull_requests_col++) {
      $('#row' + add_rows + ' li.pull-requests').append('<div id=pull-requests-row' + add_rows + 'box' + add_pull_requests_col + ' class=letterbox></div>');
    }
  }
  solari_setup_done = 1;
  window.setInterval(function (){updateSolariBoard()}, 1000 * REFRESH_TIME);
  updateSolariBoard();
}

function NextDue(id, time, offset, add_class) {
  $(id + ' .time-week').html(time);
}

function updateSolariTable(board){
  for (var row = 0; row < BOARD_ROWS; row++) {
    if ((board[row] === undefined)) {
      // make this an empty row
      board[row] = EMPTY_ROW;
    }
    // change the row
    UpdateSolariRow(row, current_board[row], board[row]);
  }

  // update the current_row board
  current_board = board;
}

function UpdateSolariRow(row, current_row, new_row) {
  var rate = RATE_BASE + Math.random() * RATE_VARIANCE + Math.random() * RATE_VARIANCE + Math.random() * RATE_VARIANCE;

  SpinChars(rate, '#time-row' + row, TIME_BOXES, current_row.sTime.replace(":",""), new_row.sTime.replace(":",""));
  SpinChars(rate, '#username-row' + row, USERNAME_BOXES, current_row.sUsername, new_row.sUsername);

  //turn pull-requests numbers into strings for display. Ensure they are always 2 chars long
  current_row.sPull = current_row === EMPTY_ROW ? "" : current_row.nPullRequests === -1? "--" : current_row.nPullRequests.toString().length > 1 ? current_row.nPullRequests.toString() : "0" + current_row.nPullRequests.toString();

  new_row.sPull = new_row === EMPTY_ROW ? "" : new_row.nPullRequests === -1? "--" :new_row.nPullRequests.toString().length > 2 ? new_row.nPullRequests.toString() :new_row.nPullRequests.toString().length > 1 ? (new_row.nPullRequests = "0" + new_row.nPullRequests).toString() : (new_row.nPullRequests = "00" + new_row.nPullRequests).toString();

  SpinChars(rate, '#pull-requests-row' + row, PULL_BOXES, current_row.sPull, new_row.sPull);  
  SpinImage(rate, '#row' + row + ' .pull-icon', current_row.nPullRequests, new_row.nPullRequests);
}

function SpinChars(rate, selector_prefix, max_boxes, current_text, new_text) {
  //populate each box
  var num_spins = 0;
  for (var box = 0; box < max_boxes; box++) {
    // get the to and from character codes for this box
    var to_char_code = ToUpper(((new_text.length > box) ? new_text.charCodeAt(box) : 32));
    var from_char_code = ToUpper(((current_text.length > box) ? current_text.charCodeAt(box) : 32));
    var final_pos = '';
    if (from_char_code > to_char_code) {
      num_spins = ((LAST_CHAR_CODE - from_char_code) + (to_char_code - FIRST_CHAR_CODE)) * CHAR_FACTOR;
      final_pos = ((LETTER_HEIGHT * (to_char_code - FIRST_CHAR_CODE)) * CHAR_FACTOR) * -1;
    } else {
      num_spins = (to_char_code - from_char_code) * CHAR_FACTOR;
    }
    var selector = selector_prefix + 'box' + box; // add the box part

    SpinIt(selector, num_spins, rate, LETTER_HEIGHT, final_pos);
  }
}

function SpinImage(rate, selector, from_pos, to_pos) {
  var final_pos = '';
  var num_spins = 0;

  if (from_pos > to_pos) {
    num_spins = (((LAST_STATUS - from_pos) + to_pos) * IMAGE_FACTOR);
    final_pos = ((IMAGE_HEIGHT * to_pos) * IMAGE_FACTOR) * -1;
  } else {
    num_spins = ((to_pos - from_pos) * IMAGE_FACTOR);
  }

  if (from_pos === 4 && to_pos === 0) {
    num_spins = 8;
  }

  //unless we're not moving at all, make the image go 'round 8 more times that it needs to, otherwise it finishes too fast.
  if (num_spins !== 0) {
    $('audio#solari-audio')[0].play();
    num_spins +=80;
  }
  SpinIt(selector, num_spins, rate, IMAGE_HEIGHT, final_pos);
}

function SpinIt(selector, num_spins, rate, pixel_distance, final_pos) {
  var bpX = $(selector).css('backgroundPosition').split(' ')[0];
  var bpY = $(selector).css('backgroundPosition').split(' ')[1];
  var updateBpY = function (yDelta) {
    bpY = (parseFloat(bpY) + yDelta) + 'px';
    return bpX + ' ' + bpY;
  };

  for (var ii = 0; ii < num_spins; ii++) {
    $(selector).transition(
      {backgroundPosition: updateBpY(-(pixel_distance * 2))},
      {duration: 1, easing: "linear"}
    );
    $(selector).transition(
      {backgroundPosition: updateBpY(1)},
      {duration: rate, easing: "linear"}
    );
    // on the very last iteration, use a call back to set the background position to the "real" position
    var f = function () {};
    if ((final_pos !== '') && (ii === (num_spins-1))) {
      f = function() {
        $(selector).css('backgroundPosition', bpX + ' ' + final_pos);
      };
    }
    $(selector).transition({backgroundPosition: updateBpY((pixel_distance - 1))}, 1, f);
  }
}

function GetFailBoard() {
  var fail_whale = [];
  fail_whale[0] = "    v  v        v";
  fail_whale[1] = "    !  !  v     !  v";
  fail_whale[2] = "    ! .-, !     !  !";
  fail_whale[3] = " .--./ /  !  _.---.!";
  fail_whale[4] = "  '-. (__..-\"       \\";
  fail_whale[5] = "     \\          &    !";
  fail_whale[6] = "      ',.__.   ,__.-'/";
  fail_whale[7] = "        '--/_.'----''";

  var board = [];
  // update each row on the board
  for (var row = 0; row < BOARD_ROWS; row++) {
    board[row] = {
      "sTime": "",
      "sUsername": fail_whale[row],
      "nPullRequests": 0
    };
  }
  return board;
}

function updateSolariBoard() {
  if (syncing) {
    return;
  }

  syncing = true;

  $.getJSON(URL + (URL.indexOf("?") === -1 ? '?' : '&') + "callback=?" + URL_SUFFIX, function(new_board) {

    syncing = false;

    if (new_board === null) {
      //the last updated footer won't get refreshed, but if data is null, it probably shouldn't
      return;
    }
    //redraw label if recovering from a fail
    $("ul.solari-board-columns li.username").text("Username");
    if (new_board.length === 0) {
      clearBoard();
    } else {
    //the next due box should display information on the row for which time info is available, which may not be from the first case
    var i, time;
    for (i=0; i < BOARD_ROWS; i++) {
      time = new_board[i].sTime;
      if (typeof time !== "undefined" && time !== "")
        break;
    }
    var next_due_row = new_board[i];
    if (time) {
      var timeDelta = Date.parse(next_due_row.sDate + ", " + time).getTime() - new Date().getTime();
      var nOffset = timeDelta > 0 ? Math.floor(timeDelta / (1000 * 60 * 60 * 24)) : Math.ceil(timeDelta / (1000 * 60 * 60 * 24)); //divide by miliseconds per day and round to zero
      var sOffset = (nOffset === 0 ? "" : nOffset.toString() + "d"); //if next due is not today, append a "d"
      if(status_override) {
        var hrsDelta = Number(time.substring(0,2)) - new Date().getHours();
        nOffset += timeDelta < 0 ? -1 : 0; // if the time difference is negative, which means we are within 24 hours of due, so reduce day offset by 1
      }
      // add the appropriate class based on status. If no data, green.
      var status_class = (new_board[0] === EMPTY_ROW ? "later" : NextDueStatus[next_due_row.nStatus])
      NextDue("#time-frame", time, sOffset, status_class);
    } else {
      NextDue("#time-frame", '00:00', '', '');
    }
  //now that the nStatus values have been set, update the board
  updateSolariTable(new_board);
  }
    // update last refresh time text
    $('#last-updated span').fadeOut("slow", function() {
      var now = new Date();
      $('#last-updated span').html(now.toLocaleString());
    }).fadeIn("slow");
  }).error(function () {
    syncing = false;
    updateSolariTable(GetFailBoard());
    NextDue("#time-frame", '-FA1L-', '', '');
    $("ul.solari-board-columns li.username").text("FAIL WHALE");
  });
}

function clearBoard() {
  //stop all animations
  $(".time").children().stop(true, true);
  $(".username").children().stop(true, true);
  $(".pull-requests").children().stop(true, true);
  //clear the next due and all rows
  NextDue("#time-frame", '00:00', '', '');
  for (var r = 0; r < BOARD_ROWS; r++) {
    UpdateSolariRow(r, current_board[r], EMPTY_ROW);
    current_board[r] = EMPTY_ROW;
  }
}
