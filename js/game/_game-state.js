// js/game/_game-state.js

let boardState = Array(9).fill().map(() => Array(9).fill(0));
let solutionState = Array(9).fill().map(() => Array(9).fill(0));
let givenCellsState = Array(9).fill().map(() => Array(9).fill(false));
let selectedCellState = null;
let isGameOverState = false;
let hintsState = 3;

// Getters
export function getBoard() { return boardState; }
export function getSolution() { return solutionState; }
export function getGivenCells() { return givenCellsState; }
export function getSelectedCell() { return selectedCellState; }
export function getIsGameOver() { return isGameOverState; }
export function getHints() { return hintsState; }

// Setters (para funções que precisam modificar o estado)
export function setBoard(newBoard) { boardState = newBoard; }
export function setSolution(newSolution) { solutionState = newSolution; }
export function setGivenCells(newGivenCells) { givenCellsState = newGivenCells; }
export function setSelectedCell(cell) { selectedCellState = cell; }
export function setIsGameOver(status) { isGameOverState = status; }
export function decrementHints() { hintsState--; }
export function resetHints() { hintsState = 3; } // Adiciona função para resetar dicas

// Função para resetar todo o estado do jogo
export function resetGameState() {
    boardState = Array(9).fill().map(() => Array(9).fill(0));
    solutionState = Array(9).fill().map(() => Array(9).fill(0));
    givenCellsState = Array(9).fill().map(() => Array(9).fill(false));
    selectedCellState = null;
    isGameOverState = false;
    hintsState = 3;
}