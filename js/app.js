// js/app.js
// Este é o script principal que orquestra todas as funcionalidades do jogo Sudoku Premium.
// Ele é o ponto de entrada para a página do jogo (game.html), inicializando o estado,
// configurando o tabuleiro, o timer e todos os ouvintes de eventos para a interação do usuário.

// --- Importações de Módulos ---
// Importa funções e estados de diferentes módulos para manter o código organizado e modular.

// Módulos de Estado do Jogo: Gerenciam variáveis centrais do jogo (tabuleiro, solução, etc.).
import { resetGameState, getSelectedCell, getIsGameOver, getBoard, getGivenCells, getSolution } from './game/_game-state.js';

// Módulo de Lógica do Tabuleiro: Funções para gerar e resolver o Sudoku.
import { generatePuzzle } from './game/_board-logic.js';

// Módulo de Interação do Jogo: Lida com a entrada de números e navegação entre células.
import { handleNumberInput, moveSelection, handleCellClick } from './game/_game-play.js';

// Módulo de Ações do Jogo: Funções para verificar a solução, dar dicas e resolver o jogo.
import { checkSolution, useHint, solvePuzzle } from './game/_game-actions.js';

// Módulo do Timer: Gerencia o cronômetro da partida.
import { startTimer, resetTimer } from './game/_timer.js';

// Módulo de Renderização da UI: Responsável por desenhar o tabuleiro na tela.
import { renderGrid } from './ui/_render-grid.js';

// Módulo de Exibição de Mensagens: Atualiza o display de dicas e mensagens de feedback.
import { updateHintsDisplay } from './ui/_message-display.js';

// Módulo de Elementos do DOM: Centraliza a obtenção de todas as referências a elementos HTML.
import {
    newGameBtn,     // Botão para iniciar um novo jogo.
    checkBtn,       // Botão para verificar a solução.
    hintBtn,        // Botão para usar uma dica.
    solveBtn,       // Botão para resolver o Sudoku.
    numberBtns,     // Botões numéricos do teclado virtual.
    messageDisplay, // Área onde mensagens de feedback são exibidas.
    themeToggle     // Botão de alternar tema (importado para configurar o listener aqui).
} from './utils/_dom-elements.js';


// --- Funções de Tema (Integradas Localmente para `app.js`) ---
// Estas funções são incluídas diretamente neste arquivo para gerenciar a alternância de tema
// especificamente na página do jogo. Elas são separadas do script da página Home
// (js/ui/_home-script.js) para evitar conflitos de módulos quando as páginas são navegadas.

/**
 * Obtém as referências aos ícones de sol e lua dentro do botão de alternar tema.
 * @returns {object} Um objeto contendo os elementos dos ícones `iconSun` e `iconMoon`.
 */
function getThemeToggleIcons() {
    return {
        iconSun: document.querySelector('.theme-toggle .icon-sun'),
        iconMoon: document.querySelector('.theme-toggle .icon-moon')
    };
}

/**
 * Inicializa o tema da aplicação ao carregar a página.
 * Ele verifica se há um tema salvo no Local Storage ou a preferência do sistema operacional,
 * e então aplica o tema correspondente (claro ou escuro).
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme'); // Tenta carregar o tema salvo pelo usuário.
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Verifica a preferência do sistema.

    // Define o tema com base na prioridade: salvo > sistema > padrão (claro).
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme); // Aplica o atributo 'data-theme' ao HTML.
    updateThemeIcons(theme); // Atualiza a visibilidade dos ícones de sol/lua.
}

/**
 * Alterna o tema da aplicação entre 'dark' (escuro) e 'light' (claro).
 * Salva a nova preferência de tema no Local Storage para persistência.
 */
function toggleTheme() {
    const html = document.documentElement; // Referência ao elemento <html>.
    const currentTheme = html.getAttribute('data-theme'); // Obtém o tema atual.
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; // Alterna para o tema oposto.

    html.setAttribute('data-theme', newTheme); // Aplica o novo tema ao HTML.
    localStorage.setItem('theme', newTheme); // Salva a preferência no Local Storage.
    updateThemeIcons(newTheme); // Atualiza a visibilidade dos ícones.
}

/**
 * Controla a opacidade e a transformação dos ícones de sol e lua para animar a transição do tema.
 * No modo escuro, o sol aparece; no modo claro, a lua aparece.
 * @param {string} theme - O tema atual ('dark' ou 'light').
 */
