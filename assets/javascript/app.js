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
  var sentence = "Once upon a time there was an avocado";
  var imageId = 0;
  var usersRef = database.ref("/Users");
  var startingSentence = database.ref("/Starting Sentences");

//Index.html:  ////////////////////////////////////////////////////////////////////

  var startingSentences = ["The night sky was full of stars but no moon.",
   "Lately, Marlene felt that there was something missing from her life.", 
   "Lady Luck was always on my side at the casinos.",
   "The subway stopped suddenly inside the tunnel."];


   $(".story-image").on("click", function(){
    var imageId = parseInt($(this).attr("id"));
    console.log(imageId);
    console.log(startingSentences[imageId]);
    $(this).attr("href","storyPage.html");
    database.ref("/Starting Sentences").update({s: startingSentences[imageId]});

   
   });

    $("#login").on("click", function(){
    var userName = $("#nameInput").val().trim();
    database.ref("/Users").push({userName: userName});

    // $(this).attr("href","storyThemes.html");
   
   });

    usersRef.on("value", function(snapshot){
    var playersNum = snapshot.numChildren();
    if (playersNum === 0) {

      console.log("Please sign in.");
    }

    else if(playersNum === 1) {
      console.log("you are number 1!");
      $("#login").attr("href","storyThemes.html");

    }
    else{
      console.log("Player " + playersNum + " has joined!");
      $("#login").attr("href","storyPage.html");
    }

    })





//Story Page HTML: ///////////////
  //$("#storyDiv").html(startingSentences[imageId]);



  //storyRef.push(sentence);

  startingSentence.on("child_added", function(snapshot){

    $("#storyDiv").html(snapshot.val());


    
    
  })

  $("#submitSentence").on("click", function(event){
    event.preventDefault();
    var newSentence = $("#userInput").val();
    storyRef.push(newSentence);
    $("#userInput").val("");

  })

  storyRef.on("child_added", function(snapshot){
     $("#storyDiv").append("<br>" + snapshot.val());
  });

  storyRef.on("value", function(snapshot){
    // console.log(snapshot.val());
    console.log(snapshot.numChildren());
    var numSentences = snapshot.numChildren();
    var limitSentence = 5;

    if (numSentences === 5) {
      $("#storyDiv").append("<br>" + "This is the last sentence! Enter the last sentence, make it count!");
      

    }

    if (numSentences === (limitSentence + 1)) {
      $("#submitSentence").attr("disabled", true);
    }

  });








