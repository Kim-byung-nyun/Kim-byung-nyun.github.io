let figures = [];
let splitLine;
let canCrossLine = false;
let shatterPieces = [];
let shatter = false;
let keywordInput;
let currentKeyword = "";
let keywords = [
  'resilience',
  'unity',
  'diversity',
  'belonging',
  'strength',
  'visibility',
  'heritage',
  'empowerment',
  'inclusivity'
];


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  splitLine = 0; // Centered on the y-axis in WEBGL
  for (let i = 0; i < 10; i++) {
    let xTop = random(-width / 4, width / 4);
    let yTop = random(-height / 2 + 50, splitLine - 50);
    figures.push(new Figure(xTop, yTop, false)); // Perceived external side (minority)
  }
  for (let i = 0; i < 30; i++) {
    let xBottom = random(-width / 2 + 50, width / 2 - 50);
    let yBottom = random(splitLine + 50, height / 2 - 50);
    let zBottom = random(-200, 200);
    figures.push(new Figure(xBottom, yBottom, true, zBottom)); // Inner strength side with more 3D depth (majority)
  }

  keywordInput = createInput();
  keywordInput.position(10, 10);
  keywordInput.size(200);
  keywordInput.input(handleKeywordInput);

  let buttonX = 10;
  let buttonY = 50;
  let buttonWidth = 100;
  let buttonHeight = 30;
  let buttonsPerRow = 3;
  for (let i = 0; i < keywords.length; i++) {
    let btn = createButton(keywords[i]);
    let btnX = buttonX + (i % buttonsPerRow) * (buttonWidth + 10);
    let btnY = buttonY + floor(i / buttonsPerRow) * (buttonHeight + 10);
    btn.position(btnX, btnY);
    btn.size(buttonWidth, buttonHeight);
    btn.mousePressed(() => {
      keywordInput.value(keywords[i]);
      handleKeywordInput();
    });
  }
}

function draw() {
  background(20);
  lights();

  if (!shatter) {
    push();
    stroke(255);
    strokeWeight(4);
    line(-width / 2, splitLine, 0, width / 2, splitLine, 0);
    pop();
  } else {
    for (let piece of shatterPieces) {
      piece.update();
      piece.display();
    }
  }

  for (let figure of figures) {
    figure.update();
    figure.display();
  }
}

function mousePressed() {
  for (let figure of figures) {
    if (!figure.strong) {
      figure.move();
    }
  }
  if (mouseY > height / 2 - 10 && mouseY < height / 2 + 10) {
    canCrossLine = true;
    for (let figure of figures) {
      figure.collaborate();
    }
    shatterLine();
  }
}

function keyPressed() {
  for (let figure of figures) {
    if (!figure.strong) {
      figure.startMoving();
    }
  }
}

function shatterLine() {
  shatter = true;
  for (let i = 0; i < 50; i++) {
    let x = random(-width / 2, width / 2);
    let y = splitLine + random(-10, 10);
    let velocity = createVector(random(-3, 3), random(-3, 3), random(-3, 3));
    shatterPieces.push(new ShatterPiece(x, y, velocity));
  }
}

function handleKeywordInput() {
  currentKeyword = keywordInput.value().toLowerCase();
}

class ShatterPiece {
  constructor(x, y, velocity) {
    this.position = createVector(x, y, 0);
    this.velocity = velocity;
    this.size = random(5, 15);
    this.color = color(255);
  }

  update() {
    this.position.add(this.velocity);
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    ambientMaterial(this.color);
    noStroke();
    sphere(this.size / 2);
    pop();
  }
}

class Figure {
  constructor(x, y, strong, z = 0) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(0, 0, 0);
    this.size = strong ? random(60, 100) : random(20, 40);
    this.color = strong ? color(random(200, 255), random(50, 150), random(50, 150)) : color(random(100, 255), random(100, 255), random(100, 255));
    this.strong = strong;
    this.pulse = random(0.01, 0.03);
    this.pulseSize = this.size;
    this.shape = strong ? 'sphere' : random(['sphere', 'box']);
    this.isHarmonizing = false;
    this.harmonyProgress = 0;
  }

  update() {

    this.pulseSize = this.size + sin(frameCount * this.pulse) * 10;
    this.position.add(this.velocity);
    if (this.position.y < -height / 2 || (this.position.y > splitLine && !canCrossLine && !this.strong)) {
      this.velocity.y *= -1;
    }
    if (this.position.y > height / 2) {
      this.velocity.y *= -1;
    }
    if (this.position.x < -width / 2 || this.position.x > width / 2) {
      this.velocity.x *= -1;
    }
    if (this.position.z < -200 || this.position.z > 200) {
      this.velocity.z *= -1;
    }

    if (this.isHarmonizing) {
      this.harmonyProgress += 1 / (frameRate() * 100); 
      if (this.harmonyProgress > 1) this.harmonyProgress = 1;
      this.color = lerpColor(this.color, color(100, 200, 255), this.harmonyProgress);
      this.size = lerp(this.size, 80, this.harmonyProgress);
      this.shape = 'sphere';
    }

    switch (currentKeyword) {
      case 'resilience':
        this.color = color(255, 140, 0, 200); 
        break;
      case 'identity':
        this.shape = 'cone';
        this.color = color(128, 0, 128, 200);
        break;
      case 'unity':
        this.size = 150;
        this.color = color(0, 255, 127, 220); 
        break;
      case 'diversity':
        this.color = color(random(255), random(255), random(255), 200);
        this.shape = random(['sphere', 'cone', 'box']);
        break;
      case 'belonging':
        this.position = createVector(width /100 + random(-20, 20), height / 100 + random(-20, 20));
        this.color = color(70, 130, 180, 200); 
        break;
      case 'strength':
        this.size = 170;
        this.color = color(34, 139, 34, 230);
      case 'visibility':
        this.color = color(255, 215, 0, 230); 
        break;
      case 'heritage':
        this.shape = 'box';
        this.color = color(210, 105, 30, 200); 
        break;
      case 'empowerment':
        this.size = 180;
        this.color = color(255, 0, 255, 220); 
        break;
      case 'inclusivity':
        this.color = color(0, 0, 255, 230); 
        break;
    }
  }

  move() {
    this.position.x = random(-width / 4, width / 4);
    this.position.y = random(-height / 2 + 50, splitLine - 50);
  }

  startMoving() {
    this.velocity = createVector(random(-3, 3), random(-3, 3), random(-3, 3));
  }

  collaborate() {
    let target = createVector(0, splitLine, 0);
    this.velocity = p5.Vector.sub(target, this.position).setMag(2);
    this.isHarmonizing = true;
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.color);
    noStroke();

    if (this.shape === 'sphere') {
      sphere(this.pulseSize / 2);
    } else if (this.shape === 'box') {
      box(this.pulseSize);
    }

    // Add aura effect for strong side
    if (this.strong && !this.isHarmonizing) {
      noFill();
      specularMaterial(this.color);
      strokeWeight(2);
      for (let i = 1; i <= 3; i++) {
        push();
        sphere(this.pulseSize / 2 + i * 10);
        pop();
      }
    }
    pop();
  }
}



