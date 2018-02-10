/*jshint esversion: 6 */

/**Imports**/
var ProgressBar = require('progressbar.js');
const remote = require('electron').remote;

//Web Server
net = require('net');


/**Program variables**/
var currLetter = null;
var currProgressbar = null;
var currTimer = null;
var currPage = 0;
var confirmationDelay;
var webhost = '127.0.0.1';
var webport = 6969;

var isSleeping = false;

//EyeTracking
var eyecursor;
var cursx;
var cursy;


/**User variables**/
var screenHeight = 1080;

//ConfirmationDelay values
var CDelay_slowest = 4000;
var CDelay_slow = 2000;
var CDelay_normal = 1000;
var CDelay_fast = 600;

/**Custom functions**/
//Things to do at startup
function onStartup(){
  //Set Default speed
  document.getElementById('keycap_speed_normal').style.color = 'green';
  confirmationDelay = CDelay_normal;

  //EyeTracking
  eyecursor = document.getElementById("eyecursor");
  cursx = screen.width / 2;
  cursy = screen.height / 2;
  //Data Server
  createWebServer();

  //Start the loop
  setInterval(function(){ loop_20(); }, 50);
  setInterval(function(){ loop_5(); }, 100);

}

//Function that runs at 20Hz, use it wisely
function loop_20(){
  eyecursor.style.left = cursx+"px";
  eyecursor.style.top = cursy+"px";
}

function loop_5(){
  var item = document.elementFromPoint(cursx+"px", cursy+"px");
  item.trigger("click");
}

//Create webserver
function createWebServer(){
  net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        var arr = data.toString().split(":");
        cursx = arr[0];
        cursy = arr[1];


    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(webport, webhost);
console.log('Server listening on ' + webhost +':'+ webport);
}

//Sets confirmationDelay, how long you have to look at an object before it confirms your selection
function setConfirmationDelay(delay){
  confirmationDelay = delay;
}



//Get y coordinate of given page
function getPageLocation(pagename){
  switch(pagename){
    case "main":
      currPage = 0;
      return 0 * screenHeight;
    case "sentences":
      currPage = 1;
      return 1 * screenHeight;
    case "sentences_eatdrink":
      currPage = 2;
      return 2 * screenHeight;
    case "sentences_sot":
      currPage = 3;
      return 3 * screenHeight;
    case "sentences_conversation":
      currPage = 4;
      return 4 * screenHeight;
    case "sentences_toilethygiene":
      currPage = 5;
      return 5 * screenHeight;
    case "sentences_relax":
      currPage = 6;
      return 6 * screenHeight;
    case "settings":
      currPage = 7;
      return 7 * screenHeight;

  }
}

//Scrolls to given page
function goToPage(pagename){
  window.scrollTo(0, getPageLocation(pagename));
}

//Starts progressbar ARGS: Progressbar to start
function startBar(pbar){
  pbar.animate(1.0);
}

//Stops progressbar ARGS: Progressbar to stop
function stopBar(pbar){
  pbar.stop();
}

//Removes progressbar ARGS: Progressbar to remove
function removeBar(pbar){
  pbar.destroy();
  currProgressbar = null;
  currLetter = null;
}

//Adds text to textbox, only used for testing ARGS: Text to add
function insertText(text){
  document.getElementById('textbox').innerHTML = text;
}

//Adds letter to textbox ARGS: Letter to add
function addLetter(letter){
  document.getElementById('textbox').innerHTML += letter;
}

//Remove last letter from textbox
function removeLastL(){
  prev = document.getElementById('textbox').innerHTML;
  var newStr = prev.slice(0, -1);
  document.getElementById('textbox').innerHTML = newStr;
}

//Remove last word from textbox
function removeLastW(){
  var currText = document.getElementById('textbox').innerHTML;
  var newText = "";
  if (currText.includes(" "))
            {
                var lastSpace = currText.lastIndexOf(" ");
                newText = currText.substring(0, lastSpace);
            }
            else
            {
                newText = "";
            }
    document.getElementById('textbox').innerHTML = newText;
}
//Clears textboxtext
function clearText(){
  document.getElementById('textbox').innerHTML = "";
}

