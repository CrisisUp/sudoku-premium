// js/ui/_message-display.js

import { getBoard, getSolution, getIsGameOver, setIsGameOver, getHints, setSelectedCell, getSelectedCell } from '../game/_game-state.js';
import { messageDisplay, hintElements } from '../utils/_dom-elements.js';
import { resetTimer } from '../game/_timer.js';
import { highlightRelatedCells } from './_render-grid.js';

export function updateHintsDisplay() {
    const currentHints = getHints();
    hintElements.forEach((hint, index) => {
        if (index < currentHints) {
            hint.classList.add('active');
        } else {
            hint.classList.remove('active');
        }
    });
}

export function checkGameCompletion() {
    const currentBoard = getBoard();
    const currentSolution = getSolution();

    // Primeiro, verifica se todas as células estão preenchidas
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentBoard[i][j] === 0) return false; // Ainda há células vazias
        }
    }

    // Em seguida, verifica se a solução está correta
    let isCorrect = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentBoard[i][j] !== currentSolution[i][j]) {
                isCorrect = false;
                break;
            }
        }
        if (!isCorrect) break;
    }

    if (isCorrect) {
        messageDisplay.textContent = 'Parabéns! Você resolveu o Sudoku!';
        messageDisplay.className = 'message success';
        endGame();
    }
    return isCorrect;
}

export function endGame() {
    setIsGameOver(true);
    resetTimer(); // Chama a função do timer para resetar e parar

    const currentSelectedCell = getSelectedCell();
    if (currentSelectedCell) {
        currentSelectedCell.classList.remove('selected');
        highlightRelatedCells(currentSelectedCell, false);
        setSelectedCell(null); // Desseleciona a célula no estado
    }
}