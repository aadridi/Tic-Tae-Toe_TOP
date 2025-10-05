console.log('Welcome to a game of Tic-Tac-Toe!');

// ---------- GRID FACTORY ----------
function Gamegrid() {
	const rows = 3;
	const columns = 3;
	const grid = [];

	// Create 3×3 grid
	for (let i = 0; i < rows; i++) {
		grid[i] = [];
		for (let j = 0; j < columns; j++) {
			grid[i].push(Cell());
		}
	}

	// Get full grid
	const getGrid = () => grid;

	// Mark a specific cell
	const markCell = (row, column, player) => {
		const cell = grid[row][column];
		if (cell.getValue() !== 0) return false; // already taken
		cell.addMark(player);
		return true;
	};

	// Print the current grid to the console
	const printGrid = () => {
		const gridWithValues = grid.map((row) => row.map((cell) => cell.getValue() || '_'));
		console.log(gridWithValues);
	};

	return { getGrid, markCell, printGrid };
}

// ---------- CELL FACTORY ----------
function Cell() {
	let value = 0;

	const addMark = (player) => {
		value = player;
	};

	const getValue = () => value;

	return { addMark, getValue };
}

// ---------- GAME CONTROLLER ----------
function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') {
	const grid = Gamegrid();

	const players = [
		{ name: playerOneName, token: 'X' },
		{ name: playerTwoName, token: 'O' },
	];

	let activePlayer = players[0];
	let gameOver = false;

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	// 🧠 CHECK FOR WINNER FUNCTION
	const checkWinner = (gridArray) => {
		// Convert grid of Cell() objects into simple values
		const board = gridArray.map((row) => row.map((cell) => cell.getValue()));

		// Check rows
		for (let i = 0; i < 3; i++) {
			if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
				return board[i][0];
			}
		}

		// Check columns
		for (let j = 0; j < 3; j++) {
			if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
				return board[0][j];
			}
		}

		// Diagonal ↘
		if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
			return board[0][0];
		}

		// Diagonal ↙
		if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
			return board[0][2];
		}

		// Draw check
		const isDraw = board.flat().every((cell) => cell !== 0);
		if (isDraw) return 'draw';

		return null;
	};

	const printNewRound = () => {
		grid.printGrid();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const playRound = (row, column) => {
		if (gameOver) {
			console.log('Game over! Restart to play again.');
			return;
		}

		console.log(`${getActivePlayer().name} is marking cell row:${row}, column:${column}...`);
		const moveValid = grid.markCell(row, column, getActivePlayer().token);
		if (!moveValid) {
			console.log('Invalid move! Cell already occupied.');
			return;
		}

		const winner = checkWinner(grid.getGrid());

		if (winner) {
			grid.printGrid();
			if (winner === 'draw') {
				console.log("It's a draw!");
			} else {
				console.log(`🎉 ${getActivePlayer().name} wins with '${winner}'!`);
			}
			gameOver = true;
			return;
		}

		switchPlayerTurn();
		printNewRound();
	};

	// Initial game state
	printNewRound();

	return {
		playRound,
		getActivePlayer,
		getGrid: grid.getGrid,
	};
}

// ---------- SCREEN CONTROLLER ----------
function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector('.turn');
	const gridDiv = document.querySelector('.game-grid');

	const updateScreen = () => {
		gridDiv.textContent = '';

		const grid = game.getGrid();
		const activePlayer = game.getActivePlayer();

		playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

		grid.forEach((row, rowIndex) => {
			row.forEach((cell, columnIndex) => {
				const cellButton = document.createElement('button');
				cellButton.classList.add('grid-cell');
				cellButton.dataset.row = rowIndex;
				cellButton.dataset.column = columnIndex;
				cellButton.textContent = cell.getValue() === 0 ? '' : cell.getValue();
				gridDiv.appendChild(cellButton);
			});
		});
	};

	function clickHandlerBoard(e) {
		const selectedRow = e.target.dataset.row;
		const selectedColumn = e.target.dataset.column;
		if (selectedRow === undefined || selectedColumn === undefined) return;

		game.playRound(Number(selectedRow), Number(selectedColumn));
		updateScreen();
	}

	gridDiv.addEventListener('click', clickHandlerBoard);
	updateScreen();
}

ScreenController();
