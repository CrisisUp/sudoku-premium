// js/game/_game-actions.js

// Importações Corrigidas: Use getters/setters e não referências diretas ou nomes não exportados
import { getBoard, getSolution, getIsGameOver, setIsGameOver, getHints, decrementHints, getGivenCells } from './_game-state.js';
import { renderGrid } from '../ui/_render-grid.js';
import { messageDisplay, hintsContainer } from '../utils/_dom-elements.js';
import { stopTimer, getFormattedTime } from './_timer.js'; // Importações ESSENCIAIS do _timer.js

export function checkSolution() {
    if (getIsGameOver()) return; // Não verificar se o jogo já acabou usando o getter

    let correct = true;
    let hasEmptyCells = false;
    let errorCells = [];

    // Limpa erros anteriores no DOM
    document.querySelectorAll('.cell.error').forEach(cell => cell.classList.remove('error'));

    const currentBoard = getBoard(); // Obtém o tabuleiro do estado
    const currentSolution = getSolution(); // Obtém a solução do estado

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            const value = parseInt(cell.textContent) || 0; // Pega o valor da célula no DOM

            if (value === 0) {
                hasEmptyCells = true;
            } else if (value !== currentSolution[r][c]) { // Compara com a solução
                correct = false;
                errorCells.push(cell); // Armazena a célula com erro para marcar
            }
        }
    }

    if (hasEmptyCells) {
        messageDisplay.textContent = 'Tabuleiro incompleto!';
        messageDisplay.className = 'message info';
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
        }, 2000);
        return;
    }

    if (correct) {
        setIsGameOver(true); // Define o jogo como terminado
        stopTimer(); // PARA O TEMPORIZADOR
        const finalTime = getFormattedTime(); // OBTÉM O TEMPO FINAL

        messageDisplay.textContent = `Parabéns! Você resolveu em ${finalTime}!`; // EXIBE O TEMPO FINAL
        messageDisplay.className = 'message success'; // Adiciona classe para estilização

        // Mantém a mensagem por 5 segundos antes de sugerir um novo jogo
        setTimeout(() => {
            messageDisplay.textContent = 'Clique em "Novo Jogo" para outra partida!';
            messageDisplay.className = 'message'; // Reseta a classe
        }, 5000);

    } else {
        messageDisplay.textContent = 'Ainda há erros no tabuleiro!';
        messageDisplay.className = 'message error';
        errorCells.forEach(cell => cell.classList.add('error')); // Marca as células com erro
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
            errorCells.forEach(cell => cell.classList.remove('error')); // Remove a marcação de erro após um tempo
        }, 3000);
    }
}

export function useHint() {
    if (getIsGameOver()) return; // Não permitir dica se o jogo terminou
    const currentHints = getHints(); // Obtém o número atual de dicas

    if (currentHints <= 0) {
        messageDisplay.textContent = 'Sem dicas restantes!';
        messageDisplay.className = 'message error';
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
        }, 2000);
        return;
    }

    const currentBoard = getBoard(); // Obtém o tabuleiro do estado
    const currentSolution = getSolution(); // Obtém a solução do estado
    const currentGivenCells = getGivenCells(); // Obtém as células dadas

    let emptyCells = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            // Verifica se a célula está vazia E não é uma célula dada (predefinida do puzzle)
            if (currentBoard[r][c] === 0 && !currentGivenCells[r][c]) {
                emptyCells.push({ r, c }); // Armazena apenas as coordenadas
            }
        }
    }

    if (emptyCells.length === 0) {
        messageDisplay.textContent = 'Tabuleiro já completo!';
        messageDisplay.className = 'message info';
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
        }, 2000);
        return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex]; // Desestrutura as coordenadas
    const cellElement = document.getElementById(`cell-${r}-${c}`); // Obtém o elemento da célula

    // Preenche a célula no estado e no DOM
    currentBoard[r][c] = currentSolution[r][c]; // Atualiza o board no estado
    // Não é necessário chamar setBoard(currentBoard) aqui, pois currentBoard já é uma referência

    cellElement.textContent = currentSolution[r][c];
    cellElement.classList.add('hint-given'); // Adiciona uma classe para estilizar células com dica
    setTimeout(() => {
        cellElement.classList.remove('hint-given');
    }, 1000);

    decrementHints(); // CHAME A FUNÇÃO CORRETA PARA DECREMENTAR AS DICAS
    const updatedHints = getHints(); // Obtenha o valor ATUALIZADO de dicas

    // Atualiza a exibição visual das dicas
    const hintDivs = hintsContainer.querySelectorAll('.hint');
    hintDivs.forEach((hintDiv, index) => {
        if (index < updatedHints) {
            hintDiv.classList.add('active');
        } else {
            hintDiv.classList.remove('active');
        }
    });

    messageDisplay.textContent = 'Dica usada!';
    messageDisplay.className = 'message info';
    setTimeout(() => {
        messageDisplay.textContent = 'Continue jogando...';
        messageDisplay.className = 'message';
    }, 1500);
}

export function solvePuzzle() {
    if (getIsGameOver()) return; // Não resolver se o jogo já acabou

    const currentBoard = getBoard(); // Obter o board do estado
    const currentSolution = getSolution(); // Obter a solution do estado

    // Preenche o tabuleiro com a solução no estado e no DOM
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            currentBoard[r][c] = currentSolution[r][c]; // Atualiza o board no estado
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.textContent = currentSolution[r][c] === 0 ? '' : currentSolution[r][c];
            cell.classList.remove('user-input', 'selected', 'highlight-row-col', 'highlight-box', 'error');
            cell.classList.add('solved');
        }
    }

    setIsGameOver(true); // Define o jogo como terminado
    stopTimer(); // PARA O TEMPORIZADOR
    const finalTime = getFormattedTime(); // OBTÉM O TEMPO FINAL

    messageDisplay.textContent = `Jogo resolvido. Tempo final: ${finalTime}.`; // EXIBE O TEMPO FINAL
    messageDisplay.className = 'message info';

    // Mantém a mensagem por 5 segundos antes de sugerir um novo jogo
    setTimeout(() => {
        messageDisplay.textContent = 'Clique em "Novo Jogo" para outra partida!';
        messageDisplay.className = 'message';
    }, 5000);
}