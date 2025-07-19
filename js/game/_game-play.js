// js/game/_game-play.js

import { getBoard, getGivenCells, getSolution, getSelectedCell, setSelectedCell, setBoard } from './_game-state.js';
import { gridElement } from '../utils/_dom-elements.js';
import { renderGrid, highlightRelatedCells } from '../ui/_render-grid.js';
import { checkGameCompletion } from '../ui/_message-display.js';

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
    if (!currentSelectedCell || getIsGameOver()) return; // Adicionado getIsGameOver para não permitir input se o jogo terminou

    const row = parseInt(currentSelectedCell.dataset.row);
    const col = parseInt(currentSelectedCell.dataset.col);

    if (getGivenCells()[row][col]) return; // Não permite alterar células dadas

    const currentBoard = getBoard();
    if (number === 0) {
        // Apaga a célula
        currentBoard[row][col] = 0;
        currentSelectedCell.textContent = '';
        currentSelectedCell.classList.remove('user-input', 'error');
    } else {
        // Coloca o número
        currentBoard[row][col] = number;
        currentSelectedCell.textContent = number;
        currentSelectedCell.classList.add('user-input');
        currentSelectedCell.classList.remove('error');

        // Verifica se o número está correto
        if (number !== getSolution()[row][col]) {
            currentSelectedCell.classList.add('error');
        }
    }
    setBoard(currentBoard); // Atualiza o estado global com o tabuleiro modificado

    // Verifica se o quebra-cabeça está completo e correto
    checkGameCompletion();
}

export function moveSelection(direction) {
    let currentSelectedCell = getSelectedCell();
    if (!currentSelectedCell) {
        // Seleciona a primeira célula se nenhuma estiver selecionada
        const firstCell = document.querySelector('.cell');
        if (firstCell) {
            handleCellClick(firstCell);
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
        handleCellClick(newCell);
    }
}