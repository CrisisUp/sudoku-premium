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

// checkGameCompletion está sendo chamada em _game-play.js
// A lógica de final de jogo para checkSolution está em _game-actions.js, que a chama
export function checkGameCompletion() {
    const currentBoard = getBoard();
    const currentSolution = getSolution();

    // Primeiro, verifica se todas as células estão preenchidas
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentBoard[i][j] === 0) return false; // Ainda há células vazias
        }
    }

    // Em seguida, verifica se a solução está correta (esta parte será feita em _game-actions.js)
    // Se você quiser que o jogo termine automaticamente ao preencher,
    // então a lógica de "isCorrect" deveria estar aqui e chamar endGame()
    // No entanto, como o checkSolution() é manual, esta função apenas retorna true/false se completo
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
    // Se o jogo estiver completo e correto, a função checkSolution em _game-actions.js
    // chamará endGame(), então não precisa aqui.
    return isCorrect; // Retorna se o tabuleiro está completo E correto
}


export function endGame() {
    setIsGameOver(true);
    resetTimer(); // Para e zera o timer

    const currentSelectedCell = getSelectedCell();
    if (currentSelectedCell) {
        currentSelectedCell.classList.remove('selected');
        highlightRelatedCells(currentSelectedCell, false);
        setSelectedCell(null); // Desseleciona a célula no estado
    }
    // A mensagem de tempo final é tratada em _game-actions.js
}