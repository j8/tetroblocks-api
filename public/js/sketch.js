let playfield, fallingPiece, ghostPiece, paused;
let ghostMode = false;
let width = 10;
let height = 10;
let cellSize = 100;
let bg = ['#1D3558'];
let fg = ['#fff'];
const img1 = '/img/transparent.svg'
const T = '/img/T.svg'
const img2 = '/img/gr.svg'
const imageMode = true;

let numHashes = tokenData.hashes.length;
let hashPairs = [];
for (let i = 0; i < numHashes; i++) {
     for (let j = 0; j < 32; j++) {
          hashPairs.push(tokenData.hashes[i].slice(2 + (j * 2), 4 + (j * 2)));
     }
}
let decPairs = hashPairs.map(x => {
     return parseInt(x, 16);
});

let seed = parseInt(tokenData.hashes[0].slice(0, 16), 16);
let backgroundIndex = 0;
let startColor = decPairs[29];
let reverse = decPairs[30] < 128;
let slinky = decPairs[31] < 35;
let pipe = decPairs[22] < 32;
let bold = decPairs[23] < 15;
let segmented = decPairs[24] < 30;

console.log('seed', seed, decPairs, decPairs[29])


function setup() {
	playfield = new Playfield(width, height, cellSize,bg,fg);
	let totalWidth = cellSize * width + playfield.borderSize * 2;
	let totalHeight = cellSize * height + playfield.borderSize * 2;
	createCanvas(totalWidth, totalHeight)
	// createCanvas(totalWidth, totalHeight, SVG);
	let cnv = createCanvas(totalWidth, totalHeight)
	// Assigns a CSS selector ID to
	// the canvas element.
	cnv.id('tetroblock');
	initPeace();
}


let prev = 0;
function draw() {
	clear();

	//============================
	// Get time passed since last frame
	//============================

	let curr = millis();
	let delta = curr - prev;
	prev = curr;

	//============================
	// Update
	//============================

	if (!paused)
		fallingPiece.update(delta);

	// move down piece and spawn a new one
	// if necessary
	if (fallingPiece.timeToFall()) {
		fallingPiece.resetBuffer();
		fallingPiece.moveDown();

		if (!playfield.isValid(fallingPiece)) {
			fallingPiece.moveUp();
			spawnNewPiece();
		}
	}

	// copy falligPiece's location and
	// orientation, then hardDrop() it
	// if ghostMode is on

	ghostPiece.copy(fallingPiece)
	hardDrop(ghostPiece, playfield);


	playfield.clearLines();

	//============================
	// Draw
	//============================

	playfield.show();
	if (ghostMode) ghostPiece.show();
	fallingPiece.show();

}

function initPeace() {
	if (fallingPiece) {
		playfield.addToGrid(fallingPiece);
	}

	paused = true
	const pieces = ['O', 'J', 'L', 'S', 'Z', 'T', 'I']
	const choice = random(pieces);
	fallingPiece = new Piece(choice, playfield, Math.round(random(1, 5)), Math.round(random(1, 7)));

	ghostPiece = new Piece(choice, playfield);
	ghostPiece.isghost = true;
	ghostPiece.cells = fallingPiece.cells;

	redraw();

}


function spawnNewPiece(el) {
	if (fallingPiece) {
		playfield.addToGrid(fallingPiece);
	}

	const pieces = ['O', 'J', 'L', 'S', 'Z', 'T', 'I']
	let choice;
	console.log(el)

	switch (el) {
		case 0:
			choice = pieces[0];
			break;
		case 1:
			choice = pieces[1];
			break;
		case 2:
			choice = pieces[2];
			break;
		case 3:
			choice = pieces[3];
			break;
		case 4:
			choice = pieces[4];
			break;
		case 5:
			choice = pieces[5];
			break;
		case 6:
			choice = pieces[6];
			break;
		default:
			choice = random(pieces);
			break;
	}

	fallingPiece = new Piece(choice, playfield);
	ghostPiece = new Piece(choice, playfield);
	ghostPiece.isghost = true;
	ghostPiece.cells = fallingPiece.cells;
	redraw();
}


function preload() {
	if (imageMode) {
		img = loadImage(img1);
		bgImg = loadImage(img2);
	}
}

function hardDrop(piece, playfield) {

	// move down as long as current position is valid
	while (playfield.isValid(piece)) {
		piece.moveDown();
	}

	// in the last iteration the position isn't valid,
	// so move up
	piece.moveUp();

}

function toggleGhost() {
	ghostMode = !ghostMode;
}

function mousePressed() {
  playfield.deleteBlock()
	// if (fallingPiece) {
	// 	fallingPiece.deleteFloatingPiece()
	// }
  return false;
}

function keyPressed() {
	// for alphabet keys
	switch (key.toLowerCase()) {

		case '+':
			// console.log('here')
			// width = 10 + 1;
			// height = 10 + 1;
			// cellSize = 100 - 1;
			// playfield = new Playfield(width, height, cellSize, bg, fg);
			// let totalWidth = cellSize * width + playfield.borderSize * 2;
			// let totalHeight = cellSize * height + playfield.borderSize * 2;
			// resizeCanvas(totalWidth, totalHeight);
			// redraw();

			// initPeace();

			img.resize(cellSize+100, 0);
			redraw()
			break;

		case ' ':
			paused = false;
			hardDrop(fallingPiece, playfield);
			spawnNewPiece();
			break;
		case 'r':
			spawnNewPiece();
			playfield.resetGrid();
			break;
		case '1':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(0);
			break;
		case '2':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(1);
			break;
		case '3':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(2);
			break;
		case '4':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(3);
			break;
		case '5':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(4);
			break;
		case '6':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(5);
			break;
		case '7':
			hardDrop(fallingPiece, playfield);
			spawnNewPiece(6);
			break;
		case 'p':
			paused = !paused;
			break;

		// Rotation
		// --------

		case 'z':
			fallingPiece.rotateCCW();
			// if not valid, rotate back
			if (!playfield.isValid(fallingPiece))
				fallingPiece.rotateCW();
			break;

		case 'x':
			fallingPiece.rotateCW();
			// if not valid, rotate back
			if (!playfield.isValid(fallingPiece))
				fallingPiece.rotateCCW();
			break;

		// Testing
		// -------

		case 'w':
			fallingPiece.y--;
			break;

		case 'n':
			spawnNewPiece();
			break;

	}

	// non-ASCII keys
	switch (keyCode) {
		// movement controls in html file
		// to handle repeated movement

		case UP_ARROW:
			fallingPiece.rotateCW();

			// if not valid, rotate back
			if (!playfield.isValid(fallingPiece))
				fallingPiece.rotateCCW();

			break;

	}



}
