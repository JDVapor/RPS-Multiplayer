// Initialize Firebase
var config = {
  apiKey: "AIzaSyDI4yyKpYDxdkXRkhtde3LjIjAsiwasSmw",
  authDomain: "rpso-a611a.firebaseapp.com",
  databaseURL: "https://rpso-a611a.firebaseio.com",
  projectId: "rpso-a611a",
  storageBucket: "",
  messagingSenderId: "1062958140255"
};

firebase.initializeApp(config);

var database = firebase.database();

var playerOne;
var playerTwo;

var wins = 0;
var losses = 0;
var choice = "";
var turn = 0;

function fetchPlayers(cb) {
  database.ref('playerOne').once("value", function(snap) {
    playerOne = snap.val();
  });
  database.ref('playerTwo').once("value", function(snap) {
    playerTwo = snap.val();
  });
  cb()
}

function createPlayer(player) {
  console.log(player);
    var playerName = $("#name").val();
    console.log(playerName);
    var playerObj = {
      name: playerName,
      wins: wins,
      losses: losses,
      choice: choice
    };
    database.ref(player).set(playerObj);

    fetchPlayers(function(val){
        console.log(val)
      })
}



$("#start").on("click", function() {
  event.preventDefault();
  fetchPlayers(function(){
    if (!playerOne && !playerTwo){
      createPlayer('playerOne');
    } else if (!playerTwo && playerOne){
      createPlayer('playerTwo');
    } else {
      console.log('Already two players.');
    }
  });

  // if (playerNumber === 0) {
  //   console.log("no players yet");
  //   player = $("#name").val();
  //
  //   var playerOne = {
  //     name: player,
  //     wins: wins,
  //     losses: losses,
  //     choice: choice
  //   };
  //   database.ref('playerOne').set(playerOne);
  //
  //   userConnected++;
  //
  //   database.ref('playerNumber').set({
  //
  //     userCount: userConnected
  //
  //   });
  //
  // } else if (playerNumber === 1) {
  //   player = $("#name").val();
  //
  //   var playerTwo = {
  //     name: player,
  //     wins: wins,
  //     losses: losses,
  //     choice: choice
  //   };
  //   database.ref().set(playerTwo);
  //
  //   userConnected++;
  //
  //   database.ref('playerNumber').set({
  //
  //     userCount: userConnected
  //
  //   });
  //
  // } else {alert("error: already two players")}
  //
  // //
  // // when player one changes something
  // //   ref('/playerOne').set(...)
  // //
  // // when player two changes something
  // //   ref('/playerTwo').set(...)
  // //
  //
  // // /playerOne
  // // /playerTwo
  // //
  //
  // //
  // // if you're player two you need to know this
  // //
  // //ref('/playerOne').on('change', function(snapshot) {
  //
  // //  })
  // //
  // // if you're player one you need to know this
  // //
  // //ref('/playerTwo').on('change', function(snapshot) {
  //
  // //  })
  //
  //

});

database.ref().on("value", function(snapshot) {

  console.log(snapshot.val());

  var player01 = snapshot.val().playerOne.name;
  var p1Wins = snapshot.val().playerOne.wins;
  var p1Losses = snapshot.val().playerTwo.losses;

  $("#dispName01").text(player01);
  $("#score01").text("Wins: " + p1Wins + " Losses: " + p1Losses);

  var player02 = snapshot.val().playerTwo.name;
  var p2Wins = snapshot.val().playerTwo.wins;
  var p2Losses = snapshot.val().playerTwo.losses;

  $("#dispName02").text(player02);
  $("#score02").text("Wins: " + p2Wins + " Losses: " + p2Losses);

})



// if (userChoice === 'r' || userChoice === 'p' || userChoice === 's') {
//   alert("User guess: " + userChoice);
//   alert("Computer guess: " + compGuess);
//
//   if (userChoice === compGuess) {
//     alert("It's a tie!");
//     ties++;
//     tiesElement.textContent = ties.toString();
//   } else if (userChoice === 'r' && compGuess === 's') {
//     alert("You win!");
//     wins++;
//     winsElement.textContent = wins.toString();
//   } else if (userChoice === 'p' && compGuess === 'r') {
//     alert("You win!");
//     wins++;
//     winsElement.textContent = wins.toString();
//   } else if (userChoice === 's' && compGuess === 'p') {
//     alert("You win!");
//     wins++;
//     winsElement.textContent = wins.toString();
//   } else {
//     alert('You lose!');
//     losses++;
//     lossesElement.textContent = losses.toString();
//   }
// } else {
//   alert("Not a vaild choice");
// }
