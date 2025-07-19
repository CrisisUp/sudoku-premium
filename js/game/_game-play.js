// js/game/_game-play.js
// Este módulo gerencia as interações diretas do jogador com o tabuleiro de Sudoku.
// Inclui funções para selecionar células, inserir números (via teclado virtual ou físico)
// e navegar pelo grid.

// --- Importações de Módulos ---
// Importa funções para acessar e modificar o estado central do jogo (tabuleiro, solução, dicas, etc.).
import { getBoard, getGivenCells, getSolution, getSelectedCell, setSelectedCell, setBoard, getIsGameOver } from './_game-state.js';
// Importa a referência ao elemento HTML do grid do Sudoku.
import { gridElement } from '../utils/_dom-elements.js';
// Importa funções de renderização para atualizar o visual do grid e destaques.
import { renderGrid, highlightRelatedCells } from '../ui/_render-grid.js';
// Importa a função para verificar se o jogo está completo (usada após cada input).
import { checkGameCompletion } from '../ui/_message-display.js';

/**
 * Lida com o evento de clique em uma célula do tabuleiro de Sudoku.
 * Gerencia a seleção visual da célula e atualiza a célula selecionada no estado do jogo.
 * @param {HTMLElement} cell - O elemento DOM da célula que foi clicada.
 */
export function handleCellClick(cell) {
    // Desseleciona a célula que estava ativa anteriormente, removendo estilos visuais e destaques.
    const currentSelected = getSelectedCell();
    if (currentSelected) {
        currentSelected.classList.remove('selected');          // Remove a classe 'selected'.
        highlightRelatedCells(currentSelected, false); // Remove destaques de linha/coluna/bloco.
    }

    // Seleciona a nova célula clicada, aplicando estilos visuais e atualizando o estado.
    setSelectedCell(cell);             // Atualiza a célula selecionada no estado global.
    cell.classList.add('selected');    // Adiciona a classe 'selected' para visual.
    highlightRelatedCells(cell, true); // Aplica destaques para a nova célula selecionada.
    cell.focus();                      // Foca a célula para permitir input direto via teclado físico.
}

/**
 * Processa a entrada de um número em uma célula selecionada.
 * Esta função é chamada tanto pelos botões numéricos do teclado virtual quanto pelo teclado físico.
 * Ela atualiza o tabuleiro no estado do jogo e na interface, marcando erros se o número estiver incorreto.
 * @param {number} number - O número a ser inserido na célula (0 para apagar).
 */
export function handleNumberInput(number) {
    const currentSelectedCell = getSelectedCell();
    // Bloqueia a entrada se nenhuma célula estiver selecionada ou se o jogo já tiver terminado.
    if (!currentSelectedCell || getIsGameOver()) return;

    const row = parseInt(currentSelectedCell.dataset.row); // Obtém a linha da célula selecionada.
    const col = parseInt(currentSelectedCell.dataset.col); // Obtém a coluna da célula selecionada.

    // Impede que o usuário altere números que fazem parte do quebra-cabeça original (células "dadas").
    if (getGivenCells()[row][col]) return;

    const currentBoard = getBoard();         // Obtém a referência atual do tabuleiro do estado.
    const currentSolution = getSolution(); // Obtém a referência da solução correta para validação.

    if (number === 0) {
        // Se o número é 0 (ou Backspace/Delete), apaga o conteúdo da célula.
        currentBoard[row][col] = 0; // Define o valor no tabuleiro do estado como 0 (vazio).
        currentSelectedCell.textContent = ''; // Limpa o texto da célula na interface.
        currentSelectedCell.classList.remove('user-input', 'error'); // Remove estilos de input do usuário e erro.
    } else {
        // Se é um número de 1 a 9, insere o número na célula.
        currentBoard[row][col] = number; // Define o valor no tabuleiro do estado.
        currentSelectedCell.textContent = number; // Exibe o número na célula na interface.
        currentSelectedCell.classList.add('user-input'); // Adiciona classe para indicar input do usuário.
        currentSelectedCell.classList.remove('error'); // Assume que o erro pode ter sido corrigido.

        // Verifica se o número inserido está correto em relação à solução.
        if (number !== currentSolution[row][col]) {
            currentSelectedCell.classList.add('error'); // Adiciona classe 'error' se o número estiver incorreto.
        }
    }
    // Observação: Como `currentBoard` é uma referência direta ao array `boardState` em `_game-state.js`,
    // as modificações em `currentBoard` afetam diretamente o estado global. Não é necessário chamar `setBoard(currentBoard)`.

    // Após cada entrada, verifica se o tabuleiro está completo e correto.
    // Esta função (de _message-display.js) pode disparar o fim do jogo se todas as condições forem atendidas.
    checkGameCompletion();
}

/**
 * Move a célula selecionada no tabuleiro na direção indicada pelas setas do teclado.
 * Atualiza a seleção visual e o estado da célula selecionada.
 * @param {string} direction - A direção do movimento ('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight').
 */
export function moveSelection(direction) {
    let currentSelectedCell = getSelectedCell();
    // Se nenhuma célula estiver selecionada (ex: na primeira vez que se usa as setas),
    // seleciona a primeira célula do grid para começar a navegação.
    if (!currentSelectedCell) {
        const firstCell = document.querySelector('.cell');
        if (firstCell) {
            handleCellClick(firstCell); // Usa a função de clique para simular a seleção da primeira célula.
        }
        return;
    }

    let row = parseInt(currentSelectedCell.dataset.row); // Linha atual da célula selecionada.
    let col = parseInt(currentSelectedCell.dataset.col); // Coluna atual da célula selecionada.

    // Lógica para calcular a nova linha/coluna com base na direção,
    // com "wrap-around" (volta para o início/fim do grid).
    switch (direction) {
        case 'ArrowUp': row = row > 0 ? row - 1 : 8; break; // Move para cima, se na borda superior, vai para a inferior.
        case 'ArrowDown': row = row < 8 ? row + 1 : 0; break; // Move para baixo, se na borda inferior, vai para a superior.
        case 'ArrowLeft': col = col > 0 ? col - 1 : 8; break; // Move para a esquerda, se na borda esquerda, vai para a direita.
        case 'ArrowRight': col = col < 8 ? col + 1 : 0; break; // Move para a direita, se na borda direita, vai para a esquerda.
    }

    // Encontra o elemento DOM da nova célula que deve ser selecionada.
    const newCell = gridElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (newCell) {
        handleCellClick(newCell); // Simula um clique na nova célula para selecioná-la e atualizar a interface.
    }
}