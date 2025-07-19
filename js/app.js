// js/app.js

// Importações de todos os módulos necessários
import { resetGameState, getSelectedCell, getIsGameOver } from './game/_game-state.js';
import { generatePuzzle } from './game/_board-logic.js';
import { handleCellClick, handleNumberInput, moveSelection } from './game/_game-play.js';
import { checkSolution, useHint, solvePuzzle } from './game/_game-actions.js';
import { startTimer, resetTimer } from './game/_timer.js';
import { renderGrid } from './ui/_render-grid.js';
import { updateHintsDisplay } from './ui/_message-display.js';
import { initializeTheme, toggleTheme } from './ui/_theme-toggle.js';
import {
    newGameBtn,
    checkBtn,
    hintBtn,
    solveBtn,
    numberBtns,
    themeToggle,
    messageDisplay,
    gridElement
} from './utils/_dom-elements.js';

// Função principal de inicialização do jogo
function initGame() {
    // Resetar o estado do jogo
    resetGameState();
    updateHintsDisplay();
    messageDisplay.textContent = 'Bom jogo!';
    messageDisplay.className = 'message';

    // Gerar um novo quebra-cabeça
    generatePuzzle();

    // Renderizar o grid
    renderGrid();

    // Iniciar o temporizador
    resetTimer();
    startTimer();
}

// Configura os event listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme(); // Inicializa o tema ao carregar a página
    initGame();        // Inicia um novo jogo

    // Event listeners para os botões principais
    newGameBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkSolution);
    hintBtn.addEventListener('click', useHint);
    solveBtn.addEventListener('click', solvePuzzle);
    themeToggle.addEventListener('click', toggleTheme);

    // Event listener para os botões numéricos
    numberBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const number = parseInt(this.getAttribute('data-number'));
            handleNumberInput(number);
        });
    });

    // Suporte para teclado
    document.addEventListener('keydown', function (e) {
        if (getIsGameOver() || !getSelectedCell()) return; // Verifica se o jogo não terminou e se há célula selecionada

        const row = parseInt(getSelectedCell().dataset.row);
        const col = parseInt(getSelectedCell().dataset.col);

        // Se a célula for dada, não permite input de teclado
        // Esta checagem é feita dentro de handleNumberInput agora
        // if (getGivenCells()[row][col]) return; // Removido, pois a lógica de "given cells" já está em handleNumberInput

        if (e.key >= '1' && e.key <= '9') {
            handleNumberInput(parseInt(e.key));
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            handleNumberInput(0); // Passa 0 para apagar
        } else if (e.key === 'h' || e.key === 'H') {
            useHint();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault(); // Previne o scroll da página com as setas
            moveSelection(e.key);
        }
    });
});