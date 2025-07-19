// js/app.js - Ponto de Entrada Principal do Jogo Sudoku

// Importações de todos os módulos necessários para a lógica do jogo
import { resetGameState, getSelectedCell, getIsGameOver, getBoard, getGivenCells, getSolution } from './game/_game-state.js';
import { generatePuzzle } from './game/_board-logic.js';
import { handleNumberInput, moveSelection, handleCellClick } from './game/_game-play.js';
import { checkSolution, useHint, solvePuzzle } from './game/_game-actions.js';
import { startTimer, resetTimer } from './game/_timer.js';
import { renderGrid } from './ui/_render-grid.js';
import { updateHintsDisplay } from './ui/_message-display.js';
import {
    newGameBtn,
    checkBtn,
    hintBtn,
    solveBtn,
    numberBtns,
    messageDisplay,
    themeToggle // Importa themeToggle para usar aqui para o evento
} from './utils/_dom-elements.js';


// --- Funções de Tema (integradas localmente para este app.js) ---
// Note: As funções de tema foram movidas para cá para evitar conflitos de módulo
// com o script da página Home.

// Captura o elemento do botão de tema localmente para este script
// Já importamos themeToggle de _dom-elements.js

function getThemeToggleIcons() {
    return {
        iconSun: document.querySelector('.theme-toggle .icon-sun'),
        iconMoon: document.querySelector('.theme-toggle .icon-moon')
    };
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const { iconSun, iconMoon } = getThemeToggleIcons();
    if (iconSun && iconMoon) {
        if (theme === 'dark') {
            iconSun.style.opacity = '1';
            iconSun.style.transform = 'rotate(0deg) scale(1)';
            iconMoon.style.opacity = '0';
            iconMoon.style.transform = 'rotate(90deg) scale(0.8)';
        } else {
            iconSun.style.opacity = '0';
            iconSun.style.transform = 'rotate(-90deg) scale(0.8)';
            iconMoon.style.opacity = '1';
            iconMoon.style.transform = 'rotate(0deg) scale(1)';
        }
    }
}
// --- Fim das Funções de Tema ---


// Função principal de inicialização de um novo jogo
function initGame() {
    // Resetar o estado do jogo
    resetGameState(); // Reseta variáveis como board, solution, isGameOver, hints
    updateHintsDisplay(); // Atualiza a exibição visual das dicas
    messageDisplay.textContent = 'Bom jogo!'; // Define a mensagem inicial
    messageDisplay.className = 'message'; // Reseta a classe da mensagem

    // Gerar um novo quebra-cabeça de Sudoku
    generatePuzzle();

    // Renderizar o tabuleiro na interface
    renderGrid();

    // Iniciar ou resetar o temporizador do jogo
    resetTimer();
    startTimer();
}

// Configura todos os event listeners quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicializar o tema ao carregar a página (apenas para a página do jogo)
    initializeTheme();

    // 2. Iniciar um novo jogo automaticamente ao carregar a página do jogo
    initGame();

    // 3. Adicionar event listeners para os botões de controle do jogo
    newGameBtn.addEventListener('click', initGame); // Botão "Novo Jogo"
    checkBtn.addEventListener('click', checkSolution); // Botão "Verificar"
    hintBtn.addEventListener('click', useHint); // Botão "Dica"
    solveBtn.addEventListener('click', solvePuzzle); // Botão "Resolver"

    // Botão de alternar tema (se existir na página do jogo)
    if (themeToggle) { // themeToggle é importado de _dom-elements.js
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 4. Adicionar event listener para os botões numéricos do teclado virtual
    numberBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const number = parseInt(this.getAttribute('data-number'));
            handleNumberInput(number); // Chama a função para processar o input do número
        });
    });

    // 5. Adicionar suporte para input via teclado físico
    document.addEventListener('keydown', function (e) {
        // Bloqueia input se o jogo terminou ou nenhuma célula está selecionada
        if (getIsGameOver() || !getSelectedCell()) return;

        // Processa números de 1 a 9
        if (e.key >= '1' && e.key <= '9') {
            handleNumberInput(parseInt(e.key));
        }
        // Processa Backspace, Delete ou 0 para apagar a célula
        else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            handleNumberInput(0); // Passa 0 para a função de apagar
        }
        // Ativa a dica com 'h' ou 'H'
        else if (e.key === 'h' || e.key === 'H') {
            useHint();
        }
        // Move a seleção da célula com as setas do teclado
        else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault(); // Previne o scroll da página ao usar as setas
            moveSelection(e.key);
        }
    });
});