//Toggles the sleeping state
function toggleSleeping(){
  isSleeping = !isSleeping;
}

//Makes the program speak the text in the textbox
function speak(){
  var text = document.getElementById('textbox').innerHTML;
  responsiveVoice.speak(text, "Dutch Female");
}

//Creates progressbar for every letter when called ARGS: Button which to create progressbar for
function createProgressbar(element_id){
  var progressbarletter = null;
  if(element_id == "keycap_space"){
    progressbarletter = new ProgressBar.Line(document.getElementById(element_id), {
      strokeWidth: 3,
      easing: 'linear',
      duration: confirmationDelay,
      color: '#1abc9c',
      trailColor: '#3498db',
      trailWidth: 1,
      svgStyle: null
    });
    currProgressbar = progressbarletter;
  }else{
    progressbarletter = new ProgressBar.Circle(document.getElementById(element_id), {
      strokeWidth: 6,
      easing: 'linear',
      duration: confirmationDelay,
      color: '#1abc9c',
      trailColor: '#3498db',
      trailWidth: 1,
      svgStyle: null
    });
    currProgressbar = progressbarletter;
  }

}

//Performs the action according to which button is pressed
function performAction(){
    var input = currLetter.replace("keycap_", "");
    //PLACEHOLDER BOXES
    if(input.includes("EMPTY_")){
      input = "donothing";
    }
    //KEYS THAT GO BACK
    if(input.includes("back_")){
      input = "goback";
    }
    //Delay setting keys
    if(input.includes("speed_")){
      var desiredSpeed = input.substring(6, input.length);
      switch(desiredSpeed){
        case "slowest":
          setConfirmationDelay(CDelay_slowest);
          document.getElementById('keycap_speed_slowest').style.color = 'green';
          document.getElementById('keycap_speed_slow').style.color = 'black';
          document.getElementById('keycap_speed_normal').style.color = 'black';
          document.getElementById('keycap_speed_fast').style.color = 'black';

        break;
        case "slow":
          setConfirmationDelay(CDelay_slow);
          document.getElementById('keycap_speed_slowest').style.color = 'black';
          document.getElementById('keycap_speed_slow').style.color = 'green';
          document.getElementById('keycap_speed_normal').style.color = 'black';
          document.getElementById('keycap_speed_fast').style.color = 'black';

        break;
        case "normal":
          setConfirmationDelay(CDelay_normal);
          document.getElementById('keycap_speed_slowest').style.color = 'black';
          document.getElementById('keycap_speed_slow').style.color = 'black';
          document.getElementById('keycap_speed_normal').style.color = 'green';
          document.getElementById('keycap_speed_fast').style.color = 'black';

        break;
        case "fast":
          setConfirmationDelay(CDelay_fast);
          document.getElementById('keycap_speed_slowest').style.color = 'black';
          document.getElementById('keycap_speed_slow').style.color = 'black';
          document.getElementById('keycap_speed_normal').style.color = 'black';
          document.getElementById('keycap_speed_fast').style.color = 'green';

        break;
      }
      input = "donothing";
    }

    switch(input){
      //EVERYWHERE
      case "donothing":
        //DO NOTHING
      break;
      case "goback":
        goToPage("main");
      break;
      //PAGE MAIN
      case "speak":
        speak();
      break;
      case "wback":
        removeLastW();
      break;
      case "backspace":
        removeLastL();
      break;
      case "clear":
        clearText();
      break;
      case "settings":
        goToPage("settings");

      break;
      case "...":
        goToPage("sentences");
      break;
      case "123":
        //TODO Add number menu
      break;
      case "space":
        addLetter(" ");
      break;
      case "sleep":
        toggleSleeping();
        checkButtonOverlay();
      break;

      //PAGE SENTENCES
      case "eatdrink":
        goToPage("sentences_eatdrink");
      break;
      case "sot":
        goToPage("sentences_sot");
      break;
      case "conversation":
        goToPage("sentences_conversation");
      break;
      case "toilethygiene":
        goToPage("sentences_toilethygiene");
      break;
      case "relax":
        goToPage("sentences_relax");
      break;


      //PAGE SENTENCES_EATDRINK
      case "drink":
        insertText("Mag ik iets te drinken?");
        goToPage("main");
      break;
      case "hunger":
        insertText("Mag ik iets te eten?");
        goToPage("main");
      break;

      //PAGE SENTENCES_SOT
      case "happy":
        insertText("Ik ben blij");
        goToPage("main");
      break;
      case "angry":
        insertText("Ik ben boos");
        goToPage("main");
      break;
      case "pain":
        insertText("Ik heb pijn");
        goToPage("main");
      break;
      case "sad":
        insertText("Ik ben verdrietig");
        goToPage("main");
      break;
      case "relieved":
        insertText("Ik ben opgelucht");
        goToPage("main");
      break;

      //Page SENTENCES_CONVERSATION
      case "hay":
        insertText("Hoe gaat het?");
        goToPage("main");
      break;
      case "hitah":
        insertText("Hoe is het thuis?");
        goToPage("main");
      break;
      case "ln":
        insertText("Wat zijn de laatste nieuwtjes?");
        goToPage("main");
      break;

      //Page SENTENCES_TOILETHYGIENE
      case "toilet":
        insertText("Ik moet naar het toilet");
        goToPage("main");
      break;
      case "shower":
        insertText("Mag ik douchen?");
        goToPage("main");
      break;
      case "brushteeth":
        insertText("Mag ik mijn tandenpoetsen?");
        goToPage("main");
      break;

      //Page SENTENCES_TOILETHYGIENE
      case "tv":
        insertText("Mag ik televisie kijken?");
        goToPage("main");
      break;
      case "radio":
        insertText("Mag ik radio luisteren?");
        goToPage("main");
      break;
      case "games":
        insertText("Mag ik een spelletje spelen?");
        goToPage("main");
      break;
      case "audiobooks":
        insertText("Mag ik een luisterboek luisteren?");
        goToPage("main");
      break;

      //Page SETTINGS
      case "calibrate":
        //TODO Add calibration
      break;
      case "exit":
        //ipc.send('close-main-window');
        var window = remote.getCurrentWindow();
        window.close();
      break;

      default:
        addLetter(input);
      break;
    }
    removeBar(currProgressbar);

}

