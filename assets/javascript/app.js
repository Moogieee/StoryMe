  
   
  ///Erika's Firebase
  // // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyD64Pvbid5872NQNwrRm8pjeWvqJ4wykDM",
//     authDomain: "storyme-5b335.firebaseapp.com",
//     databaseURL: "https://storyme-5b335.firebaseio.com",
//     projectId: "storyme-5b335",
//     storageBucket: "storyme-5b335.appspot.com",
//     messagingSenderId: "574338650013"
//   };

  // firebase.initializeApp(config);


/* Carie's Firebase */
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCgkD-pSu1mv32BAbAQ5H3KHRmZrRBxlfs",
    authDomain: "cn-firebase.firebaseapp.com",
    databaseURL: "https://cn-firebase.firebaseio.com",
    projectId: "cn-firebase",
    storageBucket: "cn-firebase.appspot.com",
    messagingSenderId: "992428345090"
  };
  firebase.initializeApp(config);

 //  /// Marwa's Firebase////
 // // Initialize Firebase
 //  var config = {
 //    apiKey: "AIzaSyAP42hRl_xz8Z7SMIRqcBgDuPeNELo0xt4",
 //    authDomain: "practicestoryme.firebaseapp.com",
 //    databaseURL: "https://practicestoryme.firebaseio.com",
 //    projectId: "practicestoryme",
 //    storageBucket: "practicestoryme.appspot.com",
 //    messagingSenderId: "680274883572"
 //  };
 //  firebase.initializeApp(config);

  //==========================ANIMATIONS==========================//
$(document).ready(function() {
  $("#storyme-logo").hide();
  $("#storyme-logo").fadeIn(2000);
  $(".one").hide();
  $(".one").fadeIn(4000);
  $(".two").hide();
  $(".two").fadeIn(5000);
  $(".three").hide();
  $(".three").fadeIn(6000);
  $("#proceedBtn1").hide();
  $("#proceedBtn2").hide();
  $("#readBtn").hide();
  $("#sentimentBtn").hide();
  $("#resetBtn").hide();
  $("#nameInput").attr("disabled", false);
  $("#submit-button").attr("disabled", false);

});

// show footer on scroll on index.html
$(window).scroll(function(event) {
  function footer()
    {
        var scroll = $(window).scrollTop(); 
        if(scroll>10)
        { 
            $(".callout").fadeIn("slow").addClass("show");
        }
        else
        {
            $(".callout").fadeOut("slow").removeClass("show");
        }
    }
    footer();
});

///Initializing variables
var database = firebase.database(); ////reference to database root
var storyRef = database.ref("/storyLines"); 
var usersRef = database.ref("/Users");
var startingSentence = database.ref("/Starting Sentences");
var themeSelectedRef = database.ref("/themeSelected");
var themeSelected = false;
var playersNum = false;
var finalStory = [];
  
////Reset function that reset divs, firebase and session storage
var reset = function(){
  database.ref().remove();
  sessionStorage.clear();
  $("#welcomeMessage").html("Please sign in");
  $("#storyDiv").empty();  
}
 


////////The login html page code////////////////////////////////////////// 
/////////////////////////////////////////////////////////////////////////

///when the user logs in the user's name and status are pushed into the users database
$("#submit-button").on("click", function(event){
  event.preventDefault();
  var userName = $("#nameInput").val().trim();
  $("#nameInput").val("");
  $("#nameInput").attr("disabled", true);
  $("#submit-button").attr("disabled", true);
  if(userName.length>0)
    usersRef.child(playersNum+1).update({name: userName, status: "online"});
  sessionStorage.setItem("playerKey", JSON.stringify(playersNum));
  sessionStorage.setItem("userName", JSON.stringify(userName));
  var currentUserNum = JSON.parse(sessionStorage.getItem("playerKey"));
  ///When new user is added to the database if this is the first user then he is moved to the story themes page to choose a theme that applies to the rest of the players
  ///The other players will wait till the first player chooses the theme then they can proceed to the game
  if(currentUserNum > 0){
    if(currentUserNum  === 1){
      $("#welcomeMessage").html("You are the first player! Please proceed to choose the story theme ");
      var proceedBtn1 = $("<button id='proceedBtn1'> Proceed</button>");
      $("#submit-button").hide();
      $("#proceedBtn1").show();
    }

    else if (!themeSelected){
      console.log("you are not the first player");
      $("#welcomeMessage").html("Please wait for the first player to choose the theme and then join the fun!!!<br> ");
      startingSentence.on("child_added", function(snap){
        $("#welcomeMessage").html("Ready to Play!")
          var proceedBtn2 = $("<button id='proceedBtn2'>Proceed</button>");
          $("#submit-button").hide();
          $("#proceedBtn2").show();
      })
    }
     
    else{
      var proceedBtn2 = $("<button id='proceedBtn2'>Press Enter to Play</button>");
      $("#welcomeMessage").html("Proceed to Play")
      $("#submit-button").hide();
      $("#proceedBtn2").show();
    }
  }
});

