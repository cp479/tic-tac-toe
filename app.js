// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setSquare = (index, marker) => {
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setSquare, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameActive = true;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    };

    const checkTie = () => {
        const board = Gameboard.getBoard();
        return board.every(square => square !== "");
    };

    const playRound = (index) => {
        if (!gameActive || !Gameboard.setSquare(index, currentPlayer.marker)) return;

        if (checkWin()) {
            document.getElementById('result').textContent = `${currentPlayer.name} wins!`;
            gameActive = false;
            return;
        }

        if (checkTie()) {
            document.getElementById('result').textContent = "It's a tie!";
            gameActive = false;
            return;
        }

        switchPlayer();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameActive = true;
        document.getElementById('result').textContent = '';
        updateBoard();
    };

    return { playRound, getCurrentPlayer, resetGame };
})();

// DOM Manipulation
document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const restartBtn = document.getElementById('restartBtn');

    squares.forEach(square => {
        square.addEventListener('click', handleSquareClick);
    });

    restartBtn.addEventListener('click', handleRestart);

    function handleSquareClick(event) {
        const index = event.target.dataset.index;
        GameController.playRound(parseInt(index));
        updateBoard();
    }

    function handleRestart() {
        GameController.resetGame();
    }

    function updateBoard() {
        const board = Gameboard.getBoard();
        squares.forEach((square, index) => {
            square.textContent = board[index];
        });
    }

    updateBoard(); // Initial board rendering
});
