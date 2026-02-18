/*

  Red Light Green Light - Two Player Controller

  Player 1 (Red): Push button on pin 2
    - Push button = GO (sends 'D' key)
    - Release button = STOP
    - Circuit: one leg to pin 2 + 10K resistor to GND, other leg to 5V
    - Reference: https://docs.arduino.cc/built-in-examples/digital/Button/

  Player 2 (Blue): Tilt sensor on pin 3
    - Shake constantly = GO (sends 'L' key on each state change)
    - Stay still = STOP
    - Circuit: one lead to pin 3, other lead to GND (external pull-up resistor)
    - Reference: https://docs.arduino.cc/tutorials/generic/tilt-sensor/

*/

#include <Keyboard.h>

// Pin assignments
const int buttonPin = 2;   // Push button for Player 1
const int tiltPin = 3;     // Tilt sensor for Player 2

// Player 1: Button state tracking (edge detection)
bool lastButtonState = LOW;

// Player 2: Tilt sensor state tracking
int lastTiltState = HIGH;
unsigned long lastSendTime = 0;
const unsigned long sendCooldown = 0;  // ms — tune for balance

void setup()
{
  Serial.begin(57600);

  pinMode(buttonPin, INPUT);
  pinMode(tiltPin, INPUT);

  Keyboard.begin();
}

void loop()
{

  // --- Player 1: Push Button ---
  // Each press sends one 'D' key (move one step)

  int buttonState = digitalRead(buttonPin);
  Serial.println(buttonState);
  Serial.print(buttonState);

  if (buttonState == HIGH && lastButtonState == LOW)
  {
    Keyboard.write('D');
    Serial.println("P1: Button pressed -> D");
  }

  lastButtonState = buttonState;


  // --- Player 2: Tilt Sensor (Shake Detection) ---
  // Sends 'L' on state change with cooldown

  int tiltState = digitalRead(tiltPin);
  if (tiltState == LOW && lastTiltState == HIGH && (millis() - lastSendTime) > sendCooldown)
  {
    Keyboard.write('L');
    Serial.println("P2: -> L");
    lastTiltState = tiltState;
    lastSendTime = millis();
  }
  lastTiltState = tiltState;

}
