// Reference: https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

//import p5 from "p5";

var p = function(sketch) {
  //note: noLoop()

  let aliens;
  const gOpts = {};
  let selected;

  function recreatePalette() {
    gOpts.palette = Palette.create();
    gOpts.clearColor = sketch.color("black");
  }

  const Palette = {
    create: function() {
      sketch.colorMode(sketch.HSB, 360, 100, 100, 1);
      const hue = sketch.random(0, 360);
      const hueWidth = 50;
      const b = 100;
      const a = 1;
      const sat = 60;
      const cMain = sketch.color(hue, sat, b, a);
      const cLeft = sketch.color(hue - hueWidth / 2, sat, b, a);
      const cRight = sketch.color(hue + hueWidth / 2, sat, b, a);
      const cOpp = sketch.color((hue + 180) % 360, sat, b, a);
      return [cMain, cLeft, cRight, cOpp];
    }
  };

  sketch.setup = function() {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    recreatePalette();
    recreateAliens();
    sketch.noLoop();
  };

  function recreateAliens() {
    aliens = [];

    gOpts.padding = 4;
    gOpts.pixelsInInvader = 5;
    gOpts.pixelWidth = 5;
    gOpts.sqDim = gOpts.pixelsInInvader * gOpts.pixelWidth + gOpts.padding * 2;

    gOpts.numRows = Math.floor(sketch.windowHeight / gOpts.sqDim);
    gOpts.numCols = Math.floor(sketch.windowWidth / gOpts.sqDim);

    for (let i = 0; i < gOpts.numRows * gOpts.numCols; i++) {
      aliens.push(createAlien());
    }
  }

  function createAlien() {
    const bits = [];
    for (let col = 0; col < Math.ceil(gOpts.pixelsInInvader / 2); col++) {
      bits[col] = [];
      for (let row = 0; row < gOpts.pixelsInInvader; row++) {
        bits[col][row] = sketch.random([0, 1]);
      }
    }
    return {
      bits: bits,
      c1: sketch.random(gOpts.palette),
      c0: gOpts.clearColor
    };
  }

  sketch.mousePressed = function() {
    recreatePalette();
    recreateAliens();
    setSelectedFromClick();
    sketch.draw();
  };
  function screenToGridPosition(screenPos) {
    return sketch.createVector(
      sketch.floor(screenPos.x / gOpts.sqDim),
      sketch.floor(screenPos.y / gOpts.sqDim)
    );
  }

  function mouseAsGridPosition() {
    return screenToGridPosition(
      sketch.createVector(sketch.mouseX, sketch.mouseY)
    );
  }

  function setSelectedFromClick() {
    selected = mouseAsGridPosition();
  }

  function drawAlien(alien) {
    sketch.noStroke();
    const bits = alien.bits;

    function squareForBit(bit, col, row, c1, c0) {
      const pw = gOpts.pixelWidth;
      sketch.fill(bit ? c1 : c0);
      sketch.rect(col * pw, row * pw, pw, pw);
    }
    const c1 = alien.c1;
    const c0 = alien.c0;

    const np = gOpts.pixelsInInvader;
    const halfnp = Math.ceil(np / 2);

    for (let row = 0; row < np; row++) {
      for (let col = 0; col < halfnp; col++) {
        let bit = bits[col][row];
        squareForBit(bit, col, row, c1, c0);
      }
      for (let col = halfnp; col < np; col++) {
        let bit = bits[np - col - 1][row];
        squareForBit(bit, col, row, c1, c0);
      }
    }
  }
  sketch.draw = function() {
    sketch.background(gOpts.clearColor);
    sketch.push();
    sketch.translate(gOpts.padding, gOpts.padding);

    for (let row = 0; row < gOpts.numRows; row++) {
      for (let col = 0; col < gOpts.numCols; col++) {
        //if (sketch.random() > 0.4) {
        sketch.push();
        sketch.translate(gOpts.sqDim * col, gOpts.sqDim * row);
        drawAlien(aliens[row * gOpts.numCols + col]);
        sketch.pop();
        //}
      }
    }
    sketch.pop();
    sketch.noFill();
    sketch.stroke("white");
    sketch.strokeWeight(2);
    sketch.rectMode(sketch.CORNER);
    if (selected) {
      sketch.rect(
        selected.x * gOpts.sqDim,
        selected.y * gOpts.sqDim,
        gOpts.sqDim,
        gOpts.sqDim
      );
    }
  };
};

var myp5 = new p5(p);
