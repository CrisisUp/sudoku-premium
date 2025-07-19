// js/game/_game-actions.js
// Este módulo contém as principais ações que o jogador pode realizar no Sudoku:
// - Verificar a correção da solução atual do tabuleiro.
// - Usar uma dica para preencher uma célula vazia.
// - Resolver o tabuleiro automaticamente.
// Ele interage com o estado do jogo e atualiza a interface do usuário com feedback visual e mensagens.

// --- Importações de Módulos ---
// Importa getters e setters do estado do jogo para acessar e modificar o tabuleiro, solução, status do jogo, e dicas.
import { getBoard, getSolution, getIsGameOver, setIsGameOver, getHints, decrementHints, getGivenCells } from './_game-state.js';
// Importa a função para renderizar o grid (embora não usada diretamente nas ações, pode ser para futuras expansões).
import { renderGrid } from '../ui/_render-grid.js';
// Importa referências a elementos do DOM para exibir mensagens e manipular o contêiner de dicas.
import { messageDisplay, hintsContainer } from '../utils/_dom-elements.js';
// Importa funções do temporizador para parar a contagem e obter o tempo final.
import { stopTimer, getFormattedTime } from './_timer.js';

// --- Funções de Jogo Importadas de _game-play.js ---
// OBSERVAÇÃO: As funções handleNumberInput e moveSelection que estavam aqui no seu código
// anterior foram movidas para _game-play.js no pacote completo que eu gerei.
// Se elas ainda estiverem neste arquivo na sua versão, por favor, mova-as para _game-play.js
// para manter a separação de responsabilidades e evitar duplicação no app.js.


/**
 * Verifica o estado atual do tabuleiro preenchido pelo usuário.
 * Identifica se a solução está correta, se há células vazias ou erros.
 * Exibe feedback visual e mensagens apropriadas ao jogador.
 */