///The avatar, name and status of each player are displayed on the browser for all users and the status is updated whenever the players are on or off line
usersRef.on("value", function(snap){
  playersNum = snap.numChildren();
  $("#playerStatus").empty();
  $("#playersList").show();
  if(playersNum > 0){ 
    for (var i = 1; i <= playersNum; i++) {
      var j = i.toString();
      var obj = snap.child(j).val();
      var newUser = $("<li>");
      newUser.html('<img class="avatar" src="https://api.adorable.io/avatars/40/' + obj.name + '.png/" style="border-radius: 50%; opacity: 1; margin-right: 10px;">' + ' ' + obj.name + ' is ' + obj.status + '</li>');
      $("#playerStatus").append(newUser);
    }
  }
},function(err){
  console.log(err);
});

///A button clicked by the first player to proceed to the themes page to choose the story theme
$(document.body).on("click", "#proceedBtn1", function(){
  $(this).hide();
  window.location = "storyThemes.html";

});
///A butoon clicked by all users to proceed to the main story page
$(document.body).on("click", "#proceedBtn2", function(){
  $(this).hide();
  window.location = "storyPage.html";

});


//// The story theme is selected
database.ref().on("value", function(snap){
  if(snap.child("themeSelected").exists()){
    themeSelected = true;
  }  
})


////////The stories themes html page code////////////
/////////////////////////////////////////////////////

//initializing an array with the starting sentences, a sentence for each theme
var startingSentences = ["The night sky was full of stars but no moon.",
   "Lately, Marlene felt that there was something missing from her life.",
   "Lady Luck was always on my side at the casinos.",
   "The subway stopped suddenly inside the tunnel."];

///When the first player clicks on the story theme, the starting sentence related to that theme is picked from the database and displayed on the story page 
$(".story-image").on("click", function(){
  var imageId = parseInt($(this).attr("id"));
  console.log(imageId);
  console.log(startingSentences[imageId]);
  $(this).attr("href", "storyPage.html");
  database.ref("/Starting Sentences").update({s: startingSentences[imageId]});
  database.ref("/themeSelected").update({selected: true});
});


/////////The story page html code ///////////////////
/////////////////////////////////////////////////////


//////When the starting sentence is added to the database, it is displayed for all users and is pushed into the final story array
startingSentence.on("child_added", function(snap){
  finalStory.push(snap.val());
  $("#storyDiv").html(snap.val());
});

/////When the user clicks "write" button, the sentence he entered is pushed to the database
$("#submitSentence").on("click", function(event){
  event.preventDefault();
  var newSentence = $("#userInput").val();
  var speaker = JSON.parse(sessionStorage.getItem("userName"));
  $("#userInput").val('');
  $(".emojionearea-editor").html("");
  storyRef.push({speaker: speaker, newSentence: newSentence});
});

////When a new story sentence is added to the database it is automatically displayed in the story page
storyRef.on("child_added", function(snapshot){
  finalStory.push(snapshot.val().newSentence);
  $("#storyDiv").append("<br><span style='color: white; font-weight: bold; font-size: 1em'>"+ snapshot.val().speaker + " says: </span>" + snapshot.val().newSentence);
});

/////when the number of sentences reaches the limit, the users are notified that the the coming sentence is the last one. 
//When the last sentence is entered the whole story is redisplayed again and the players are giving the option to choose from reading the story
///by text to speech or calculate sentiment
storyRef.on("value", function(snap){
  var numSentences = snap.numChildren();
  var limitSentence = 5;
  if(numSentences === 5){
    $("#lastSentenceWarning").html("This is the last sentence! Enter the ending, Make it count!");
  }
  if(numSentences === 6) {
    $("#readBtn").show();
    $("#sentimentBtn").show();
    $("#lastSentenceWarning").remove();
    $("#userInput").remove();
    $("#submitSentence").remove();
    $(".emojionearea").remove();
  }

  if(numSentences === (limitSentence+1)){
    $("#submitSentence").attr("disabled", true);
    storyRedisplay();
    $("#resetBtn").show();
  }
});

