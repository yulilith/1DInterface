/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 7, 2025
  Marcelo Coelho

*/ /////////////////////////////////////


let displaySize = 52;   // how many pixels are visible in the game
let pixelSize = 20;     // how big each 'pixel' looks on screen

let playerOne;    // Adding 2 players to the game
let playerTwo;
let target;       // and one target for players to catch.

let display;      // Aggregates our final visual output before showing it on the screen

let controller;   // This is where the state machine and game logic lives

let successAnimation;   // Plays when players successfully match the target

let blockColor;     // Color for the collaborative player block (purple)


function setup() {

  createCanvas((displaySize*pixelSize), pixelSize);     // dynamically sets canvas size

  display = new Display(displaySize, pixelSize);        // Initializing the display

  // Spawn players at center
  let center = parseInt(displaySize / 2);
  playerOne = new Player(color(255,0,0), center - 1, displaySize);
  playerTwo = new Player(color(0,0,255), center + 1, displaySize);

  blockColor = color(200, 162, 200);   // Purple for collaborative block

  target = new Target(color(255,255,0), displaySize);    // Target block spawns left or right, moves toward center

  successAnimation = new SuccessAnimation(displaySize);

  controller = new Controller();            // Initializing controller

}

function draw() {

  // start with a blank screen
  background(0, 0, 0);    

  // Runs state machine at determined framerate
  controller.update();

  // After we've updated our states, we show the current one 
  display.show();


}


