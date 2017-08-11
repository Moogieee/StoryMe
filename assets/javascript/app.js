 /*
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

*/

  // Initialize Firebase
var config = {
  apiKey: "AIzaSyAP42hRl_xz8Z7SMIRqcBgDuPeNELo0xt4",
  authDomain: "practicestoryme.firebaseapp.com",
    databaseURL: "https://practicestoryme.firebaseio.com",
  projectId: "practicestoryme",
   storageBucket: "practicestoryme.appspot.com",
  messagingSenderId: "680274883572"
  };
  firebase.initializeApp(config);


  var database = firebase.database(); ////reference to database root
  var storyRef = database.ref("/storyLines"); 
  var usersRef = database.ref("/Users");
  var startingSentence = database.ref("/Starting Sentences");
  var themeSelectedRef = database.ref("/themeSelected");
  var themeSelected = false;
  var playersNum = 0;

  var finalStory = [];
 
  

  var reset = function(){

    database.ref().remove();
    sessionStorage.clear();
    $("#welcomeMessage").html("Please sign in");
    $("#storyDiv").empty();
 
  }

  ////////The login html page code///////////////// 

///when the user logs in the user's name is pushed into the users database
$("#submit-button").on("click", function(event){
  
  event.preventDefault();
  console.log("hello");
  //sessionStorage.clear();

  var userName = $("#nameInput").val().trim();
  $("#loginDiv").hide();

  usersRef.child(playersNum+1).update({name: userName, status: "online"});

  //console.log(themeSelected);

  sessionStorage.setItem("playerKey", JSON.stringify(playersNum));
  sessionStorage.setItem("userName", JSON.stringify(userName));

  var currentUserNum = JSON.parse(sessionStorage.getItem("playerKey"));
  console.log(currentUserNum);

  if(currentUserNum  === 1){
      console.log("you are the first player");

      $("#welcomeMessage").html("You are the first player! Please proceed to choose the story theme");
       var proceedBtn1 = $("<button id='proceedBtn1'>Proceed</button>");
       proceedBtn1.show();
       $("#welcomeMessage").append(proceedBtn1);
    }

    else if (!themeSelected){
      console.log("you are not the first player");
      $("#welcomeMessage").html("Please wait for the first player to choose the theme and then join the fun!!!<br>");

      startingSentence.on("child_added", function(snap){
          $("#welcomeMessage").html("Ready to play!");
         var proceedBtn2 = $("<button id='proceedBtn2'>Proceed</button>");
            $("#welcomeMessage").append(proceedBtn2);
            proceedBtn2.show();
    })
    }
     else //if (currentUserNum > 1 && (themeSelected))
     {
      $("#welcomeMessage").html("Ready to play!");
      var proceedBtn2 = $("<button id='proceedBtn2'>Proceed</button>");
      $("#welcomeMessage").append(proceedBtn2);
      proceedBtn2.show();
     }


});


///When new user is added to the database if this is the first user then he is moved
///to the story themes page to choose a theme that applies to the rest of the players
///if this is not the first player then he automatically moves to the story page with the
///chosen theme
usersRef.on("value", function(snap){
  playersNum = snap.numChildren();




    $("#playerStatus").empty();
    if(playersNum > 0){ 
    for (var i = 1; i <= playersNum; i++) {
      var j = i.toString();
      var obj = snap.child(j).val();
      var newUser = $("<p>");
      newUser.html(obj.name+ " is " + obj.status);
      $("#playerStatus").append(newUser);
    }
  }
},function(err){
  console.log(err);
});


$(document.body).on("click", "#proceedBtn1", function(){
  $(this).hide();
  window.location = "storyThemes.html";

});

$(document.body).on("click", "#proceedBtn2", function(){
  $(this).hide();
  window.location = "storyPage.html";

});


///

database.ref().on("value", function(snap){

  //var themeSelected = false;
  if(snap.child("themeSelected").exists()){

    themeSelected = true;

    }

  
})

/////////////////////////////////////////////////



////The stories themes html page code////////////

//initializing an array with the starting sentences, a sentence for each theme
var startingSentences = ["The night sky was full of stars but no moon.",
   "Lately, Marlene felt that there was something missing from her life.",
   "Lady Luck was always on my side at the casinos.",
   "The subway stopped suddenly inside the tunnel."];

///When the first player clicks on the story theme, the starting sentence related
//that theme is picked from the database and displayed on the story page 
$(".story-image").on("click", function(){
  var themeSelected = true;
  var imageId = parseInt($(this).attr("id"));
  console.log(imageId);
  console.log(startingSentences[imageId]);
  $(this).attr("href", "storyPage.html");
  database.ref("/Starting Sentences").update({s: startingSentences[imageId]});
  database.ref("/themeSelected").update({selected: true});

});


/////////////////////////////////////////////////////

/////////The story page html code ////////////////

$("#resetBtn").hide();

//////When the theme is chosen, the relative starting sentence is loaded to the story div
startingSentence.on("child_added", function(snap){

    console.log(snap.val());
    $("#storyDiv").html(snap.val());
    finalStory.push(snap.val());


});


