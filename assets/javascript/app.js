  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD64Pvbid5872NQNwrRm8pjeWvqJ4wykDM",
    authDomain: "storyme-5b335.firebaseapp.com",
    databaseURL: "https://storyme-5b335.firebaseio.com",
    projectId: "storyme-5b335",
    storageBucket: "storyme-5b335.appspot.com",
    messagingSenderId: "574338650013"
  };

  firebase.initializeApp(config);
  var database = firebase.database();
  var storyRef = database.ref("/storyLines");
  var usersRef = database.ref("/Users");
  var startingSentence = database.ref("/Starting Sentences");


////////The login html page code///////////////// 
$("#login").on("click", function(){

  var userName = $("#nameInput").val().trim();
  database.ref("/Users").push({userName: userName});

  

}); 

usersRef.on("value", function(snap){
  var playersNum = snap.numChildren();

  if(playersNum === 0){
    console.log("please sign in");
  }

  else if(playersNum === 1){
      console.log("you are the first player");
        $("#login").attr("href", "storyThemes.html");

  }
  else{
      console.log("you are not the first player");
        $("#login").attr("href", "storyPage.html");

  }

});

/////////////////////////////////////////////////
////The stories themes html page code////////////
var startingSentences = ["The night sky was full of stars but no moon.",
   "Lately, Marlene felt that there was something missing from her life.",
   "Lady Luck was always on my side at the casinos.",
   "The subway stopped suddenly inside the tunnel."];

 
$(".story-image").on("click", function(){
  var imageId = parseInt($(this).attr("id"));
  console.log(imageId);
  console.log(startingSentences[imageId]);
  $(this).attr("href", "storyPage.html");
  database.ref("/Starting Sentences").update({s: startingSentences[imageId]});

});

/////////////////////////////

  //$("#storyDiv").html(startingSentences[imageId]);
  //var sentence = "Once upon a time there was an avacado";
  //storyRef.push(sentence);

  startingSentence.on("child_added", function(snap){

    console.log(snap.val());

      $("#storyDiv").html(snap.val());



  });



  $("#submitSentence").on("click", function(event){

    event.preventDefault();

    var newSentence = $("#userInput").val();

    $("#userInput").val('');

    storyRef.push(newSentence);
    

  });

  storyRef.on("child_added", function(snapshot){
    $("#storyDiv").append("<br>"+snapshot.val());

  });

  storyRef.on("value", function(snap){

    console.log(snap.numChildren());

    var numSentences = snap.numChildren();
    var limitSentence = 5;

    if(numSentences === 5){
      $("#storyDiv").append("This is the last sentence! Enter the ending, Make it count!");

      //limitSentence = numSentences;
    }

    if(numSentences === (limitSentence+1)){

     $("#submitSentence").attr("disabled", true);
    }
    //else{

      //$("#submitSentence").attr("disabled", false);
    //}


  });
    









