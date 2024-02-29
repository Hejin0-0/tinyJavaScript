document.addEventListener("DOMContentLoaded", () => {
	const gridDisplay = document.querySelector(".grid");
	const scoreDisplay = document.querySelector("score");
	const resultDisplay = document.querySelector("result");
	let squares = [];
	const width = 4;
	let score = 0;

	// Create the playing board
	function createBoard() {
		for (let i = 0; i < width * width; i++) {
			square = document.createElement("div");
			square.innerHTML = 0;
			gridDisplay.appendChild(square);
			squares.push(square);
		}
		generate();
		generate();
	}
	createBoard();

	function generate() {
		randomNumber = Math.floor(Math.random() * squares.length);
		if (squares[randomNumber].innerHTML == 0) {
			squares[randomNumber].innerHTML = 2;
			checkForGameOver();
		} else {
			generate();
		}
	}

	function moveRight() {
		for (let i = 0; i < 16; i++) {
			if (i % 4 === 0) {
				let totalOne = squares[i].innerHTML;
				let totalTwo = squares[i + 1].innerHTML;
				let totalThree = squares[i + 2].innerHTML;
				let totalFour = squares[i + 3].innerHTML;
				let row = [
					parseInt(totalOne),
					parseInt(totalTwo),
					parseInt(totalThree),
					parseInt(totalFour),
				];

				let filteredRow = row.filter((num) => num);
				let missing = 4 - filteredRow.length;
				let zeros = Array(missing).fill(0);
				let newRow = zeros.concat(filteredRow);

				squares[i].innerHTML = newRow[0];
				squares[i + 1].innerHTML = newRow[1];
				squares[i + 2].innerHTML = newRow[2];
				squares[i + 3].innerHTML = newRow[3];
			}
		}
	}

	function moveLeft() {
		for (let i = 0; i < 16; i++) {
			if (i % 4 === 0) {
				let totalOne = squares[i].innerHTML;
				let totalTwo = squares[i + 1].innerHTML;
				let totalThree = squares[i + 2].innerHTML;
				let totalFour = squares[i + 3].innerHTML;
				let row = [
					parseInt(totalOne),
					parseInt(totalTwo),
					parseInt(totalThree),
					parseInt(totalFour),
				];

				let filteredRow = row.filter((num) => num);
				let missing = 4 - filteredRow.length;
				let zeros = Array(missing).fill(0);
				let newRow = filteredRow.concat(zeros);

				squares[i].innerHTML = newRow[0];
				squares[i + 1].innerHTML = newRow[1];
				squares[i + 2].innerHTML = newRow[2];
				squares[i + 3].innerHTML = newRow[3];
			}
		}
	}

	function moveUp() {
		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j = 0; j < width; j++) {
				column.push(squares[i + j * width]);
			}

			let filteredColumn = column.filter((num) => num.innerHTML !== "0");
			let missing = width - filteredColumn.length;
			let zeros = Array(missing)
				.fill(0)
				.map(() => {
					let zero = document.createElement("div");
					zero.innerHTML = "0";
					return zero;
				});
			let newColumn = filteredColumn.concat(zeros);

			for (let j = 0; j < width; j++) {
				squares[i + j * width].innerHTML = newColumn[j].innerHTML;
			}
		}
	}

	function moveDown() {
		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j = 0; j < width; j++) {
				column.push(squares[i + j * width]);
			}

			let filteredColumn = column.filter((num) => num.innerHTML !== "0");
			let missing = width - filteredColumn.length;
			let zeros = Array(missing)
				.fill(0)
				.map(() => {
					let zero = document.createElement("div");
					zero.innerHTML = "0";
					return zero;
				});
			let newColumn = zeros.concat(filteredColumn);

			for (let j = 0; j < width; j++) {
				squares[i + j * width].innerHTML = newColumn[j].innerHTML;
			}
		}
	}

	// function moveUp() {
	// 	for (let i = 0; i < 4; i++) {
	// 		let totalOne = squares[i].innerHTML;
	// 		let totalTwo = squares[i + width].innerHTML;
	// 		let totalThree = squares[i + width * 2].innerHTML;
	// 		let totalFour = squares[i + width * 3].innerHTML;
	// 		let column = [
	// 			parseInt(totalOne),
	// 			parseInt(totalTwo),
	// 			parseInt(totalThree),
	// 			parseInt(totalFour),
	// 		];

	// 		let filteredColumn = column.filter((num) => num);
	// 		let missing = 4 - filteredColumn.length;
	// 		let zeros = Array(missing).fill(0);
	// 		let newColumn = filteredColumn.concat(zeros);

	// 		squares[i].innerHTML = newColumn[0];
	// 		squares[i + width].innerHTML = newColumn[1];
	// 		squares[i + width * 2].innerHTML = newColumn[2];
	// 		squares[i + width * 3].innerHTML = newColumn[3];
	// 	}
	// }

	// function moveDown() {
	// 	for (let i = 0; i < 4; i++) {
	// 		let totalOne = squares[i].innerHTML;
	// 		let totalTwo = squares[i + width].innerHTML;
	// 		let totalThree = squares[i + width * 2].innerHTML;
	// 		let totalFour = squares[i + width * 3].innerHTML;
	// 		let column = [
	// 			parseInt(totalOne),
	// 			parseInt(totalTwo),
	// 			parseInt(totalThree),
	// 			parseInt(totalFour),
	// 		];

	// 		let filteredColumn = column.filter((num) => num);
	// 		let missing = 4 - filteredColumn.length;
	// 		let zeros = Array(missing).fill(0);
	// 		let newColumn = zeros.concat(filteredColumn);

	// 		squares[i].innerHTML = newColumn[0];
	// 		squares[i + width].innerHTML = newColumn[1];
	// 		squares[i + width * 2].innerHTML = newColumn[2];
	// 		squares[i + width * 3].innerHTML = newColumn[3];
	// 	}
	// }

	function combineRow() {
		for (let i = 0; i < 15; i++) {
			if (squares[i].innerHTML === squares[i + 1].innerHTML) {
				let combinedTotal =
					parseInt(squares[i].innerHTML) +
					parseInt(squares[i + 1].innerHTML);
				squares[i].innerHTML = combinedTotal;
				squares[i + 1].innerHTML = 0;
				score += combinedTotal;
				scoreDisplay.innerHTML = score;
			}
		}
		checkForWin();
	}

	function combineColumn() {
		for (let i = 0; i < 12; i++) {
			if (squares[i].innerHTML === squares[i + width].innerHTML) {
				let combinedTotal =
					parseInt(squares[i].innerHTML) +
					parseInt(squares[i + width].innerHTML);
				squares[i].innerHTML = combinedTotal;
				squares[i + width].innerHTML = 0;
				score += combinedTotal;
				scoreDisplay.innerHTML = score;
			}
		}
		checkForWin();
	}

	function control(e) {
		if (e.keyCode === 37) {
			keyLeft();
		} else if (e.keyCode === 38) {
			keyUp();
		} else if (e.keyCode === 39) {
			keyRight();
		} else if (e.keyCode === 40) {
			keyDown();
		}
	}
	document.addEventListener("keyup", control);

	function keyRight() {
		moveRight();
		combineRow();
		moveRight();
		generate();
	}

	function keyLeft() {
		moveLeft();
		combineRow();
		moveLeft();
		generate();
	}

	function keyUp() {
		moveUp();
		combineColumn();
		moveUp();
		generate();
	}

	function keyDown() {
		moveDown();
		combineColumn();
		moveDown();
		generate();
	}

	function checkForWin() {
		for (let i = 0; i < squares.length; i++) {
			if (squares[i].innerHTML == 2048) {
				resultDisplay.innerHTML = "You WIN";
				document.removeEventListener("keyup", control);
				setInterval(() => clear(), 3000);
			}
		}
	}

	function checkForGameOver() {
		let zeros = 0;
		for (let i = 0; i < squares.length; i++) {
			squares[i].style.color = "white";
			if (squares[i].innerHTML == 0) {
				zeros++;
				squares[i].style.color = "#AFA192";
			}

			if (squares[i].innerHTML == 2 || squares[i].innerHTML == 4) {
				squares[i].style.color = "#AFA192";
			}
		}

		if (zeros === 0) {
			resultDisplay.innerHTML = "You LOSE";
			document.removeEventListener("keyup", control);
			setTimeout(() => clear(), 3000);
		}
	}

	function clear() {
		clearInterval(myTimer);
	}

	function addColors() {
		for (let i = 0; i < squares.length; i++) {
			if (squares[i].innerHTML == 0)
				squares[i].style.backgroundColor = "#AFA192";
			else if (squares[i].innerHTML == 2)
				squares[i].style.backgroundColor = "#EFE5DB";
			else if (squares[i].innerHTML == 4)
				squares[i].style.backgroundColor = "#EFE2CF";
			else if (squares[i].innerHTML == 8)
				squares[i].style.backgroundColor = "#F5996A";
			else if (squares[i].innerHTML == 16)
				squares[i].style.backgroundColor = "#F89868";
			else if (squares[i].innerHTML == 32)
				squares[i].style.backgroundColor = "#F77F5C";
			else if (squares[i].innerHTML == 64)
				squares[i].style.backgroundColor = "#F65E3B";
			else if (squares[i].innerHTML == 128)
				squares[i].style.backgroundColor = "#EDCF72";
			else if (squares[i].innerHTML == 256)
				squares[i].style.backgroundColor = "#EDCB5C";
			else if (squares[i].innerHTML == 512)
				squares[i].style.backgroundColor = "#EDD277";
			else if (squares[i].innerHTML == 1024)
				squares[i].style.backgroundColor = "#EFCF6C";
			else if (squares[i].innerHTML == 2048)
				squares[i].style.backgroundColor = "#EACF5B";
		}
	}
	addColors();

	let myTimer = setInterval(addColors, 50);
});
