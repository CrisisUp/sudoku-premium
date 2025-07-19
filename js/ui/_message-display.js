// js/ui/_message-display.js
// Este módulo é responsável por controlar a exibição de mensagens de feedback ao usuário,
// o estado visual das dicas restantes e as ações que ocorrem ao final da partida.

// --- Importações de Módulos ---
// Importa funções e estados relacionados ao jogo para ler e modificar o estado global.
import { getBoard, getSolution, getIsGameOver, setIsGameOver, getHints, setSelectedCell, getSelectedCell } from '../game/_game-state.js';
// Importa referências a elementos do DOM para exibir mensagens e manipular dicas.
import { messageDisplay, hintElements } from '../utils/_dom-elements.js';
// Importa a função para resetar o temporizador ao final do jogo.
import { resetTimer } from '../game/_timer.js';
// Importa a função para remover o destaque de células ao final do jogo.
import { highlightRelatedCells } from './_render-grid.js';

/**
 * Atualiza a exibição visual das dicas restantes.
 * As pequenas bolinhas de dica na interface do usuário são ativadas ou desativadas
 * com base no número de dicas que o jogador ainda possui.
 */
export function updateHintsDisplay() {
    const currentHints = getHints(); // Obtém o número atual de dicas disponíveis.
    // Itera sobre cada elemento visual de dica (as bolinhas).
    hintElements.forEach((hint, index) => {
        // Se o índice da bolinha for menor que o número de dicas, ela é ativada.
        if (index < currentHints) {
            hint.classList.add('active'); // Adiciona a classe 'active' para visual de dica disponível.
        } else {
            // Caso contrário, ela é desativada (representando uma dica gasta).
            hint.classList.remove('active'); // Remove a classe 'active'.
        }
    });
}

/**
 * Verifica o estado atual do tabuleiro para determinar se ele está completo
 * e se todos os números preenchidos estão corretos de acordo com a solução.
 *
 * NOTA: Esta função apenas *verifica* o tabuleiro. A lógica de "final de jogo"
 * (como exibir o tempo e impedir mais interações) é tratada na função `checkSolution()`
 * no módulo `_game-actions.js`, que chama esta função para a verificação.
 *
 * @returns {boolean} True se o tabuleiro estiver completo e todos os números estiverem corretos;
 * False se houver células vazias ou erros de preenchimento.
 */
export function checkGameCompletion() {
    const currentBoard = getBoard();       // Obtém o estado atual do tabuleiro do jogo.
    const currentSolution = getSolution(); // Obtém a solução correta do Sudoku.

    // Primeiro, itera sobre todas as células para verificar se alguma está vazia.
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentBoard[i][j] === 0) {
                return false; // Se encontrar qualquer célula vazia (valor 0), o tabuleiro não está completo.
            }
        }
    }

    // Se todas as células estão preenchidas, agora verifica se a solução é correta.
    let isCorrect = true; // Assume que a solução está correta até que um erro seja encontrado.
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // Compara o valor do tabuleiro do usuário com o valor da solução.
            if (currentBoard[i][j] !== currentSolution[i][j]) {
                isCorrect = false; // Se encontrar um erro, a solução não está correta.
                break; // Sai do loop interno, pois o tabuleiro já não é correto.
            }
        }
        if (!isCorrect) break; // Sai do loop externo se um erro já foi encontrado.
    }
    return isCorrect; // Retorna o resultado final da verificação.
}

/**
 * Executa as ações finais quando uma partida de Sudoku termina (seja por vitória ou por desistência/resolução automática).
 * Define o estado do jogo como finalizado, reseta o temporizador e desmarca a célula selecionada.
 * A exibição da mensagem de tempo final é tratada separadamente no módulo `_game-actions.js`.
 */
export function endGame() {
    setIsGameOver(true); // Atualiza o estado global para indicar que o jogo terminou.
    resetTimer();        // Para e reinicia o temporizador, mostrando "00:00".

    const currentSelectedCell = getSelectedCell(); // Obtém a referência da célula atualmente selecionada.
    if (currentSelectedCell) {
        currentSelectedCell.classList.remove('selected'); // Remove a classe de seleção visual.
        highlightRelatedCells(currentSelectedCell, false); // Remove qualquer destaque de células relacionadas.
        setSelectedCell(null); // Limpa a célula selecionada no estado global.
    }
    // A mensagem de tempo final (ex: "Parabéns! Você resolveu em XX:YY!") é gerada
    // e exibida no módulo _game-actions.js, que chama esta função `endGame`.
}