// js/ui/_render-grid.js

import { getBoard, getGivenCells, getSolution, getSelectedCell, setSelectedCell } from '../game/_game-state.js';
import { gridElement } from '../utils/_dom-elements.js';
import { handleCellClick } from '../game/_game-play.js'; // Usado para gerenciar o clique na célula

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
            cell.id = `cell-${i}-${j}`; // Adiciona ID para facilitar a seleção direta

            // Adiciona classes para separação visual de blocos 3x3
            if (i === 2 || i === 5) {
                cell.classList.add('row-divider');
            }
            if (j === 2 || j === 5) { // Adiciona separador de coluna também (precisa de CSS)
                cell.classList.add('col-divider');
            }

            if (currentBoard[i][j] !== 0) {
                cell.textContent = currentBoard[i][j];
                if (currentGivenCells[i][j]) {
                    cell.classList.add('given'); // Célula pré-definida do puzzle
                } else {
                    cell.classList.add('user-input'); // Input do usuário
                    // Marca erros se a entrada do usuário estiver errada (apenas para células preenchidas)
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

    // Foca na primeira célula se nenhuma estiver selecionada ou re-seleciona a anterior
    const currentSelected = getSelectedCell();
    if (!currentSelected) {
        const firstCell = document.querySelector('.cell');
        if (firstCell) {
            handleCellClick(firstCell);
        }
    } else {
        // Se já havia uma célula selecionada antes de renderizar, re-selecione-a no novo DOM
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