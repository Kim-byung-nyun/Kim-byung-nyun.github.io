let figures = [];
let splitLine;
let canCrossLine = false;
let shatterPieces = [];
let shatter = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  splitLine = width / 2;
  // Create figures on both sides of the split screen
  for (let i = 0; i < 10; i++) {
    let xLeft = random(50, splitLine - 50);
    let yLeft = random(height / 4, (3 * height) / 4);
    figures.push(new Figure(xLeft, yLeft, false)); // Perceived external side
  }
  for (let i = 0; i < 30; i++) {
    let xRight = random(splitLine + 50, width - 50);
    let yRight = random(50, height - 50);
    figures.push(new Figure(xRight, yRight, true)); // Inner strength side
  }
}

function draw() {
  background(20);

  if (!shatter) {
    stroke(255);
    strokeWeight(4);
    line(splitLine, 0, splitLine, height);
  } else {
    for (let piece of shatterPieces) {
      piece.update();
      piece.display();
    }
  }

  // Update and display figures on both sides
  for (let figure of figures) {
    figure.update();
    figure.display();
  }
}

function mousePressed() {
  // Move left-side figures when mouse is pressed
  for (let figure of figures) {
    if (!figure.strong) {
      figure.move();
    }
  }

  // If the mouse is pressed on the middle line, allow all figures to cross and collaborate, and shatter the line
  if (mouseX > splitLine - 10 && mouseX < splitLine + 10) {
    canCrossLine = true;
    for (let figure of figures) {
      figure.collaborate();
    }
    shatterLine();
  }
}

function keyPressed() {
  // Make left-side figures start moving and bouncing when a key is pressed
  for (let figure of figures) {
    if (!figure.strong) {
      figure.startMoving();
    }
  }
}

function shatterLine() {
  shatter = true;
  for (let i = 0; i < 50; i++) {
    let x = splitLine + random(-10, 10);
    let y = random(height);
    let velocity = createVector(random(-3, 3), random(-3, 3));
    shatterPieces.push(new ShatterPiece(x, y, velocity));
  }
}

class ShatterPiece {
  constructor(x, y, velocity) {
    this.position = createVector(x, y);
    this.velocity = velocity;
    this.size = random(5, 15);
    this.color = color(255);
  }

  update() {
    this.position.add(this.velocity);
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size);
  }
}

class Figure {
  constructor(x, y, strong) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.size = strong ? random(60, 100) : random(20, 40);
    this.color = strong ? color(random(50, 200), random(200, 255), random(50, 200)) : color(random(100, 255), random(100, 255), random(100, 255));
    this.strong = strong;
    this.pulse = random(0.01, 0.03);
    this.pulseSize = this.size;
    this.shape = strong ? 'circle' : random(['circle', 'triangle', 'square']);
    this.isHarmonizing = false;
    this.harmonyProgress = 0;
  }

  update() {
    // Pulsing effect for visual emphasis
    this.pulseSize = this.size + sin(frameCount * this.pulse) * 10;

    // Update position if moving
    this.position.add(this.velocity);

    // Bounce off walls, respecting whether they can cross the line
    if (this.position.x < 0 || (this.position.x > splitLine && !canCrossLine && !this.strong)) {
      this.velocity.x *= -1;
    }
    if (this.position.x > width) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.velocity.y *= -1;
    }

    // If collaboration occurs, gradually change to represent harmony over 10 seconds
    if (this.isHarmonizing) {
      this.harmonyProgress += 1 / (frameRate() * 100); // Gradual transition over 10 seconds
      if (this.harmonyProgress > 1) this.harmonyProgress = 1;
      this.color = lerpColor(this.color, color(100, 200, 255), this.harmonyProgress);
      this.size = lerp(this.size, 80, this.harmonyProgress);
      this.shape = 'circle';
    }
  }

  move() {
    // Move to a random position within the left side
    this.position.x = random(50, splitLine - 50);
    this.position.y = random(height / 4, (3 * height) / 4);
  }

  startMoving() {
    // Set random velocity to start moving and bouncing
    this.velocity = createVector(random(-3, 3), random(-3, 3));
  }

  collaborate() {
    // Move towards the center line to symbolize collaboration
    let target = createVector(splitLine, height / 2);
    this.velocity = p5.Vector.sub(target, this.position).setMag(2);
    this.isHarmonizing = true;
  }

  display() {
    fill(this.color);
    noStroke();

    if (this.shape === 'circle') {
      ellipse(this.position.x, this.position.y, this.pulseSize, this.pulseSize);
    } else if (this.shape === 'triangle') {
      triangle(
        this.position.x, this.position.y - this.pulseSize / 2,
        this.position.x - this.pulseSize / 2, this.position.y + this.pulseSize / 2,
        this.position.x + this.pulseSize / 2, this.position.y + this.pulseSize / 2
      );
    } else if (this.shape === 'square') {
      rectMode(CENTER);
      rect(this.position.x, this.position.y, this.pulseSize, this.pulseSize);
    }

    // Add aura effect for strong side
    if (this.strong && !this.isHarmonizing) {
      noFill();
      stroke(this.color);
      strokeWeight(2);
      for (let i = 1; i <= 3; i++) {
        ellipse(this.position.x, this.position.y, this.pulseSize + i * 10, this.pulseSize + i * 10);
      }
    }
  }
}


