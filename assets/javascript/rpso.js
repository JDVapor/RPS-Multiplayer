// Initialize Firebase
var config = {
  apiKey: "AIzaSyDI4yyKpYDxdkXRkhtde3LjIjAsiwasSmw",
  authDomain: "rpso-a611a.firebaseapp.com",
  databaseURL: "https://rpso-a611a.firebaseio.com",
  projectId: "rpso-a611a",
  storageBucket: "rpso-a611a.appspot.com",
  messagingSenderId: "1062958140255"
};

firebase.initializeApp(config);

var database = firebase.database();

var player;
var snapP1;
var snapP2;
var choiceP1;
var choiceP2;

var winsP1 = 0;
var winsP2 = 0;
var lossesP1 = 0;
var lossesP2 = 0;
var playerID = 0;

var p1 = null;
var p2 = null;

var whoTurn = database.ref();
var players = database.ref('/players');
var playerOne = database.ref('/players/playerOne');
var playerTwo = database.ref('/players/playerTwo');
var playerChat = database.ref('/chat');

playerOne.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    p1 = snapshot.val().player;
    winsP1 = snapshot.val().wins;
    lossesP1 = snapshot.val().losses;
    $("#dispName01").text(p1);
    $("#score01").text('Wins: ' + winsP1 + '  Losses: ' + lossesP1);
  } else {
    $("#dispName01").text('Waiting for Player 1');
    $("#score01").empty();
    if (p1 !== null) {
      playerChat.push({
        player: p1,
        chatInput: ' has disconnected',
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    };
  };
});

playerTwo.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    p2 = snapshot.val().player;
    winsP2 = snapshot.val().wins;
    losses = snapshot.val().losses;
    $("#dispName02").text(p2);
    $("#score02").text('Wins: ' + winsP2 + '  Losses: ' + lossesP2);
  } else {
    $("#dispName02").text('Waiting for Player 2');
    $("#score02").empty();
    if (p2 !== null) {
      playerChat.push({
        player: p2,
        chatInput: ' has disconnected',
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    };
  };
});

$("#start").on("click", function(event) {
  event.preventDefault();
  player = $("#playerName").val().trim();
  if (player) {
    playerOne.once("value", function(snapshot) {
      snapP1 = snapshot;

    });
    playerTwo.once("value", function(snapshot) {
      snapP2 = snapshot;

    });

    if (!snapP1.exists()) {

      playerID = 1;

      playerOne.onDisconnect().remove();

      playerOne.set({
        player: player,
        wins: 0,
        losses: 0
      });

      $("#info").text('Hello ' + player + '! You are Player 1');
      if (!snapP2.exists()) {
        $("#whoTurn").text('Waiting for Player 2 to join...');
      };
    } else if (!snapP2.exists()) {
      playerID = 2;
      playerTwo.onDisconnect().remove();
      playerTwo.set({
        player: player,
        wins: 0,
        losses: 0
      });
      whoTurn.update({
        turn: 1
      });
      $("#info").text('Hello ' + player + '! You are Player 2');
      $("#whoTurn").text('Waiting for ' + p1 + ' to choose.');
    } else {
      $("#info").text('Already two players.');
    };
  }
});

players.on("value", function(snapshot) {
  if (snapshot.val() == null) {
    whoTurn.set({});
  };
});

whoTurn.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    if (snapshot.val().turn == 2 && playerID == 1) {
      $("#whoTurn").text('Waiting for ' + p2 + ' to choose.');
    } else if (snapshot.val().turn == 1 && playerID == 2) {
      $("#p1Paper").html("");
      $("#whoTurn").html('Waiting for ' + p1 + ' to choose.');
    }
    if (snapshot.val().turn == 1 && playerID == 1) {
      $("#rock1").show();
      $("#paper1").show();
      $("#siz1").show();
      $("#whoTurn").text("It's your turn!");
    } else if (snapshot.val().turn == 2 && playerID == 2) {
      $("#rock2").show();
      $("#paper2").show();
      $("#siz2").show();
      $("#whoTurn").text("It's your turn!");
    } else if (snapshot.val().turn == 3) {
      $("#whoTurn").html("");
      winCheck();
    };
  };
});

