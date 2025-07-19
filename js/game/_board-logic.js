// js/game/_board-logic.js
// Este módulo é responsável pela lógica fundamental do Sudoku:
// - Gerar um novo quebra-cabeça de Sudoku completo com uma única solução.
// - Criar um puzzle ao remover números da solução, baseando-se na dificuldade escolhida.
// - Fornecer o algoritmo de backtracking para resolver o Sudoku.

// --- Importações de Módulos ---
// Importa funções para acessar e modificar o estado central do jogo (tabuleiro, solução, células dadas).
import { getBoard, setBoard, setSolution, setGivenCells } from './_game-state.js';
// Importa a referência ao elemento DOM para a seleção de dificuldade do jogo.
import { difficultySelect } from '../utils/_dom-elements.js';
// Importa funções utilitárias: embaralhar arrays, encontrar células vazias e verificar validade de movimento.
import { shuffleArray, findEmptyCell, isValid } from '../utils/_helpers.js';

/**
 * Gera um novo quebra-cabeça de Sudoku completo.
 * Este processo envolve primeiro a criação de um tabuleiro de Sudoku totalmente resolvido,
 * e depois a remoção de um número específico de células com base na dificuldade selecionada,
 * criando o quebra-cabeça que o jogador irá resolver.
 */
export function generatePuzzle() {
    // 1. Gera uma solução completa para o Sudoku.
    // Cria uma matriz vazia temporária para a solução.
    const currentSolution = Array(9).fill().map(() => Array(9).fill(0));
    generateSolution(currentSolution); // Preenche a matriz com uma solução válida.
    setSolution(currentSolution);     // Salva esta solução completa no estado global do jogo.

    // 2. Determina quantas células devem ser removidas para criar o quebra-cabeça,
    // com base na dificuldade selecionada pelo usuário.
    const difficulty = difficultySelect.value;
    let cellsToRemove;

    switch (difficulty) {
        case 'easy':
            cellsToRemove = 40; // Deixa aproximadamente 41 células restantes para um desafio fácil.
            break;
        case 'medium':
            cellsToRemove = 50; // Deixa aproximadamente 31 células restantes para um desafio médio.
            break;
        case 'hard':
            cellsToRemove = 60; // Deixa aproximadamente 21 células restantes para um desafio difícil.
            break;
        default:
            cellsToRemove = 45; // Valor padrão se a dificuldade não for reconhecida.
    }

    // 3. Copia a solução completa para o tabuleiro que será exibido ao jogador
    // e remove as células para criar o puzzle.
    // `JSON.parse(JSON.stringify())` é usado para criar uma cópia "profunda" do array,
    // garantindo que modificações em `newBoard` não afetem `currentSolution`.
    const newBoard = JSON.parse(JSON.stringify(currentSolution));
    let cellsRemoved = 0;
    while (cellsRemoved < cellsToRemove) {
        // Seleciona uma célula aleatória no tabuleiro.
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        // Se a célula não estiver vazia, remove o número.
        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0; // Define a célula como vazia.
            cellsRemoved++;        // Incrementa o contador de células removidas.
        }
    }
    setBoard(newBoard); // Atualiza o estado global do tabuleiro com o quebra-cabeça gerado.

    // 4. Marca quais células no quebra-cabeça são "dadas" (iniciais e não editáveis).
    // Cria uma nova matriz booleana para as células dadas.
    const newGivenCells = Array(9).fill().map(() => Array(9).fill(false));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // Uma célula é "dada" se não estiver vazia no tabuleiro quebra-cabeça.
            newGivenCells[i][j] = getBoard()[i][j] !== 0;
        }
    }
    setGivenCells(newGivenCells); // Atualiza o estado global das células dadas.
}

/**
 * Gera um tabuleiro de Sudoku completamente resolvido.
 * Esta é uma função auxiliar interna, chamada por `generatePuzzle()`.
 * O processo envolve preencher primeiro as caixas 3x3 diagonais e depois
 * resolver o restante do tabuleiro usando o algoritmo de backtracking.
 * @param {number[][]} grid - O array 9x9 que será preenchido com a solução.
 */
function generateSolution(grid) {
    // Preenche as três caixas 3x3 que estão na diagonal principal (elas são independentes).
    fillDiagonalBoxes(grid);
    // Em seguida, usa o algoritmo de backtracking para preencher as células restantes
    // e completar a solução do Sudoku.
    solveSudoku(grid);
}

/**
 * Preenche as três caixas 3x3 que estão na diagonal do tabuleiro Sudoku.
 * Este é um passo inicial na geração de uma solução, pois essas caixas podem
 * ser preenchidas independentemente umas das outras.
 * @param {number[][]} grid - O array 9x9 do tabuleiro.
 */
function fillDiagonalBoxes(grid) {
    // Itera para preencher as caixas (0,0), (3,3) e (6,6).
    for (let box = 0; box < 9; box += 3) {
        fillBox(grid, box, box);
    }
}

/**
 * Preenche uma caixa 3x3 específica do tabuleiro com números aleatórios válidos (1-9).
 * Garante que os números dentro desta caixa sejam únicos.
 * @param {number[][]} grid - O array 9x9 do tabuleiro.
 * @param {number} row - A linha inicial (canto superior esquerdo) da caixa 3x3.
 * @param {number} col - A coluna inicial (canto superior esquerdo) da caixa 3x3.
 */
function fillBox(grid, row, col) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums); // Embaralha os números para preenchimento aleatório.

    let index = 0;
    // Preenche as 9 células da caixa 3x3.
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            grid[row + i][col + j] = nums[index++];
        }
    }
}

/**
 * Resolve um tabuleiro de Sudoku incompleto usando o algoritmo de backtracking.
 * Esta função tenta preencher as células vazias uma a uma, verificando a validade
 * de cada movimento. Se um movimento leva a um beco sem saída, ele "volta atrás"
 * e tenta outra opção.
 * @param {number[][]} grid - O array 9x9 do tabuleiro de Sudoku a ser resolvido.
 * @returns {boolean} True se uma solução for encontrada para o tabuleiro, false caso contrário.
 */
export function solveSudoku(grid) {
    // Tenta encontrar a próxima célula vazia no tabuleiro.
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
        return true; // Se não houver células vazias, o tabuleiro está resolvido.
    }

    const [row, col] = emptyCell; // Desestrutura a linha e coluna da célula vazia.

    // Tenta preencher a célula vazia com números de 1 a 9.
    for (let num = 1; num <= 9; num++) {
        // Verifica se o número pode ser colocado validamente na célula (não viola regras do Sudoku).
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num; // Coloca o número na célula.

            // Tenta resolver o restante do tabuleiro recursivamente.
            if (solveSudoku(grid)) {
                return true; // Se a recursão encontrar uma solução, propaga o sucesso.
            }

            grid[row][col] = 0; // Backtrack: Se o número não levou a uma solução, remove-o e tenta o próximo.
        }
    }
    return false; // Se nenhum número de 1 a 9 puder ser colocado, aciona o backtracking.
}