/////Function to re-display the story when it is complete
var storyRedisplay = function(){
  $("#storyDiv").empty();
  database.ref().remove();
  $("#playersList").hide();
  $("#storyDiv").append("<span style='font-weight: bold'>Here is the story!"+"<br><br>");
  for (var i = 0; i < finalStory.length; i++) {
    $("#storyDiv").append(finalStory[i]+"<br>");
  }
}

////Text to speech to tell the story
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
    counter = 0;
  }

}

////Calculate and display sentiment of the story
var sentimentStory = function(){
  var documents =  [];
  for (var i = 0; i < finalStory.length; i++) {
    var lineObj = {id: i, "text": finalStory[i]};
    documents.push(lineObj);
  }
  var params = {
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
    for (var i = 0; i < data.documents.length; i++) {
      storySentimentScore+= data.documents[i].score;
    }

    storySentimentScore = Math.floor(storySentimentScore / data.documents.length * 100);
    $("#sentimentDiv").append(storySentimentScore + "%");

    // sentiment counter animation
    var animationLength = 2000; //ms
    var counter = 0,
    counterEnd = storySentimentScore,
    countInterval = animationLength / counterEnd; // 20 ms
    a = 1.05; //speed factor
    var summatory = 0;
    function animate() {
      $('#sentimentDiv').text(counter++ + "%");
      if (counter <= storySentimentScore) {
       //Calculate dynamically newInterval
       var newInterval = (animationLength-summatory) / ((a-Math.pow(a, -(storySentimentScore-1))) / (a-1));
       summatory += newInterval;
       countInterval = newInterval;
       setTimeout(animate, newInterval);
      } 
    } //end sentiment counter animation

    animate();

    if(storySentimentScore <= 100 && storySentimentScore > 80) {
      $("#emojiDiv").html("<img src='assets/images/veryHappyEmoji.png' />").hide().fadeIn(2000);
            
    } else if (storySentimentScore <= 80 && storySentimentScore > 60) {
      $("#emojiDiv").html("<img src='assets/images/happyEmoji.png' />").hide().fadeIn(2000);
            
    } else if (storySentimentScore <= 60 && storySentimentScore > 40) {
      $("#emojiDiv").html("<img src='assets/images/neutralEmoji.png' />").hide().fadeIn(2000);

    } else if (storySentimentScore <= 40 && storySentimentScore > 20) {
      $("#emojiDiv").html("<img src='assets/images/almostSadEmoji.png' />").hide().fadeIn(2000);

    } else if (storySentimentScore <= 20) {
      $("#emojiDiv").html("<img src='assets/images/sadEmoji.png' />").hide().fadeIn(1000)

    }

  })
  .fail(function() {
    console.log("error");
  });

}


////When the reset button is pressed the reset function is called 
$("#resetBtn").on("click", function(){
    reset();
    window.location = "index.html";
 });

////when the user hits the leave button, this user is signed out and his status is updated
$("#leaveBtn").on("click", function(){
  var offPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
  if(offPlayer)
    usersRef.child(offPlayer).update({status: "offline"});
  sessionStorage.clear();
  window.location = "index.html"; 
});
    
///When the read button is pressed, the storyTell function is called to read the story lines    
$("#readBtn").on("click", function(){
   storyTell();
})

///When the sentiment button is pressed, the sentimentStory funciton is called to calculate and display the sentiment
$("#sentimentBtn").on("click", function(){
  sentimentStory();
})

//This changes the player's status to "offline" if the user navigates away.
$(window).on("unload", function() {
  var offPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
  var offPlayerName = JSON.parse(sessionStorage.getItem("userName"));
  if(offPlayer)
      usersRef.child(offPlayer).update({name: offPlayerName, status: "offline"});
  window.location = "index.html";
});

$(window).on("load", function() {
  var onPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
  var onPlayerName = JSON.parse(sessionStorage.getItem("userName"));
  if(onPlayer)
      usersRef.child(onPlayer).update({name: onPlayerName, status: "online"});    
});

$(document).ready(function(){ 
$("#userInput").emojioneArea({

      pickerPosition: "top",
      filterPosition: "bottom",
      placeholder: "",
      event: {
       keypress: function (editor, event) {
           $("#userInput").setText(""); // this work
       }
      
      }
      
    });

  });