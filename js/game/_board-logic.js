// js/game/_board-logic.js

import { getBoard, setBoard, setSolution, setGivenCells } from './_game-state.js';
import { difficultySelect } from '../utils/_dom-elements.js';
import { shuffleArray, findEmptyCell, isValid } from '../utils/_helpers.js';

export function generatePuzzle() {
    // Primeiro, gere uma solução completa
    const currentSolution = Array(9).fill().map(() => Array(9).fill(0));
    generateSolution(currentSolution);
    setSolution(currentSolution); // Salva a solução gerada

    // Em seguida, crie um quebra-cabeça removendo números com base na dificuldade
    const difficulty = difficultySelect.value;
    let cellsToRemove;

    switch (difficulty) {
        case 'easy':
            cellsToRemove = 40; // ~41 células restantes
            break;
        case 'medium':
            cellsToRemove = 50; // ~31 células restantes
            break;
        case 'hard':
            cellsToRemove = 60; // ~21 células restantes
            break;
        default:
            cellsToRemove = 45;
    }

    // Copia a solução para o tabuleiro do jogo e remove os números
    const newBoard = JSON.parse(JSON.stringify(currentSolution)); // Cria uma cópia profunda da solução
    let cellsRemoved = 0;
    while (cellsRemoved < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0;
            cellsRemoved++;
        }
    }
    setBoard(newBoard); // Atualiza o estado global do tabuleiro

    // Marca as células iniciais (dadas)
    const newGivenCells = Array(9).fill().map(() => Array(9).fill(false));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            newGivenCells[i][j] = getBoard()[i][j] !== 0; // Usa o tabuleiro atualizado
        }
    }
    setGivenCells(newGivenCells); // Atualiza o estado global das células dadas
}

function generateSolution(grid) {
    // Preenche as caixas 3x3 diagonais primeiro (são independentes)
    fillDiagonalBoxes(grid);
    // Em seguida, resolve o resto da grade usando backtracking
    solveSudoku(grid);
}

function fillDiagonalBoxes(grid) {
    for (let box = 0; box < 9; box += 3) {
        fillBox(grid, box, box);
    }
}

function fillBox(grid, row, col) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);

    let index = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            grid[row + i][col + j] = nums[index++];
        }
    }
}

export function solveSudoku(grid) { // Exportada para ser usada por _game-actions para resolver o puzzle
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true; // Quebra-cabeça resolvido

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) {
                return true;
            }

            grid[row][col] = 0; // Backtrack
        }
    }
    return false; // Aciona o backtracking
}