function updateThemeIcons(theme) {
    const { iconSun, iconMoon } = getThemeToggleIcons(); // Obtém os elementos dos ícones.

    if (iconSun && iconMoon) { // Garante que os ícones existem no DOM antes de manipulá-los.
        if (theme === 'dark') {
            // No tema escuro, o sol fica visível e sem transformação, a lua desaparece.
            iconSun.style.opacity = '1';
            iconSun.style.transform = 'rotate(0deg) scale(1)';
            iconMoon.style.opacity = '0';
            iconMoon.style.transform = 'rotate(90deg) scale(0.8)';
        } else {
            // No tema claro, o sol desaparece, a lua fica visível e sem transformação.
            iconSun.style.opacity = '0';
            iconSun.style.transform = 'rotate(-90deg) scale(0.8)';
            iconMoon.style.opacity = '1';
            iconMoon.style.transform = 'rotate(0deg) scale(1)';
        }
    }
}
// --- Fim das Funções de Tema ---


/**
 * Inicializa um novo jogo de Sudoku.
 * Esta função é chamada ao carregar a página e ao clicar no botão "Novo Jogo".
 * Ela reinicia o estado do jogo, gera um novo quebra-cabeça, renderiza o tabuleiro
 * e inicia o temporizador.
 */
function initGame() {
    // 1. Reinicia todas as variáveis de estado do jogo para seus valores iniciais.
    resetGameState();

    // 2. Atualiza o display visual das dicas (geralmente para mostrar 3 dicas ativas).
    updateHintsDisplay();

    // 3. Define a mensagem inicial na interface para o jogador.
    messageDisplay.textContent = 'Bom jogo!';
    messageDisplay.className = 'message'; // Garante que a classe da mensagem é resetada.

    // 4. Gera um novo tabuleiro de Sudoku completo com uma solução e um quebra-cabeça.
    generatePuzzle();

    // 5. Renderiza o tabuleiro gerado na interface do usuário.
    renderGrid();

    // 6. Reinicia e inicia o temporizador da partida.
    resetTimer(); // Limpa qualquer timer anterior e reseta para 00:00.
    startTimer(); // Inicia a contagem do tempo.
}

/**
 * Configura todos os ouvintes de eventos globais para a interação do usuário.
 * Esta função é executada apenas uma vez, quando o DOM (Document Object Model)
 * estiver completamente carregado e pronto para manipulação.
 */
document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicializa o tema da aplicação ao carregar a página do jogo.
    initializeTheme();

    // 2. Inicia um novo jogo de Sudoku automaticamente na primeira carga da página.
    initGame();

    // 3. Adiciona ouvintes de eventos para os botões de controle principais do jogo.
    newGameBtn.addEventListener('click', initGame);      // Ao clicar, inicia um novo jogo.
    checkBtn.addEventListener('click', checkSolution);   // Ao clicar, verifica a solução do usuário.
    hintBtn.addEventListener('click', useHint);          // Ao clicar, usa uma dica.
    solveBtn.addEventListener('click', solvePuzzle);     // Ao clicar, resolve o Sudoku automaticamente.

    // 4. Adiciona ouvinte de evento para o botão de alternar tema.
    // Verifica se o botão existe no DOM antes de tentar adicionar o listener.
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 5. Adiciona ouvinte de evento para os botões numéricos do teclado virtual.
    // Itera sobre todos os botões numéricos e adiciona um listener de clique a cada um.
    numberBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Extrai o número do atributo 'data-number' e o converte para inteiro.
            const number = parseInt(this.getAttribute('data-number'));
            // Chama a função de manipulação de input para processar o número.
            handleNumberInput(number);
        });
    });

    // 6. Adiciona suporte para input via teclado físico (setas, números, backspace/delete).
    document.addEventListener('keydown', function (e) {
        // Bloqueia qualquer input de teclado se o jogo terminou ou se nenhuma célula está selecionada.
        if (getIsGameOver() || !getSelectedCell()) return;

        // Processa as teclas numéricas de '1' a '9'.
        if (e.key >= '1' && e.key <= '9') {
            handleNumberInput(parseInt(e.key));
        }
        // Processa as teclas 'Backspace', 'Delete' ou '0' para apagar o conteúdo da célula.
        else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            handleNumberInput(0); // Passa 0 para a função, que interpreta como comando para apagar.
        }
        // Ativa a funcionalidade de dica ao pressionar 'h' ou 'H'.
        else if (e.key === 'h' || e.key === 'H') {
            useHint();
        }
        // Move a seleção da célula usando as teclas de seta.
        else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault(); // Previne o scroll padrão da página ao usar as setas.
            moveSelection(e.key); // Move a seleção da célula na direção indicada.
        }
    });
});