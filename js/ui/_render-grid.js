// js/ui/_render-grid.js
// Este módulo é responsável por todas as operações de renderização e atualização visual
// do tabuleiro de Sudoku na interface do usuário. Ele constrói o grid HTML,
// preenche as células e gerencia o destaque de células e blocos relacionados.

// --- Importações de Módulos ---
// Obtém o estado atual do tabuleiro, células dadas, solução, e a célula selecionada.
import { getBoard, getGivenCells, getSolution, getSelectedCell, setSelectedCell } from '../game/_game-state.js';
// Obtém a referência ao elemento HTML que contém o grid do Sudoku.
import { gridElement } from '../utils/_dom-elements.js';
// Importa a função para lidar com o clique em células, vinda do módulo de game-play.
import { handleCellClick } from '../game/_game-play.js';

/**
 * Renderiza (ou redesenha) o tabuleiro de Sudoku completo na interface do usuário.
 * Limpa o grid existente e constrói um novo grid 9x9 com base no estado atual do tabuleiro.
 * Aplica estilos visuais para células dadas, entradas do usuário, erros e divisores de bloco.
 */
export function renderGrid() {
    gridElement.innerHTML = ''; // Limpa todo o conteúdo HTML atual do grid para redesenhar.

    // Obtém o estado atual do jogo para renderização.
    const currentBoard = getBoard();
    const currentGivenCells = getGivenCells();
    const currentSolution = getSolution(); // Usado para marcar erros de input.

    // Itera por cada linha (i) e coluna (j) para criar as 81 células do Sudoku.
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div'); // Cria um novo elemento <div> para a célula.
            cell.className = 'cell';                     // Adiciona a classe CSS base 'cell'.
            cell.dataset.row = i;                        // Armazena a linha no atributo data-row.
            cell.dataset.col = j;                        // Armazena a coluna no atributo data-col.
            cell.tabIndex = 0;                           // Torna a célula focável via teclado para acessibilidade.
            cell.id = `cell-${i}-${j}`;                  // Atribui um ID único (ex: "cell-0-0") para seleção direta.

            // Adiciona classes CSS para estilizar os separadores grossos entre os blocos 3x3.
            if (i === 2 || i === 5) {
                cell.classList.add('row-divider'); // Borda inferior para linhas 2 e 5.
            }
            if (j === 2 || j === 5) {
                cell.classList.add('col-divider'); // Borda direita para colunas 2 e 5 (necessita de CSS).
            }

            // Preenche a célula com o número se não for 0 (vazia).
            if (currentBoard[i][j] !== 0) {
                cell.textContent = currentBoard[i][j]; // Define o número visível na célula.
                if (currentGivenCells[i][j]) {
                    cell.classList.add('given');       // Célula original do puzzle, não editável.
                } else {
                    cell.classList.add('user-input');  // Número inserido pelo usuário.
                    // Marca a célula com a classe 'error' se o input do usuário for incorreto.
                    if (currentBoard[i][j] !== currentSolution[i][j]) {
                        cell.classList.add('error');
                    }
                }
            }

            // Adiciona um ouvinte de evento de clique para cada célula.
            // Ao clicar, a função handleCellClick (do _game-play.js) é chamada com a célula clicada.
            cell.addEventListener('click', function () {
                handleCellClick(this);
            });

            gridElement.appendChild(cell); // Adiciona a célula recém-criada ao grid HTML.
        }
    }

    // Lógica para focar na célula correta após a renderização:
    // Se nenhuma célula estiver selecionada (primeira carga ou novo jogo),
    // seleciona a primeira célula (0,0) para iniciar a interação.
    const currentSelected = getSelectedCell();
    if (!currentSelected) {
        const firstCell = document.querySelector('.cell'); // Seleciona a primeira célula visível.
        if (firstCell) {
            handleCellClick(firstCell); // Simula um clique para selecioná-la e destacá-la.
        }
    } else {
        // Se já havia uma célula selecionada antes de uma re-renderização (ex: após uma dica),
        // re-seleciona e destaca essa mesma célula no novo DOM para manter o contexto do usuário.
        const reselectCell = gridElement.querySelector(`.cell[data-row="${currentSelected.dataset.row}"][data-col="${currentSelected.dataset.col}"]`);
        if (reselectCell) {
             handleCellClick(reselectCell);
        }
    }
}

/**
 * Destaca visualmente as células relacionadas (mesma linha, coluna e bloco 3x3)
 * à célula atualmente selecionada.
 * @param {HTMLElement} cell - O elemento DOM da célula que foi selecionada.
 * @param {boolean} highlight - Se 'true', aplica o destaque; se 'false', remove todos os destaques.
 */
export function highlightRelatedCells(cell, highlight) {
    const row = parseInt(cell.dataset.row); // Obtém a linha da célula selecionada.
    const col = parseInt(cell.dataset.col); // Obtém a coluna da célula selecionada.

    const allCells = document.querySelectorAll('.cell'); // Obtém todas as células do tabuleiro.

    // Remove todos os destaques existentes se a função for chamada para "desdestacar".
    if (!highlight) {
        allCells.forEach(c => c.classList.remove('highlighted'));
        return; // Sai da função após remover o destaque.
    }

    // Itera por todas as células para aplicar o destaque às células relacionadas.
    allCells.forEach(c => {
        const cRow = parseInt(c.dataset.row); // Linha da célula atual no loop.
        const cCol = parseInt(c.dataset.col); // Coluna da célula atual no loop.

        // Verifica se a célula atual está na mesma linha, coluna ou bloco 3x3 que a célula selecionada.
        if (cRow === row || cCol === col ||
            (Math.floor(cRow / 3) === Math.floor(row / 3) && // Verifica se está no mesmo bloco de linhas.
                Math.floor(cCol / 3) === Math.floor(col / 3))) { // Verifica se está no mesmo bloco de colunas.
            if (c !== cell) { // Garante que a própria célula selecionada não seja destacada com a cor de related.
                c.classList.add('highlighted'); // Adiciona a classe CSS para destacar.
            }
        }
    });
}