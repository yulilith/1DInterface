// Display buffer for the rhythm game
// Aggregates visual output before showing on screen

class Display {

    constructor(_displaySize, _pixelSize) {

      this.displaySize = _displaySize;
      this.pixelSize = _pixelSize;
      this.initColor = color(0, 0, 0);
      this.displayBuffer = [];

      for (let i = 0; i < this.displaySize; i++) {
        this.displayBuffer[i] = this.initColor;
      }
    }

    // Color a specific pixel in the buffer
    setPixel(_index, _color) {
        if (_index >= 0 && _index < this.displaySize) {
            this.displayBuffer[_index] = _color;
        }
    }

    // Blend a color onto an existing pixel (additive-style)
    blendPixel(_index, _color, _alpha) {
        if (_index < 0 || _index >= this.displaySize) return;

        let existing = this.displayBuffer[_index];
        let a = constrain(_alpha, 0, 1);

        let r = lerp(red(existing), red(_color), a);
        let g = lerp(green(existing), green(_color), a);
        let b = lerp(blue(existing), blue(_color), a);

        this.displayBuffer[_index] = color(r, g, b);
    }

    // Color all pixels in the buffer
    setAllPixels(_color) {
      for (let i = 0; i < this.displaySize; i++) {
        this.displayBuffer[i] = _color;
      }
    }

    // Render to screen with hit-zone styling
    show() {
      for (let i = 0; i < this.displaySize; i++) {
        noStroke();
        fill(this.displayBuffer[i]);
        rect(i * this.pixelSize, 0, this.pixelSize, this.pixelSize);
      }

      // Hit zone borders: white outlines at pixel 0 and pixel 29
      stroke(255, 255, 255, 120);
      strokeWeight(2);
      noFill();
      rect(0, 0, this.pixelSize, this.pixelSize);
      rect((this.displaySize - 1) * this.pixelSize, 0, this.pixelSize, this.pixelSize);
      noStroke();
    }

    // Clear to black
    clear() {
        for (let i = 0; i < this.displaySize; i++) {
            this.displayBuffer[i] = this.initColor;
        }
    }
}
