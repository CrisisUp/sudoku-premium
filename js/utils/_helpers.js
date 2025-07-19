// js/utils/_helpers.js
// Este módulo contém um conjunto de funções utilitárias (helpers) que realizam operações comuns
// e algoritmos genéricos que são reutilizados em diferentes partes da aplicação Sudoku.
// Essas funções são independentes do estado do jogo e da manipulação direta do DOM,
// o que as torna altamente reusáveis e fáceis de testar.

/**
 * Embaralha (randomiza a ordem de) os elementos de um array utilizando o algoritmo de Fisher-Yates.
 * Este algoritmo garante que todos os elementos têm a mesma probabilidade de terminar em qualquer posição.
 * A modificação é feita diretamente no array passado como parâmetro (in-place).
 * @param {Array} array - O array a ser embaralhado.
 */
export function shuffleArray(array) {
    // Itera o array de trás para frente.
    for (let i = array.length - 1; i > 0; i--) {
        // Gera um índice aleatório 'j' entre 0 e 'i' (inclusive).
        const j = Math.floor(Math.random() * (i + 1));
        // Troca o elemento atual (array[i]) com o elemento no índice aleatório (array[j]).
        [array[i], array[j]] = [array[j], array[i]]; // Sintaxe de desestruturação para swap.
    }
}

/**
 * Encontra a próxima célula vazia (com valor 0) em um tabuleiro de Sudoku.
 * A busca é feita linha por linha, da esquerda para a direita.
 * @param {number[][]} grid - O array 9x9 que representa o tabuleiro de Sudoku.
 * @returns {number[]|null} Um array `[row, col]` contendo as coordenadas da primeira célula vazia encontrada,
 * ou `null` se não houver mais células vazias (o tabuleiro está completo).
 */
export function findEmptyCell(grid) {
    // Itera por cada linha.
    for (let i = 0; i < 9; i++) {
        // Itera por cada coluna dentro da linha atual.
        for (let j = 0; j < 9; j++) {
            // Se o valor da célula for 0, significa que está vazia.
            if (grid[i][j] === 0) {
                return [i, j]; // Retorna as coordenadas da célula vazia.
            }
        }
    }
    return null; // Se nenhum 0 for encontrado após verificar todas as células, o tabuleiro está cheio.
}

/**
 * Verifica se um determinado número pode ser colocado validamente em uma célula específica
 * do tabuleiro de Sudoku, seguindo as regras do jogo.
 * As regras verificadas são: o número não deve estar presente na mesma linha,
 * na mesma coluna ou no mesmo bloco 3x3.
 * @param {number[][]} grid - O array 9x9 que representa o tabuleiro de Sudoku.
 * @param {number} row - A linha (0-8) da célula a ser verificada.
 * @param {number} col - A coluna (0-8) da célula a ser verificada.
 * @param {number} num - O número (1-9) a ser testado na célula.
 * @returns {boolean} True se o número for válido para a posição, false caso contrário.
 */
export function isValid(grid, row, col, num) {
    // 1. Verificar na Linha:
    // Itera por todas as colunas na linha atual para ver se o 'num' já existe.
    for (let j = 0; j < 9; j++) {
        if (grid[row][j] === num) return false; // Se o número for encontrado, não é válido.
    }

    // 2. Verificar na Coluna:
    // Itera por todas as linhas na coluna atual para ver se o 'num' já existe.
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) return false; // Se o número for encontrado, não é válido.
    }

    // 3. Verificar no Bloco 3x3:
    // Calcula as coordenadas do canto superior esquerdo do bloco 3x3 ao qual a célula pertence.
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    // Itera pelas 9 células dentro deste bloco 3x3.
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false; // Se o número for encontrado, não é válido.
        }
    }

    return true; // Se nenhuma das verificações encontrou o número, ele é válido para a posição.
}