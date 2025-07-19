// js/utils/_helpers.js

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function findEmptyCell(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

export function isValid(grid, row, col, num) {
    // Check row
    for (let j = 0; j < 9; j++) {
        if (grid[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}