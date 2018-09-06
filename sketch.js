//note: noLoop()

let aliens;
const gOpts = {};

function recreatePalette(){
	gOpts.palette = Palette.create();
	gOpts.clearColor = color('black');

}

const Palette = {
	create: function(){
		colorMode(HSB, 360, 100, 100, 1);
		const hue = random(0,360);
		const hueWidth = 50;
		const b = 100;
		const a = 1;
		const sat = 60;
		const cMain = color(hue, sat, b, a);
		const cLeft = color(hue - hueWidth/2, sat, b, a);
		const cRight = color(hue + hueWidth/2, sat, b, a);
		const cOpp = color((hue + 180)%360, sat, b, a);
		return [cMain, cLeft, cRight, cOpp]; 
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	recreatePalette();
	recreateAliens();
	noLoop();
}


function recreateAliens(){
		aliens = [];
		
		gOpts.padding = 4;
		gOpts.pixelsInInvader = 5;
		gOpts.pixelWidth = 5;
		gOpts.sqDim = gOpts.pixelsInInvader * gOpts.pixelWidth + gOpts.padding * 2;
	
		gOpts.numRows = Math.floor(windowHeight / gOpts.sqDim);
		gOpts.numCols = Math.floor(windowWidth / gOpts.sqDim);
		
		for(let i = 0; i < gOpts.numRows * gOpts.numCols; i++){
			aliens.push(createAlien());
		}
	}

function createAlien() {
	const bits = [];
	for (let col = 0; col < Math.ceil(gOpts.pixelsInInvader / 2); col++){
		bits[col] = [];
		for(let row = 0; row < gOpts.pixelsInInvader; row++){
			bits[col][row] = random([0,1])
		}
	}
	return {bits: bits, c1: random(gOpts.palette), c0: gOpts.clearColor };
}

function mousePressed() {
	recreatePalette();
	recreateAliens();
	draw();
}

function drawAlien(alien){
	noStroke();
	const bits = alien.bits;
	
	function squareForBit(bit, col, row, c1, c0){
				const np = gOpts.pixelsInInvader;
				const pw = gOpts.pixelWidth;
				fill(bit ? c1 : c0);
				rect(col * pw, row * pw, pw, pw);
	}
	const c1 = alien.c1;
	const c0 = alien.c0;
		
	const np = gOpts.pixelsInInvader;
	const halfnp = Math.ceil(np/2);
	
	for(let row = 0; row < np; row++){
		for (let col = 0; col < halfnp; col++){
				let bit = bits[col][row];
				squareForBit(bit, col, row, c1, c0);
		}
		for(let col = halfnp; col < np; col++){
				let bit = bits[np - col - 1][row];
				squareForBit(bit, col, row, c1, c0);
		}
	}
}
function draw() {
	background(gOpts.clearColor);
	push();	
	translate(gOpts.padding, gOpts.padding);
	
	for(let row = 0; row < gOpts.numRows; row++){
		for(let col = 0; col < gOpts.numCols; col++){
			if (random() > 0.4){
				push();
				translate(gOpts.sqDim*col,gOpts.sqDim*row);
				drawAlien(aliens[row*gOpts.numCols + col]);
				pop();
			}
		}
	}
	pop();
}