function checkWinner(player: boolean | null, board: number[]): number | null {
    if(player === null) return null;
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const currentPlayer = player ? 1 : 2;
    const opponentPlayer = player ? 2 : 1;

    const isWinning = (player: number): boolean => {
        return winConditions.some(condition =>
            condition.every(index => board[index] === player)
        );
    };

    if (isWinning(currentPlayer)) {
        return 1;
    } else if (isWinning(opponentPlayer)) {
        return 2;
    } else if (board.every(cell => cell !== 0)) {
        return 3;
    } else {
        return null;
    }
}

export default checkWinner