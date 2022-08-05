const events = [
  {
    text: "Your pet has rolled around in mud",
    eventEffect: "dirty += 20;",
  },
  {
    text: "Your pet has eaten something foul and thrown up on themselves",
    eventEffect: "dirty += 35;",
  },
  {
    text: "You've recently taken your pet to the vet and they haven't eaten in a while",
    eventEffect: "hungry += 30;",
  },
  {
    text: "You've been gone a while! Your pet is bored!",
    eventEffect: "bored -= 20;",
  },
  {
    text: "A wild animal stole your pet's food! Now they have nothing to eat!",
    eventEffect: "hungry += 20;",
  },
  {
    text: "Your pet is so bored that they got tired of sleeping!",
    eventEffect: "bored -= 40;",
  }
];
//contains how likely each event is to happen [line up probability and array object]
const eventProbablity = [16, 11, 8, 9, 13, 4];
const buttons = document.querySelectorAll("#simHold .button");
console.log(buttons);
const textOutput = document.querySelector("#simHold .box");
const bars = document.querySelectorAll(".progress");

let bored = 50; //what play increases
let hungry = 50; //what feed decreases
let dirty = 50; //what clean decreases
let time = new Date().toLocaleTimeString();

//Placeholder image in simulation
const simulationImage = document.querySelector(".simImg");
//Checks if the placeholder image has been replaced
let petChosen = false;

function getTime() {
  time = new Date().toLocaleTimeString();
}

function whichButton(but) {
  if (but.id === "playButton") {
    if (bored < 100) {
      bored += 20;
      progressUpdate();
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - You take out some cat toys and enrich the life of your cat.<br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }
    else {
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - Your pet is already full of joy!<br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }
  }
  else if (but.id === "feedButton") {
    if (hungry != 0) {
      hungry -= 10;
      progressUpdate();
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - You put down a bowl of your pet's favourte food! It isn't long until their face is completely in the food.<br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }
    else {
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - Your pet is definitely full, don't let them trick you!<br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }
  }
  else if (but.id === "cleanButton") {
    if (dirty != 0) {
      dirty -= 10;
      progressUpdate();
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - You clean and brush your cat.<br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }
    else {
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - Your pet is no longer dirty! Hurrah!<br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }
  }
}

function whichBar(bar) {
  if (bar.id === "playProgress") {
    return "bored";
  }
  else if (bar.id === "feedProgress") {
    return "hungry";
  }
  else if (bar.id === "cleanProgress") {
    return "dirty";
  }
}

//Time functions
function decreaseBored() {
  bored -= 10;
  progressUpdate();
  getTime();
  textOutput.innerHTML = textOutput.innerHTML + `[${time}] - You left your pet alone and they got bored! <br>`;
}
function increaseHungry() {
  hungry += 10;
  progressUpdate();
  getTime();
  textOutput.innerHTML = textOutput.innerHTML + `[${time}] - Your pet got hungrier! <br>`;
}
function increaseDirty() {
  dirty += 10;
  progressUpdate();
  getTime();
  textOutput.innerHTML = textOutput.innerHTML + `[${time}] - Your pet got dirtier from playing! <br>`;
}

//updates progress bar
function progressUpdate() {
  for (let i = 0; i < bars.length; i++) {
    bars[i].value = eval(whichBar(bars[i]));
    console.log(bars[i]);
    console.log(whichBar(bars[i]));
  }
}

//random event functions
function simulateEvent(chances) {
  var sum = 0;
  chances.forEach((chance) => {
    sum += chance;
  });
  var rand = Math.random();
  var chance = 0;
  for (var i = 0; i < chances.length; i++) {
    chance += chances[i] / sum;
    if (rand < chance) {
      return i;
    }
  }
  // should *never* be reached unless sum of probabilities is less than 1
  // due to all being zero or some being negative probabilities
  return -1;
}

function generateRandomPetEvent() {
  let randomNum = Math.floor(Math.random() * events.length);
  //event only happens if the random number is divisible by 2
  if (randomNum % 2 == 0) {
    //prob = simulateEvent(eventProbablity);
    //event = events[prob];
    return events[simulateEvent(eventProbablity)];
  }
}

//eh. what do you mean by that, OH
//idk, Victor you here to weigh in?
//
//change the img? or like?? ah, I think we just have to comment the window.onbefore
//yeah the dialouge box is gone

//initalizes variables before event listener
let gen;
let boredTimer;
let hungryTimer;
let dirtyTimer;
//Changes placeholder image and starts the random events
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("breedImg") != null) {
    simulationImage.src = localStorage.getItem("breedImg");

    petChosen = true;
    const alert = document.querySelector(".petAlert");
    alert.classList.add("hidden");
    //makes the button not disabled
    buttons.forEach((button) => {
      button.disabled = false;
    });

    //Set timers
    boredTimer = setTimeout(decreaseBored, 60000);
    hungryTimer = setTimeout(increaseHungry, 120000);
    dirtyTimer = setTimeout(increaseDirty, 180000);
    //gives a chance to generate a random pet event every 20 sec
    //const
    gen = setInterval(() => {
      let petWoes = generateRandomPetEvent();
      console.log(petWoes);
      eval(petWoes.eventEffect);
      progressUpdate();
      getTime();
      textOutput.innerHTML = textOutput.innerHTML + `[${time}] - ${petWoes.text} <br>`;
      textOutput.scrollTop = textOutput.scrollHeight;
    }, 20000);
    //clearInterval(gen);
  }
  else {
    petChosen = false;
  }
});

//THE ALL IMPORTANT BUTTON CALLER
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    console.log(button);
    whichButton(button);
  });
});

window.onbeforeunload = function() {
     localStorage.removeItem("breedImg");
     return '';
};