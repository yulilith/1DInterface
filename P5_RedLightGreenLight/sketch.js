/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  Red Light Green Light - 1D Game
  Based on P5_Interface1D by Marcelo Coelho

*/ /////////////////////////////////////


let displaySize = 50;   // how many pixels are visible in the game
let pixelSize = 20;     // how big each 'pixel' looks on screen

let playerOne;    // Player 1 (red)
let playerTwo;    // Player 2 (blue)

let display;      // Aggregates our final visual output before showing it on the screen

let controller;   // This is where the state machine and game logic lives

let winAnimation; // Where we store and manage the win animation

let lightPos = 49;    // The signal light / target position (rightmost)



function setup() {

  createCanvas((displaySize*pixelSize), pixelSize);     // dynamically sets canvas size

  display = new Display(displaySize, pixelSize);        // Initializing the display

  // Both players start at position 0 (leftmost)
  playerOne = new Player(color(255,0,0), 0, displaySize);   // Red player
  playerTwo = new Player(color(0,0,255), 0, displaySize);   // Blue player

  winAnimation = new Animation();     // Initializing animation

  controller = new Controller();      // Initializing controller

}

function draw() {

  // start with a blank screen
  background(0, 0, 0);

  // Runs state machine at determined framerate
  controller.update();

  // After we've updated our states, we show the current one
  display.show();

}
