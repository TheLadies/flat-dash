/* Copyright © 2013 Fog Creek Software, Inc. All rights reserved.
 * Released under the MIT license
 *  The nStatus field is only used if status_override = false.*/

// you will need  to take information from here and append it in the specific views
var RATE_VARIANCE = 1; // for determining random animation rate in milliseconds
var RATE_BASE = 1; // for determining random animation rate in milliseconds  
var BOARD_ROWS = 15; // total number of rows displayed on the solari board
var SECOND_SECTION_START = 9; // the first row that contains a next due case
var LETTER_HEIGHT = 26; // height of a single letter frame (in pixels) in the letter image
var FIRST_CHAR_CODE = 48; // the first ASCII character that is represented in the letter image
var LAST_CHAR_CODE = 90; // the last ASCII character that is represented in the letter image
var CHAR_FACTOR = 2; // every N character in the letter image is a "real" character
var IMAGE_HEIGHT = 20; // height of a single product or status image frame (in pixels)
var IMAGE_FACTOR = 2; // every N picture in the letter image is a "real" image (i.e., not an in-between frame)
var USERNAME_BOXES = 20; // number of letter boxes displayed in the username column
var TIME_BOXES = 4; // number of letter boxes displayed in the time column
var COMMIT_BOXES = 30; // number of letter boxes displayed in the pullrequest column
var REFRESH_TIME = 1; //refresh time in seconds
var EMPTY_ROW = {
  // will need to specify this for sem, week, day
  "sDate": "",
  "sTime": "",
  "sUsername": "",
  "sCommitMessage" : ""
};
var PREV_BUTTON = "/";
var NEXT_BUTTON = "/";
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
function addSolariBoard2(divSelector) {
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
    // will need to append this
    "<div class=\"solari-board-icon\"> Flatiron Ruby-005 Recent Commits for </div>" +
    "<div id=\"time-frame\">" +
    "<div class=\"inner low\">" +
    "<span class=\"time-length\">00:00</span>" +
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
    "<ul class=\"solari-board-columns2 rounded\">" +
    // append
    "<li class=\"time\">Time</li>" +
    "<li class=\"username\">Username</li>" +
    "<li class=\"pull-requests2\">Commit Messages</li>" +
    "</ul>" +
    "<ul class=\"solari-board-rows rounded\">" +
    "</ul>" +
    "</div>" +
    "<div id=\"last-updated\">Last updated: <span>n/a</span></div>" +
    "<div id=\"about\"><a href=\"/about\">ABOUT</a></div>"+
    "<div id=\"nav-buttons\">" +
    "<a id=\"prev_button\" href="+ PREV_BUTTON +"><button class=\"button\">Previous</button></a>"+
    "<a id=\"next_button\" href="+ NEXT_BUTTON +"><button class=\"button\">Next</button></a>"+
    "</div>"+
    "<div class=\"container\">"+
    "Made with <span class=\"glyphicon glyphicon-heart\"></span> at the <a href=\"http://flatironschool.com/\" target=\"_blank\" id=\"school\">Flatiron School</a> | "+
    "<a href=\"https://github.com/denineguy\" target=\"_blank\">@denineguy</a> | " + 
    "<a href=\"https://github.com/christinaleuci\" target=\"_blank\">@christinaleuci</a> | " + 
    "<a href=\"https://github.com/jessrudder\" target=\"_blank\">@jessrudder</a></p>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>").html();
  //add the board html
  $(divSelector).append($solari);

  //set up right hand clock
  setInterval(function () {
    var date = new Date();
    // Convert to 12 hour format
    var hours = date.getHours();
    $("#hours").html(hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours));
    // Add a leading zero to the minutes value and am/pm
    var minutes = date.getMinutes();
    $("#min").html((minutes < 10 ? "0" : "") + minutes);

    // Set am/pm
    $("#ampm").html(hours < 12 ? "AM" : " PM");
  }, 1); // every 15 seconds is plenty accurate


  // show the solari board.
    $('#show-solari').hide();

  $('li.pull-requests2').click(function () {
    updateSolariBoard2();
  });

  var $section;

  // build the solari board
  for (var add_rows = 0; add_rows < BOARD_ROWS; add_rows++) {
    // initialize the board with default "empty" board data objects
    current_board[add_rows] = EMPTY_ROW;

    if ($section === undefined) {
      $section = $('#usernames .solari-board-rows');
    }
    // add a row
    // append
    $section.append('<li class=board-data id=row' + add_rows + '><ul><li class=time></li><li class=username></li></li><li class="pull-requests2"><div class=pull-icon></div></li></ul></li>');

    // add the letter boxes in the left column
    // append
    for (var add_time_col = 0; add_time_col < TIME_BOXES; add_time_col++) {
      $('#row' + add_rows + ' li.time').append('<div id=time-row' + add_rows + 'box' + add_time_col + ' class=letterbox></div>');
      // insert a dot after the second box
      if (add_time_col === 1) {
        $('#row' + add_rows + ' li.time').append('<div class=colon>:</div>');
      }
    }

      // add the letter boxes in the middle column
      // append
    for (var add_cols = 0; add_cols < USERNAME_BOXES; add_cols++) {
      $('#row' + add_rows + ' li.username').append('<div id=username-row' + add_rows + 'box' + add_cols + ' class=letterbox></div>');
    }

    // add the letter boxes in the right column
    // append
    for (var add_pull_requests_col = 0; add_pull_requests_col < COMMIT_BOXES; add_pull_requests_col++) {
      $('#row' + add_rows + ' li.pull-requests2').append('<div id=pull-requests-row' + add_rows + 'box' + add_pull_requests_col + ' class=letterbox></div>');
    }
  }
  solari_setup_done = 1;
  window.setInterval(function (){updateSolariBoard2()}, 1000 * REFRESH_TIME);
  updateSolariBoard2();
}

