class Piece {

	constructor(type, playfield, x, y) {
		// cells of this piece
		this.type = type;
		this.cells = types[type];
		this.size = this.cells.length; // assumed square matrix
		// drawing sizes
		this.cellSize = playfield.cellSize;
		this.offset = playfield.borderSize;

		this.r = random(255); // r is a random number between 0 - 255
		this.g = random(100, 200); // g is a random number betwen 100 - 200
		this.b = random(100); // b is a random number between 0 - 100
		this.a = random(200, 255); // a is a random number between 200 - 255

		// position of top-left piece relative to playfield
		if(x && y) {
			this.x = x;
			this.y = y;
		} else {
			this.x = x === undefined ? floor((playfield.cols - this.size) / 2) : x;
			this.y = y || 0;
		}


		// console.log('this parameter to change for random', this.x, this.y)


		// gravity
		this.dropInterval = 1000 // in ms
		this.dropBuffer = 0; // time since last drop

		// whether this is a ghost piece
		this.isghost = false;
	}


	update(time) {
		this.dropBuffer += time;
	}

	timeToFall() {
		return this.dropBuffer > this.dropInterval
	}

	resetBuffer() {
		this.dropBuffer = 0;
	}

	copy(piece) {
		this.x = piece.x;
		this.y = piece.y;
		this.cells = piece.cells
	}

	show() {

		// for each non-null cell in this piece, fill in
		// the specified color and draw the rectangle
		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {

				if (this.cells[row][col]) {
					let x = this.x + col;
					let y = this.y + row;
					let cs = this.cellSize;
					let off = this.offset;

					if (imageMode) {
						image(img, off + cs * x, off + cs * y);
					} else {
						fill(this.r, this.g, this.b, this.a);
						rect(off + cs * x, off + cs * y, cs-1, cs-1);
					}
					// fill(this.isghost ? '#bbb' : this.cells[row][col])

					// rect(off + cs * x, off + cs * y, cs-1, cs-1);
					// square(off + cs * x, off + cs * y, cs - 1, cs - 1);
				}

			}
		}

	}

	deleteFloatingPiece() {
		let cs = this.cellSize
		let off = this.offset;

		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				if (this.cells[row][col]) {
					let x = this.x + col;
					let y = this.y + row;

					let XX =  off + cs * x;
					let YY = off + cs * y;

					if (
						mouseX > XX  &&
						mouseX < XX + cs &&
						mouseY > YY  &&
						mouseY < YY + cs
					) { 
						this.cells[row][col] = ''
					}
				}

			}
		}


	}


	moveDown() {
		this.y++;
	}
	moveRight() {
		this.x++;
	}
	moveLeft() {
		this.x--;
	}
	moveUp() {
		this.y--;
	}



	//================================
	// Rotate functions
	//================================

	// rotate clockwise
	rotateCW() {
		let newCells = [];

		for (let col = 0; col < this.size; col++) {

			let newRow = [];
			for (let row = this.size - 1; row >= 0; row--) {
				newRow.push(this.cells[row][col]);
			}
			newCells.push(newRow);

		}
		this.cells = newCells;
	}

	// rotate counter-clockwise
	rotateCCW() {
		let newCells = [];
		for (let col = this.size - 1; col >= 0; col--) {

			let newRow = [];
			for (let row = 0; row < this.size; row++) {
				newRow.push(this.cells[row][col]);
			}
			newCells.push(newRow);

		}
		this.cells = newCells;
	}

	//================================
	// End of rotate functions
	//================================


}

let color = '#333'
let types = {

	O: [
		[color, color],
		[color, color]
	],


	J: [
		[color, null, null],
		[color, color, color],
		[null, null, null]
	],


	L: [
		[null, null, color],
		[color, color, color],
		[null, null, null]
	],


	S: [
		[null, color, color],
		[color, color, null],
		[null, null, null]
	],


	Z: [
		[color, color, null],
		[null, color, color],
		[null, null, null]
	],


	T: [
		[null, color, null],
		[color, color, color],
		[null, null, null]
	],


	I: [
		[null, null, null, null],
		[color, color, color, color],
		[null, null, null, null],
		[null, null, null, null],
	]

}