export function checkSolution() {
    // Retorna imediatamente se o jogo já terminou para evitar qualquer verificação desnecessária.
    if (getIsGameOver()) return;

    let correct = true;       // Assume que a solução está correta até que um erro seja encontrado.
    let hasEmptyCells = false; // Flag para indicar se ainda há células vazias.
    let errorCells = [];      // Array para armazenar referências às células com erros.

    // Limpa quaisquer marcações de erro de uma verificação anterior na interface.
    document.querySelectorAll('.cell.error').forEach(cell => cell.classList.remove('error'));

    const currentBoard = getBoard();       // Obtém a matriz do tabuleiro atual do estado do jogo.
    const currentSolution = getSolution(); // Obtém a matriz da solução correta do Sudoku.

    // Itera por cada célula do tabuleiro para comparar o valor do usuário com a solução.
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`); // Obtém o elemento DOM da célula.
            const value = parseInt(cell.textContent) || 0;         // Converte o texto da célula para um número (0 se vazia).

            if (value === 0) {
                hasEmptyCells = true; // Se a célula está vazia, marca que o tabuleiro está incompleto.
            } else if (value !== currentSolution[r][c]) {
                correct = false;         // Se o valor não corresponde à solução, marca como incorreto.
                errorCells.push(cell);   // Adiciona a célula à lista de erros.
            }
        }
    }

    // --- Lógica de Feedback e Encerramento do Jogo ---
    // Se o tabuleiro não estiver completamente preenchido.
    if (hasEmptyCells) {
        messageDisplay.textContent = 'Tabuleiro incompleto!';
        messageDisplay.className = 'message info'; // Estilo para mensagem de informação.
        // A mensagem é exibida por um tempo limitado (2 segundos) e depois volta ao estado padrão.
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
        }, 2000);
        return; // Sai da função, o jogo continua.
    }

    // Se o tabuleiro estiver completo e correto.
    if (correct) {
        setIsGameOver(true);         // Define o estado do jogo como finalizado.
        stopTimer();                 // Para o temporizador da partida.
        const finalTime = getFormattedTime(); // Obtém o tempo total da partida.

        messageDisplay.textContent = `Parabéns! Você resolveu em ${finalTime}!`; // Exibe mensagem de vitória com o tempo.
        messageDisplay.className = 'message success'; // Estilo para mensagem de sucesso.

        // Mantém a mensagem de vitória visível por 5 segundos antes de sugerir um novo jogo.
        setTimeout(() => {
            messageDisplay.textContent = 'Clique em "Novo Jogo" para outra partida!';
            messageDisplay.className = 'message';
        }, 5000);

    } else { // Se o tabuleiro estiver completo, mas com erros.
        messageDisplay.textContent = 'Ainda há erros no tabuleiro!';
        messageDisplay.className = 'message error'; // Estilo para mensagem de erro.
        errorCells.forEach(cell => cell.classList.add('error')); // Destaca visualmente as células com erro.
        // A mensagem de erro é exibida por um tempo limitado (3 segundos).
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
            errorCells.forEach(cell => cell.classList.remove('error')); // Remove o destaque de erro após o tempo.
        }, 3000);
    }
}

/**
 * Fornece uma dica ao jogador, preenchendo uma célula vazia com o número correto.
 * Diminui o contador de dicas e atualiza a exibição visual das dicas restantes.
 */
export function useHint() {
    // Não permite usar dicas se o jogo já terminou.
    if (getIsGameOver()) return;
    const currentHints = getHints(); // Obtém o número atual de dicas disponíveis.

    // Se não houver dicas restantes, exibe uma mensagem e retorna.
    if (currentHints <= 0) {
        messageDisplay.textContent = 'Sem dicas restantes!';
        messageDisplay.className = 'message error';
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
        }, 2000);
        return;
    }

    const currentBoard = getBoard();         // Obtém o tabuleiro atual do estado.
    const currentSolution = getSolution(); // Obtém a solução correta.
    const currentGivenCells = getGivenCells(); // Obtém quais células são dadas.

    let emptyCells = []; // Array para armazenar células vazias editáveis.
    // Itera pelo tabuleiro para encontrar células vazias que podem ser preenchidas com uma dica.
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            // Uma célula é candidata a dica se estiver vazia (0) e não for uma célula original do puzzle.
            if (currentBoard[r][c] === 0 && !currentGivenCells[r][c]) {
                emptyCells.push({ r, c }); // Armazena as coordenadas da célula vazia.
            }
        }
    }

    // Se não houver células vazias para dar dica, exibe uma mensagem e retorna.
    if (emptyCells.length === 0) {
        messageDisplay.textContent = 'Tabuleiro já completo!';
        messageDisplay.className = 'message info';
        setTimeout(() => {
            messageDisplay.textContent = 'Continue jogando...';
            messageDisplay.className = 'message';
        }, 2000);
        return;
    }

    // Escolhe uma célula vazia aleatoriamente da lista de candidatos.
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex]; // Desestrutura linha e coluna.
    const cellElement = document.getElementById(`cell-${r}-${c}`); // Obtém o elemento DOM da célula.

    // Preenche a célula com a solução correta no estado do tabuleiro e na interface.
    currentBoard[r][c] = currentSolution[r][c]; // Atualiza o valor no tabuleiro do estado.
    cellElement.textContent = currentSolution[r][c]; // Atualiza o texto na interface.
    cellElement.classList.add('hint-given'); // Adiciona uma classe temporária para efeito visual de "dica dada".

    // Remove a classe 'hint-given' após um breve período para um efeito de piscar.
    setTimeout(() => {
        cellElement.classList.remove('hint-given');
    }, 1000);

    decrementHints(); // Diminui o contador de dicas no estado do jogo.
    const updatedHints = getHints(); // Obtém o novo número de dicas.

    // Atualiza a exibição visual das bolinhas de dica na interface.
    const hintDivs = hintsContainer.querySelectorAll('.hint');
    hintDivs.forEach((hintDiv, index) => {
        if (index < updatedHints) {
            hintDiv.classList.add('active'); // Ativa as bolinhas para dicas restantes.
        } else {
            hintDiv.classList.remove('active'); // Desativa as bolinhas para dicas gastas.
        }
    });

    messageDisplay.textContent = 'Dica usada!';
    messageDisplay.className = 'message info';
    setTimeout(() => {
        messageDisplay.textContent = 'Continue jogando...';
        messageDisplay.className = 'message';
    }, 1500);
}

/**
 * Preenche o tabuleiro com a solução completa do Sudoku, resolvendo o jogo automaticamente.
 * Define o jogo como terminado e exibe o tempo final da partida.
 */
export function solvePuzzle() {
    // Não permite resolver o jogo se ele já terminou.
    if (getIsGameOver()) return;

    const currentBoard = getBoard();         // Obtém o tabuleiro atual do estado.
    const currentSolution = getSolution(); // Obtém a solução correta.

    // Preenche cada célula do tabuleiro com seu valor correto da solução.
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            currentBoard[r][c] = currentSolution[r][c]; // Atualiza o tabuleiro no estado.
            const cell = document.getElementById(`cell-${r}-${c}`); // Obtém o elemento DOM da célula.
            cell.textContent = currentSolution[r][c] === 0 ? '' : currentSolution[r][c]; // Preenche o texto na UI.
            // Remove todas as classes de estado (input do usuário, seleção, destaque, erro)
            // e adiciona a classe 'solved' para um estilo visual de tabuleiro resolvido.
            cell.classList.remove('user-input', 'selected', 'highlight-row-col', 'highlight-box', 'error');
            cell.classList.add('solved');
        }
    }

    setIsGameOver(true);         // Define o estado do jogo como finalizado.
    stopTimer();                 // Para o temporizador.
    const finalTime = getFormattedTime(); // Obtém o tempo final da partida.

    messageDisplay.textContent = `Jogo resolvido. Tempo final: ${finalTime}.`; // Exibe a mensagem de resolução com o tempo.
    messageDisplay.className = 'message info'; // Estilo para mensagem de informação.

    // Mantém a mensagem de resolução visível por 5 segundos antes de sugerir um novo jogo.
    setTimeout(() => {
        messageDisplay.textContent = 'Clique em "Novo Jogo" para outra partida!';
        messageDisplay.className = 'message';
    }, 5000);
}