function NextDue(id, timeframe) {
  $(id + ' .time-length').html(timeframe);
}

function updateSolariTable2(board){
  for (var row = 0; row < BOARD_ROWS; row++) {
    if ((board[row] === undefined)) {
      // make this an empty row
      board[row] = EMPTY_ROW;
    }
    // change the row
    UpdateSolariRow2(row, current_board[row], board[row]);
  }

  // update the current_row board
  current_board = board;
}

function UpdateSolariRow2(row, current_row, new_row) {
  var rate = RATE_BASE + Math.random() * RATE_VARIANCE + Math.random() * RATE_VARIANCE + Math.random() * RATE_VARIANCE;
  SpinChars(rate, '#time-row' + row, TIME_BOXES, current_row.sTime.replace(":",""), new_row.sTime.replace(":",""));
  SpinChars(rate, '#username-row' + row, USERNAME_BOXES, current_row.sUsername, new_row.sUsername);

  //turn pull-requests numbers into strings for display. Ensure they are always 2 chars long
  // append
    current_row.sPull = current_row === EMPTY_ROW ? "" : current_row.sCommitMessage === -1? "--" : current_row.sCommitMessage.toString().length > 1 ? current_row.sCommitMessage.toString() : "0" + current_row.sCommitMessage.toString();


    new_row.sPull = new_row === EMPTY_ROW ? "" : new_row.sCommitMessage === -1? "--" :new_row.sCommitMessage.toString().length > 2 ? new_row.sCommitMessage.toString() :new_row.sCommitMessage.toString().length > 1 ? (new_row.sCommitMessage = "0" + new_row.sCommitMessage).toString() : (new_row.sCommitMessage = "00" + new_row.sCommitMessage).toString();

    SpinChars(rate, '#pull-requests-row' + row, COMMIT_BOXES, current_row.sPull, new_row.sPull);  
    SpinImage(rate, '#row' + row + ' .pull-icon', current_row.sCommitMessage, new_row.sCommitMessage);
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
      // append
      "sTime": "",
      "sUsername": fail_whale[row],
      "sCommitMessage": 0
    };
  }
  return board;
}

function updateSolariBoard2() {
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
    // append
    $("ul.solari-board-columns li.username").text("Username");
    if (new_board.length === 0) {
      clearBoard();
    } else {
    //the next due box should display information on the row for which time info is available, which may not be from the first case
    var i, time;
    for (i=0; i < BOARD_ROWS; i++) {
      timeframe = new_board[i].sTimeFrame;
      if (typeof timeframe !== "undefined" && timeframe !== "")
        break;
    }
    var next_due_row = new_board[i];
    if (timeframe) {
      NextDue("#time-frame", timeframe);
    } else {
      NextDue("#time-frame", "");
    }
  //now that the nStatus values have been set, update the board
  updateSolariTable2(new_board);
  }
    // update last refresh time text
    $('#last-updated span').fadeOut("slow", function() {
      var now = new Date();
      $('#last-updated span').html(now.toLocaleString());
    }).fadeIn("slow");
  }).error(function () {
    syncing = false;
    updateSolariTable2(GetFailBoard());
    // append
    NextDue("#time-frame", '-FA1L-');
    $("ul.solari-board-columns li.username").text("FAIL WHALE");
  });
}

function clearBoard() {
  //stop all animations
  // append
  $(".time").children().stop(true, true);
  $(".username").children().stop(true, true);
  $(".pull-requests2").children().stop(true, true);
  //clear the next due and all rows
  NextDue("#time-frame", "");
  for (var r = 0; r < BOARD_ROWS; r++) {
    UpdateSolariRow2(r, current_board[r], EMPTY_ROW);
    current_board[r] = EMPTY_ROW;
  }
}