$("#rock1").on("click", function() {
  var choice = 'r';
  setTimeout(function() {
    whoTurn.update({
      turn: 2
    });
    playerOne.update({
      choice: choice
    });
  }, 500);
});
$("#paper1").on("click", function() {
  var choice = 'p';
  setTimeout(function() {
    whoTurn.update({
      turn: 2
    });
    playerOne.update({
      choice: choice
    });
  }, 500);
});
$("#siz1").on("click", function() {
  var choice = 's';
  setTimeout(function() {
    whoTurn.update({
      turn: 2
    });
    playerOne.update({
      choice: choice
    });
  }, 500);
});

$("#rock2").on("click", function() {
  var choice = 'r';
  setTimeout(function() {
    playerTwo.update({
      choice: choice
    });
    whoTurn.update({
      turn: 3
    });
  }, 500);
});
$("#paper2").on("click", function() {
  var choice = 'p';
  setTimeout(function() {
    playerTwo.update({
      choice: choice
    });
    whoTurn.update({
      turn: 3
    });
  }, 500);
});
$("#siz2").on("click", function() {
  var choice = 's';
  setTimeout(function() {
    playerTwo.update({
      choice: choice
    });
    whoTurn.update({
      turn: 3
    });
  }, 500);
});

var winCheck = function() {
  playerOne.once("value", function(snapshot) {
    choiceP1 = snapshot;
  });
  playerTwo.once("value", function(snapshot) {
    choiceP2 = snapshot;
  });
  if (choiceP1.val() !== null && choiceP2.val() !== null) {
    if (choiceP1.val().choice === choiceP2.val().choice) {

      $("#paper1").hide();
      $("#siz1").hide();
      $("#rock1").hide();

      $("#p1Paper").html('<h1>' + choiceP1.val().choice + '</h1>');
      $("#p2Paper").html('<h1>' + choiceP2.val().choice + '</h1>');
      $("#winner").html("<h1>It's a TIE</h1>");

    } else if (choiceP1.val().choice === 'r' && choiceP2.val().choice === 's') {

      $("#paper1").hide();
      $("#siz1").hide();
      $("#rock1").hide();

      $("#p1Paper").html('<h1>' + choiceP1.val().choice + '</h1>');
      $("#p2Paper").html('<h1>' + choiceP2.val().choice + '</h1>');
      $("#winner").html('<h1>' + p1 + ' wins!</h1>');

      winsP1++;
      lossesP2++;
    } else if (choiceP1.val().choice === 'p' && choiceP2.val().choice === 'r') {
      $("#paper1").hide();
      $("#siz1").hide();
      $("#rock1").hide();

      $("#p1Paper").html('<h1>' + choiceP1.val().choice + '</h1>');
      $("#p2Paper").html('<h1>' + choiceP2.val().choice + '</h1>');
      $("#winner").html('<h1>' + p1 + ' wins!</h1>');

      winsP1++;
      lossesP2++;
    } else if (choiceP1.val().choice === 's' && choiceP2.val().choice == 'p') {

      $("#paper1").hide();
      $("#siz1").hide();
      $("#rock1").hide();

      $("#p1Paper").html('<h1>' + choiceP1.val().choice + '</h1>');
      $("#p2Paper").html('<h1>' + choiceP2.val().choice + '</h1>');
      $("#winner").html('<h1>' + p1 + ' wins!</h1>');

      winsP1++;
      lossesP2++;
    } else {

      $("#paper1").hide();
      $("#siz1").hide();
      $("#rock1").hide();

      $("#p1Paper").html('<h1>' + choiceP1.val().choice + '</h1>');
      $("#p2Paper").html('<h1>' + choiceP2.val().choice + '</h1>');
      $("#winner").html('<h1>' + p2 + ' wins!</h1>');

      winsP2++;
      lossesP1++;
    }
  };

  setTimeout(function() {
    whoTurn.update({
      turn: 1
    });
    playerOne.once("value", function(snapshot) {
      choiceP1 = snapshot;
    });

    if (choiceP1.val() !== null) {
      playerOne.update({
        wins: winsP1,
        losses: lossesP1
      });
    };
    playerTwo.once("value", function(snapshot) {
      choiceP2 = snapshot;
    });

    if (choiceP2.val() !== null) {
      playerTwo.update({
        wins: winsP2,
        losses: lossesP2
      });
    };
    $("#winner").html("");
    $("#p2Paper").html("");
  });
};

$("#chatInput").on("click", function(event) {
  event.preventDefault();
  var message = $("#messageBox").val().trim();
  $("#messageBox").val("");
  if (playerID == 1) {
    playerChat.push({
      player: p1 + ": ",
      chatInput: message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  } else if (playerID == 2) {
    playerChat.push({
      player: p2 + ": ",
      chatInput: message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  };
});
