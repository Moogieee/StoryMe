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
  var storyRef = database.ref("/storyLines")
  var sentence = "Once upon a time there was an avocado";

  $("#storyDiv").html("Once upon a time there was an avocado");



  //storyRef.push(sentence);
  $("#submitSentence").on("click", function(event){
    event.preventDefault();
    var newSentence = $("#userInput").val();
    storyRef.push(newSentence);
    $("#userInput").html("");

  })

  storyRef.on("child_added", function(snapshot){
     $("#storyDiv").append("<br>" + snapshot.val());
  });

  database.ref().on("child_changed", function(snapshot){
    // console.log(snapshot.val());
    console.log(snapshot.numChildren());
    var numSentences = snapshot.numChildren();
    var limitSentence = 5;

    if (numSentences === 5) {
      $("#storyDiv").append("<br>" + "This is the last sentence! Enter the last sentence, make it count!");
      limitSentence = numSentences;

    }

    if (numSentences === limitSentence++) {
      $("#submitSentence").attr("disabled", true);
    }

  });




