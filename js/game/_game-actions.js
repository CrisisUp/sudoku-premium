// js/game/_game-actions.js

import { getBoard, getSolution, getIsGameOver, setIsGameOver, getHints, decrementHints, setBoard } from './_game-state.js';
import { messageDisplay } from '../utils/_dom-elements.js';
import { renderGrid } from '../ui/_render-grid.js'; // Importar renderGrid para atualizar o tabuleiro
import { endGame, updateHintsDisplay, checkGameCompletion } from '../ui/_message-display.js';

export function checkSolution() {
    let isCorrect = true;
    let emptyCells = false;
    const currentBoard = getBoard();
    const currentSolution = getSolution();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentBoard[i][j] === 0) {
                emptyCells = true;
            } else if (currentBoard[i][j] !== currentSolution[i][j]) {
                isCorrect = false;
                // Marcar erros visualmente
                const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                if (cell) {
                    cell.classList.add('error');
                }
            }
        }
    }

    if (emptyCells) {
        messageDisplay.textContent = 'Complete todas as células primeiro!';
        messageDisplay.className = 'message error';
    } else if (isCorrect) {
        messageDisplay.textContent = 'Parabéns! Solução correta!';
        messageDisplay.className = 'message success';
        endGame();
    } else {
        messageDisplay.textContent = 'Existem erros na sua solução.';
        messageDisplay.className = 'message error';
    }
}

export function solvePuzzle() {
    if (getIsGameOver()) return;

    // Copia a solução para o tabuleiro do jogo
    const currentSolution = getSolution();
    const solvedBoard = JSON.parse(JSON.stringify(currentSolution)); // Copia profunda
    setBoard(solvedBoard); // Atualiza o estado global

    // Atualiza a exibição
    renderGrid();

    messageDisplay.textContent = 'Sudoku resolvido!';
    messageDisplay.className = 'message success';
    endGame();
}

export function useHint() {
    const currentSelectedCell = getSelectedCell(); // Obter a célula selecionada
    const currentHints = getHints();

    if (currentHints <= 0) {
        messageDisplay.textContent = 'Você não tem mais dicas disponíveis!';
        messageDisplay.className = 'message error';
        return;
    }

    if (getIsGameOver() || !currentSelectedCell) {
        messageDisplay.textContent = 'Selecione uma célula vazia para usar uma dica.';
        messageDisplay.className = 'message error';
        return;
    }

    const row = parseInt(currentSelectedCell.dataset.row);
    const col = parseInt(currentSelectedCell.dataset.col);

    const givenCells = getGivenCells();
    const currentBoard = getBoard();
    const solution = getSolution();

    if (!givenCells[row][col] && currentBoard[row][col] === 0) {
        currentBoard[row][col] = solution[row][col]; // Preenche a célula
        setBoard(currentBoard); // Atualiza o estado global

        currentSelectedCell.textContent = solution[row][col];
        currentSelectedCell.classList.add('user-input');
        currentSelectedCell.classList.remove('error');

        decrementHints(); // Diminui o número de dicas
        updateHintsDisplay(); // Atualiza a exibição das dicas

        messageDisplay.textContent = 'Dica aplicada!';
        messageDisplay.className = 'message';

        checkGameCompletion(); // Verifica se o jogo foi completado com a dica
    } else {
        messageDisplay.textContent = 'Selecione uma célula vazia para usar uma dica.';
        messageDisplay.className = 'message error';
    }
}