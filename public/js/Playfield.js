class Playfield {

	constructor(w, h, cellSize, bg, fg) {
		// colors
		this.foreground = bg;
		this.background = fg;
		// dimensions and grid
		this.cols = w;
		this.rows = h;
		this.grid = [];
		this.resetGrid();

		// drawing sizes
		this.cellSize = cellSize;
		this.borderSize = 0;
		// whether or not gridlines are seen
		this.gridlines = true;

		this.getRandomColor = function() {
			const r = random(255); // r is a random number between 0 - 255
			const g = random(100, 200); // g is a random number betwen 100 - 200
			const b = random(100); // b is a random number between 0 - 100
			const a = random(200, 255); // a is a random number between 200 - 255
			return {r: r, b: b, g: g, a:a}
		}
	}

	addToGrid(piece) {

		for (let row = 0; row < piece.size; row++) {
			for (let col = 0; col < piece.size; col++) {

				if (piece.cells[row][col] != null) {
					let gridRow = piece.y + row;
					let gridCol = piece.x + col;

					this.grid[gridRow][gridCol] =
						piece.cells[row][col];
				}

			}
		}

	}

	clearLines() {

		for (let row = this.rows - 1; row >= 0; row--) {

			// if this row is full
			if (!this.grid[row].includes(this.foreground)) {
				// remove the row
				this.grid.splice(row, 1)
				// and add an empty row to the top
				this.grid.unshift(new Array(this.cols).fill(this.foreground));
			}

		}

	}

	isValid(piece) {

		for (let row = 0; row < piece.size; row++) {
			for (let col = 0; col < piece.size; col++) {

				if (piece.cells[row][col] != null) {

					let gridRow = piece.y + row;
					let gridCol = piece.x + col;

					if (gridRow < 0 || gridRow >= this.rows ||
						gridCol < 0 || gridCol >= this.cols ||
						this.grid[gridRow][gridCol] != this.foreground)
						return false;
				}

			}
		}

		return true;

	}


	resetGrid() {
		for (let i = 0; i < this.rows; i++) {
			this.grid[i] = new Array(this.cols).fill(this.foreground);
		}
	}

	show() {
		//===========================
		// Draw the rectangle behind all the cells
		// for the border and gridlines
		//===========================

		let bs = this.borderSize
		let cs = this.cellSize
		let { r, g, b, a } = this.getRandomColor()

		if (this.gridlines) fill(this.background);
		else fill(this.foreground);

		// stroke(this.background)
		// strokeWeight(bs);

		// offset the rectangle so that
		// top and right borders stay in canvas
		let offset = floor(bs / 2)
		// fill(this.foreground)

		// rect(offset, offset, cs * this.cols + bs - 1, cs * this.rows + bs - 1)
		// here makes one big for the border
		if (imageMode) {
			image(bgImg, offset, offset, this.cols * this.cellSize, this.rows * this.cellSize);
		} else {
			fill(r, g, b, a)
			rect(offset, offset, cs * this.cols + bs - 1, cs * this.rows + bs - 1)
		}
		//===========================
		// End of big rectangle 
		//===========================

		//===========================
		// Draw cells over the big rectangle
		//===========================

		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[row].length; col++) {

				// offset the cells by the size of the border
				let off = this.borderSize;

				if (this.grid[row][col] == this.foreground) {
					fill(this.grid[row][col]);
				} else {
					if (imageMode) {
						image(img, cs * col + off, cs * row + off);
					} else {
						fill(r,g,b,a,a)
						rect(cs * col + offset, cs * row + offset, cs - 1, cs - 1);
					}
				}
				noFill()
			}
		}

		//===========================
		// End of cells loop
		//===========================


	} // end of show()

	deleteBlock() {
		let bs = this.borderSize
		let cs = this.cellSize

		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[row].length; col++) {

				// offset the cells by the size of the border
				let off = bs;
				let XX = cs * col + off
				let YY = cs * row + off;

				if (
					mouseX > XX  &&
					mouseX < XX + cs &&
					mouseY > YY  &&
					mouseY < YY + cs
				) { 
					if(this.grid[row][col] === '#333') {
						this.grid[row][col] = this.foreground
					}

				}
			}
		}

	}


}