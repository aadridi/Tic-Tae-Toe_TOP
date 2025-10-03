console.log('Welcome to a game of Tic-Tac-Toe!');

function Gamegrid() {
	const rows = 3;
	const columns = 3;
	const grid = [];

	// Creating a 2d array of size 3 * 3 holding the state of the game
	for (let i = 0; i < rows; i++) {
		grid[i] = [];
		for (let j = 0; j < columns; j++) {
			grid[i].push(Cell());
		}
	}

	// Method to get the entire grid at any time
	const getGrid = () => grid;

	// Method to mark any cell of the grid
	const markCell = (row, column, player) => {
		// Reusing ConnectFour method to get empty cells
		const availableCells = grid.filter((row) => row[column].getValue() === 0).map((row) => row[column]);

		// Checking if there is no empty cell
		if (!availableCells.length) return;
		grid[row][column].addMark(player);
	};

	// Print the current state of the grid in the console
	const printGrid = () => {
		const gridWithValues = grid.map((row) => row.map((cell) => cell.getValue()));
		console.log(gridWithValues);
	};

	return { getGrid, markCell, printGrid };
}

function Cell() {
	let value = 0;

	// Accept a player's mark to change the value of the cell
	const addMark = (player) => {
		value = player;
	};

	// Retrieve the value of any cell of the grid
	const getValue = () => value;

	return {
		addMark,
		getValue,
	};
}

function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') {
	const grid = Gamegrid();

	const players = [
		{
			name: playerOneName,
			token: 'X',
		},
		{
			name: playerTwoName,
			token: 'O',
		},
	];

	let activePlayer = players[0];

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};
	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		grid.printGrid();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const playRound = (row, column) => {
		// Marking a cell for the current player
		console.log(`${getActivePlayer().name} is marking cell located at row:${row} column:${column}...`);
		grid.markCell(row, column, getActivePlayer().token);

		/*  This is where we would check for a winner and handle that logic,
        such as a win message. */

		// Switch player turn
		switchPlayerTurn();
		printNewRound();
	};

	// Initial play game message
	printNewRound();

	// For the console version, we will only use playRound, but we will need
	// getActivePlayer for the UI version, so I'm revealing it now
	return {
		playRound,
		getActivePlayer,
	};
}

const game = GameController();
