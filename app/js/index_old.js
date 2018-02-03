/*jshint esversion: 6 */

/**Imports**/
var ipc = require('ipc');
var ProgressBar = require('progressbar.js');

/**Program variables**/
var currLetter = null;
var currProgressbar = null;
var shouldCancel = false;
var letterSelected = false;
var isSleeping = false;

/**User variables**/
var waitTime = 1000; //Time you have to look at an object, in ms

/**Custom functions**/
function startBar(pbar){
  pbar.animate(1.0);
}

function stopBar(pbar){
  pbar.stop();
}

function removeBar(pbar){
  pbar.destroy();
  currProgressbar = null;
  currLetter = null;
}

function insertText(text){
  document.getElementById('textbox').innerHTML = text;
}

function addLetter(letter){
  document.getElementById('textbox').innerHTML += letter;
}

function removeLastL(){
  prev = document.getElementById('textbox').innerHTML;
  var newStr = prev.slice(0, -1);
  document.getElementById('textbox').innerHTML = newStr;
}

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

function toggleSleeping(){
  isSleeping = !isSleeping;
}

function speak(){
  var msg = new SpeechSynthesisUtterance();
  msg.text = document.getElementById('textbox').innerHTML;
  speechSynthesis.speak(msg);
}

function createProgressbar(element_id){
var progressbarletter = null;
if(element_id == "keycap_space"){
  progressbarletter = new ProgressBar.Line(document.getElementById(element_id), {
    strokeWidth: 3,
    easing: 'linear',
    duration: waitTime,
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
    duration: waitTime,
    color: '#1abc9c',
    trailColor: '#3498db',
    trailWidth: 1,
    svgStyle: null
  });
  currProgressbar = progressbarletter;
}

}

function performAction(){
  if(!shouldCancel){
    var input = currLetter.replace("keycap_", "");
    switch(input){
      case "speak":
        speak();
      break;
      case "wback":
        removeLastW();
      break;
      case "backspace":
        removeLastL();
      break;
      case "settings":
        //TODO Add settings menu
      break;
      case "...":
        //TODO Add default sentecnes
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
      default:
        addLetter(input);
      break;

    }

    removeBar(currProgressbar);
  }else{
    //setTimeout(performAction, waitTime);

  }
}



function startLetter(button_element){
  var selectedButton = button_element.id;
  if((currLetter == null) || (selectedButton != currLetter)){
    if(currLetter != null){
      if(currProgressbar != null){
        removeBar(currProgressbar);
        shouldCancel = true;
      }

        shouldCancel = true;
    }
    currLetter = selectedButton;
    createProgressbar(currLetter);
    startBar(currProgressbar);


    setTimeout(performAction, waitTime);
    setTimeout(function(){shouldCancel = false;}, waitTime);

  }else{
    console.log("Do nothing");
  }
}

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

/**Event handlers**/
//Handle closing window, adds event listener to closing button
var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {

    ipc.send('close-main-window');
});

//Add event listener for every button with keycap_progress css id


/**Running code**/
enableButtons();
