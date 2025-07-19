// js/game/_game-play.js

import { getBoard, getGivenCells, getSolution, getSelectedCell, setSelectedCell, setBoard, getIsGameOver } from './_game-state.js';
import { gridElement } from '../utils/_dom-elements.js';
import { renderGrid, highlightRelatedCells } from '../ui/_render-grid.js';
import { checkGameCompletion } from '../ui/_message-display.js'; // Importa checkGameCompletion para validação

export function handleCellClick(cell) {
    // Desseleciona a célula anterior
    const currentSelected = getSelectedCell();
    if (currentSelected) {
        currentSelected.classList.remove('selected');
        highlightRelatedCells(currentSelected, false);
    }

    // Seleciona a nova célula
    setSelectedCell(cell);
    cell.classList.add('selected');
    highlightRelatedCells(cell, true);
    cell.focus();
}

export function handleNumberInput(number) {
    const currentSelectedCell = getSelectedCell();
    // Bloqueia input se nenhuma célula está selecionada ou se o jogo terminou
    if (!currentSelectedCell || getIsGameOver()) return;

    const row = parseInt(currentSelectedCell.dataset.row);
    const col = parseInt(currentSelectedCell.dataset.col);

    // Não permite alterar células dadas (predefinidas do puzzle)
    if (getGivenCells()[row][col]) return;

    const currentBoard = getBoard(); // Obtém a referência atual do tabuleiro do estado
    const currentSolution = getSolution(); // Obtém a referência atual da solução

    if (number === 0) {
        // Apaga a célula
        currentBoard[row][col] = 0; // Modifica o array diretamente (referência)
        currentSelectedCell.textContent = '';
        currentSelectedCell.classList.remove('user-input', 'error');
    } else {
        // Coloca o número
        currentBoard[row][col] = number; // Modifica o array diretamente (referência)
        currentSelectedCell.textContent = number;
        currentSelectedCell.classList.add('user-input');
        currentSelectedCell.classList.remove('error'); // Remove erro se o usuário corrigiu

        // Verifica se o número está correto em relação à solução
        if (number !== currentSolution[row][col]) {
            currentSelectedCell.classList.add('error');
        }
    }
    // Como currentBoard é uma referência, as alterações já afetam boardState em _game-state.js
    // Mas uma chamada explícita a setBoard(currentBoard) aqui poderia ser adicionada
    // se houvesse a necessidade de disparar algum observador. Por ora, não é estritamente necessário.

    // Verifica se o quebra-cabeça está completo e correto (incluindo a lógica de final de jogo)
    // checkGameCompletion() agora é uma função do módulo _message-display.js
    checkGameCompletion();
}

export function moveSelection(direction) {
    let currentSelectedCell = getSelectedCell();
    if (!currentSelectedCell) {
        // Seleciona a primeira célula se nenhuma estiver selecionada
        const firstCell = document.querySelector('.cell');
        if (firstCell) {
            handleCellClick(firstCell); // Usa a função de clique para selecionar
        }
        return;
    }

    let row = parseInt(currentSelectedCell.dataset.row);
    let col = parseInt(currentSelectedCell.dataset.col);

    switch (direction) {
        case 'ArrowUp': row = row > 0 ? row - 1 : 8; break;
        case 'ArrowDown': row = row < 8 ? row + 1 : 0; break;
        case 'ArrowLeft': col = col > 0 ? col - 1 : 8; break;
        case 'ArrowRight': col = col < 8 ? col + 1 : 0; break;
    }

    const newCell = gridElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (newCell) {
        handleCellClick(newCell); // Usa a função de clique para selecionar
    }
}