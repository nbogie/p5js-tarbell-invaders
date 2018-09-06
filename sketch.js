// Reference: https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

//import p5 from "p5";

var p = function(sketch) {
  //note: noLoop()
  let seeded = {
    28180: "candle",
    21886: "invader",
    32743: "detonator",
    16682: "fountain",
    17530: "heart",
    19937: "crowface",
    10653: "birdman",
    10614: "baby",
    25149: "king",
    19391: "explosion",
    15650: "tee-pee",
    11184: "skulltop",
    32313: "treasure",
    5489: "invader",
    11734: "baby",
    19332: "man",
    24081: "angry",
    27246: "helipad",
    29262: "tombstone",
    25430: "ring",
    9935: "helm",
    26927: "T",
    16662: "question",
    17887: "hive",
    25582: "face",
    23702: "missile",
    32525: "jacket",
    24500: "rocket",
    27879: "punisher",
    21887: "invader",
    32765: "castle",
    12743: "glyph",
    32724: "house",
    16437: "golem",
    27645: "firesprite",
    17661: "shield",
    26318: "T",
    30661: "paw",
    31486: "tombstone",
    4822: "silhouette",
    24005: "cauldron",
    13689: "batman",
    26352: "coin",
    32743: "ironman",
    14647: "badger"
  };
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
    const numBits =
      gOpts.pixelsInInvader * Math.ceil(gOpts.pixelsInInvader / 2);

    for (let i = 0; i < gOpts.numRows * gOpts.numCols; i++) {
      const id =
        sketch.random() > 0.1
          ? sketch.floor(sketch.random(1, Math.pow(2, numBits))) // want 1-32767
          : sketch.random(Object.keys(seeded));
      aliens.push(createAlien(id));
    }
  }
  function bitFromIdAt(id, x, y) {
    const h = gOpts.pixelsInInvader;
    const w = Math.ceil(h / 2);
    const bitNumber = y * w + x;
    let mask = 1 << bitNumber;
    let masked = mask & id;
    //console.log(`id ${id} bitNumber: ${bitNumber} mask ${mask} masked ${masked}`);
    return masked !== 0 ? 1 : 0;
  }

  function createAlien(id) {
    // alternatively just store the id as a single 15-bit number, and create at draw-time
    const bits = []; //can we make this a 2d array of bits?
    for (let col = 0; col < Math.ceil(gOpts.pixelsInInvader / 2); col++) {
      bits[col] = [];
      for (let row = 0; row < gOpts.pixelsInInvader; row++) {
        bits[col][row] = bitFromIdAt(id, col, row);
      }
    }
    return {
      bits: bits,
      id: id,
      c1: sketch.random(gOpts.palette),
      c0: gOpts.clearColor
    };
  }

  sketch.mousePressed = function() {
    setSelectedFromClick();
    sketch.draw();
  };
  sketch.keyPressed = function() {
    if (sketch.key === "r") {
      recreatePalette();
      recreateAliens();
      sketch.draw();
    }
  };

  const Grid = {
    screenPosAsGridPos: function(screenPos) {
      return sketch.createVector(
        sketch.floor(screenPos.x / gOpts.sqDim),
        sketch.floor(screenPos.y / gOpts.sqDim)
      );
    },
    mousePosAsGridPos: function() {
      return Grid.screenPosAsGridPos(
        sketch.createVector(sketch.mouseX, sketch.mouseY)
      );
    },
    gridPosAsScreenPos: function(gridPos) {
      return sketch.createVector(
        gridPos.x * gOpts.sqDim,
        gridPos.y * gOpts.sqDim
      );
    }
  };

  function setSelectedFromClick() {
    selected = Grid.mousePosAsGridPos();
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
    if (selected) {
      sketch.noFill();
      sketch.stroke("white");
      sketch.strokeWeight(2);
      sketch.rectMode(sketch.CORNER);
      let selScreenPos = Grid.gridPosAsScreenPos(selected);
      sketch.rect(selScreenPos.x, selScreenPos.y, gOpts.sqDim, gOpts.sqDim);
      sketch.textSize(22);
      sketch.stroke("black");
      sketch.strokeWeight(6);
      sketch.fill("white");
      const selectedAlien = aliens[selected.y * gOpts.numCols + selected.x];
      if (selectedAlien) {
        let title = seeded[selectedAlien.id];

        const desc = ` id ${selectedAlien.id} (${title ? title : "?"}) at ${
          selected.x
        }, ${selected.y}`;
        sketch.text(
          desc,
          selScreenPos.x + gOpts.sqDim + 3,
          selScreenPos.y + gOpts.sqDim / 2
        );
      }
    }
  };
};

var myp5 = new p5(p);
