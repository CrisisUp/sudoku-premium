// js/ui/_render-grid.js

import { getBoard, getGivenCells, getSolution, getSelectedCell, setSelectedCell } from '../game/_game-state.js';
import { gridElement } from '../utils/_dom-elements.js';
import { handleCellClick } from '../game/_game-play.js';

export function renderGrid() {
    gridElement.innerHTML = ''; // Limpa o grid antes de renderizar

    const currentBoard = getBoard();
    const currentGivenCells = getGivenCells();
    const currentSolution = getSolution();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.tabIndex = 0; // Torna as células focáveis

            // Adiciona classes para separação visual de blocos 3x3
            if (i === 2 || i === 5) {
                cell.classList.add('row-divider');
            }
            if (j === 2 || j === 5) { // Adiciona separador de coluna também
                cell.classList.add('col-divider'); // Você precisaria adicionar esse estilo no CSS
            }

            if (currentBoard[i][j] !== 0) {
                cell.textContent = currentBoard[i][j];
                if (currentGivenCells[i][j]) {
                    cell.classList.add('given');
                } else {
                    cell.classList.add('user-input');
                    // Marca erros se a entrada do usuário estiver errada
                    if (currentBoard[i][j] !== currentSolution[i][j]) {
                        cell.classList.add('error');
                    }
                }
            }

            cell.addEventListener('click', function () {
                handleCellClick(this);
            });

            gridElement.appendChild(cell);
        }
    }

    // Foca na primeira célula se nenhuma estiver selecionada
    // Removendo o clique para evitar loop/problemas de focus. Apenas seleciona.
    const currentSelected = getSelectedCell();
    if (!currentSelected) {
        const firstCell = document.querySelector('.cell');
        if (firstCell) {
            handleCellClick(firstCell); // Usa a função de clique para selecionar
        }
    } else {
        // Se já havia uma célula selecionada antes de renderizar, re-selecione-a
        const reselectCell = gridElement.querySelector(`.cell[data-row="${currentSelected.dataset.row}"][data-col="${currentSelected.dataset.col}"]`);
        if (reselectCell) {
             handleCellClick(reselectCell);
        }
    }
}

export function highlightRelatedCells(cell, highlight) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const allCells = document.querySelectorAll('.cell');

    // Remove todos os destaques primeiro se for para "desdestacar"
    if (!highlight) {
        allCells.forEach(c => c.classList.remove('highlighted'));
        return;
    }

    // Destaca células relacionadas
    allCells.forEach(c => {
        const cRow = parseInt(c.dataset.row);
        const cCol = parseInt(c.dataset.col);

        // Mesma linha, coluna ou bloco 3x3
        if (cRow === row || cCol === col ||
            (Math.floor(cRow / 3) === Math.floor(row / 3) &&
                Math.floor(cCol / 3) === Math.floor(col / 3))) {
            if (c !== cell) { // Não destaca a célula selecionada
                c.classList.add('highlighted');
            }
        }
    });
}