//Entry point when letter is pressed/looked at ARGS: Button to start
function startLetter(button_element){
  var selectedButton = button_element.id;
  if(selectedButton != currLetter){
    if(currTimer != null){
      clearTimeout(currTimer);
    }
    if(currProgressbar != null){
      removeBar(currProgressbar);
    }
    currLetter = selectedButton;
    createProgressbar(currLetter);
    startBar(currProgressbar);
    currTimer = setTimeout(performAction, confirmationDelay);
  }else{
    //Same letter as already selected
  }

}

//Checks if overlay state corresponds with sleeping state
function checkButtonOverlay(){
  var btn = document.querySelectorAll(".keycap, .keycap-wide");
  for (var i = 0; i < btn.length; i++) {
    if(isSleeping){
      btn[i].style.opacity = 0.4;
    }else{
      btn[i].style.opacity = 1;
    }

  }
}

//Add event listener for every button with keycap_progress css id
function enableButtons(){
  //ALL BUTTONS EXCEPT SLEEP BUTTON
  var btn = document.querySelectorAll(".keycap_progress");
  for (var i = 0; i < btn.length; i++) {
      btn[i].addEventListener("click", function() {
        if(!isSleeping){
          startLetter(this);
        }else{
          //DO NOTHING
        }

      }, false);
  }

  //SLEEP BUTTON
  var sleepbtn = document.querySelectorAll(".keycap_psleep");
  for (var j = 0; j < btn.length; j++) {
      sleepbtn[j].addEventListener("click", function() {
          startLetter(this);
      }, false);
  }
}

/**Running code**/
onStartup();
enableButtons();
