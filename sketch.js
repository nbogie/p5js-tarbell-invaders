//note: noLoop()

var aliens;
var gOpts = {};

function recreatePalette() {
  gOpts.palette = Palette.create();
  gOpts.clearColor = color('black');

}

var Palette = {
  create: function() {
    colorMode(HSB, 360, 100, 100, 1);
    var hue = random(0, 360);
    var hueWidth = 50;
    var b = 100;
    var a = 1;
    var sat = 60;
    var cMain = color(hue, sat, b, a);
    var cLeft = color(hue - hueWidth / 2, sat, b, a);
    var cRight = color(hue + hueWidth / 2, sat, b, a);
    var cOpp = color((hue + 180) % 360, sat, b, a);
    return [cMain, cLeft, cRight, cOpp];
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  recreatePalette();
  recreateAliens();
  noLoop();
}


function recreateAliens() {
  aliens = [];

  gOpts.padding = 4;
  gOpts.pixelsInInvader = 5;
  gOpts.pixelWidth = 5;
  gOpts.sqDim = gOpts.pixelsInInvader * gOpts.pixelWidth + gOpts.padding * 2;

  gOpts.numRows = Math.floor(windowHeight / gOpts.sqDim);
  gOpts.numCols = Math.floor(windowWidth / gOpts.sqDim);

  for (var i = 0; i < gOpts.numRows * gOpts.numCols; i++) {
    aliens.push(createAlien());
  }
}

function createAlien() {
  bits = [];
  for (var col = 0; col < Math.ceil(gOpts.pixelsInInvader / 2); col++) {
    bits[col] = [];
    for (var row = 0; row < gOpts.pixelsInInvader; row++) {
      bits[col][row] = random([0, 1])
    }
  }
  return {
    bits: bits,
    c1: random(gOpts.palette),
    c0: gOpts.clearColor
  };
}

function mousePressed() {
  recreatePalette();
  recreateAliens();
  draw();
}

function drawAlien(alien) {
  noStroke();
  bits = alien.bits;

  function squareForBit(bit, col, row, c1, c0) {
    np = gOpts.pixelsInInvader;
    pw = gOpts.pixelWidth;
    fill(bit ? c1 : c0);
    rect(col * pw, row * pw, pw, pw);
  }
  var c1 = alien.c1;
  var c0 = alien.c0;

  np = gOpts.pixelsInInvader;
  halfnp = Math.ceil(np / 2);

  for (var row = 0; row < np; row++) {
    for (var col = 0; col < halfnp; col++) {
      var bit = bits[col][row];
      squareForBit(bit, col, row, c1, c0);
    }
    for (var col = halfnp; col < np; col++) {
      var bit = bits[np - col - 1][row];
      squareForBit(bit, col, row, c1, c0);
    }
  }
}

function draw() {
  background(gOpts.clearColor);
  push();
  translate(gOpts.padding, gOpts.padding);

  for (var row = 0; row < gOpts.numRows; row++) {
    for (var col = 0; col < gOpts.numCols; col++) {
      if (random() > 0.4) {
        push();
        translate(gOpts.sqDim * col, gOpts.sqDim * row);
        drawAlien(aliens[row * gOpts.numCols + col]);
        pop();
      }
    }
  }
  pop();
}