///When the user clicks write the sentence he entered is pushed to the database
$("#submitSentence").on("click", function(event){

    event.preventDefault();

    var newSentence = $("#userInput").val();
    var speaker = JSON.parse(sessionStorage.getItem("userName"));

    $("#userInput").val('');

    storyRef.push({speaker: speaker, newSentence: newSentence});

});

////When a new story sentence is added to the database it is automatically displayed 
///in the story page
storyRef.on("child_added", function(snapshot){
    console.log(snapshot.val());
    finalStory.push(snapshot.val().newSentence);
    
    $("#storyDiv").append("<br>"+snapshot.val().speaker+ " says "+snapshot.val().newSentence);

});

/////when the number of sentences reaches the limit, the users are notified that the
////the coming sentence is the last one. When the last sentence is entered the players
///cannot enter any more sentences
storyRef.on("value", function(snap){

    // console.log(snap.numChildren());

    var numSentences = snap.numChildren();
    var limitSentence = 5;

    if(numSentences === 5){
      $("#lastSentenceWarning").html("This is the last sentence! Enter the ending, Make it count!");

    }

    if(numSentences === 6) {
      $("#lastSentenceWarning").remove();
    }

    if(numSentences === (limitSentence+1)){


    $("#userInput").hide()
     $("#submitSentence").hide();
     //attr("disabled", true);

     storyRedisplay();
     
     

     $("#resetBtn").show();
    }
   

  });

/////When the last sentence is entered, the whole story is displayed without the speakers
var storyRedisplay = function(){

  $("#storyDiv").empty();
  $("#storyDiv").append("Here is the story!"+"<br>");
  for (var i = 0; i < finalStory.length; i++) {
    $("#storyDiv").append(finalStory[i]+"<br>");

  }
}

////text to speech to tell the story
var counter = 0;
var storyTell = function(){
  if(counter <finalStory.length){
    text = encodeURIComponent(finalStory[counter]);
    var url = "http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q="+ text +"&tl=En-gb";
    var speech = $("<audio onended='storyTell()'>");
    counter++;
    speech.attr("src", url).get(0).play();
  }
  else {
    counter = 0
  }

}

////display sentiment 

var sentimentStory = function(){


  var documents =  [];
  for (var i = 0; i < finalStory.length; i++) {
    var lineObj = {id: i, "text": finalStory[i]};
    documents.push(lineObj);
  }

    var params = {
            // Request parameters
          "numberOfLanguagesToDetect": 1,
        };
      
        $.ajax({
            url:  "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","16a787fa169245dc87fb41f6ddb7d0f0");
            },
            type: "POST",
            // Request body
            data: JSON.stringify({
                 documents: documents

                }),
        })
        .done(function(data) {
            var storySentimentScore = 0;
            console.log(data.documents[0].score);
            for (var i = 0; i < data.documents.length; i++) {
              storySentimentScore+= data.documents[i].score;
            }

            storySentimentScore = storySentimentScore / data.documents.length * 100;
            console.log(storySentimentScore);
            $("#sentimentDiv").append(storySentimentScore);
        })
        .fail(function() {
            console.log("error");
        });
  }

////When the reset button is pressed the database is cleared  
$("#resetBtn").on("click", function(){
    reset();
    window.location = "index.html";

 });


////when the user hits the leave button, this user is signed out and his status is updated
$("#leaveBtn").on("click", function(){
    var offPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
    usersRef.child(offPlayer).update({status: "offline"});
    setTimeout(function(){usersRef.child(offPlayer).remove()}, 3000);
    window.location = "index.html";
  
  
});

$("#readBtn").on("click", function(){
   storyTell();

})

$("#sentimentBtn").on("click", function(){
  sentimentStory();
})


//==========================ANIMATIONS==========================//
$(document).ready(function() {
  $("#storyme-logo").hide();
  $("#storyme-logo").fadeIn(2000);
  $(".one").hide();
  $(".one").fadeIn(4000);
  $(".two").hide();
  $(".two").fadeIn(6000);
  $(".three").hide();
  $(".three").fadeIn(8000);
});


// show footer on scroll on index.html
$(window).scroll(function(event) {
  function footer()
    {
        var scroll = $(window).scrollTop(); 
        if(scroll>20)
        { 
            $(".footer").fadeIn("slow").addClass("show");
        }
        else
        {
            $(".footer").fadeOut("slow").removeClass("show");
        }
    }
    footer();
});
    
  

///////////////////////////////////////////////////

//This changes the player's status to "offline" if the user navigates away.
//IMPORTANT: The following code block must always go after the one that sets the player staturs to "online."
$(window).on('unload', function() {
  if(window.closed){
  var offPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
  usersRef.child(offPlayer).update({status: "offline"});
  window.location = "index.html"; 
  } 
});
//Show player status as "online" on screen load.
// $(window).on('load', function() {
//   var onPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
//   usersRef.child(onPlayer).update({status: "online"});
  
// });

/////changes to js file////
//storyRef.on child added, push into array
//storyReplay function to replay the story in the end


