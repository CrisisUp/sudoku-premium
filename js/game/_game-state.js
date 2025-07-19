// js/game/_game-state.js
// Este módulo é o coração do gerenciamento de dados do jogo Sudoku.
// Ele armazena e controla o estado atual da partida, incluindo:
// - O tabuleiro do jogo (com números preenchidos pelo usuário ou pelo puzzle).
// - A solução completa do Sudoku.
// - Quais células são originais do puzzle (não editáveis).
// - A célula atualmente selecionada pelo usuário.
// - O status de fim de jogo.
// - O número de dicas restantes.
// Ele utiliza um padrão de getters e setters para garantir que o acesso e a modificação
// do estado sejam controlados e consistentes por toda a aplicação.

// --- Variáveis de Estado Internas ---
// Essas variáveis armazenam o estado real do jogo. Elas não são exportadas diretamente,
// mas são acessadas e modificadas através das funções getter e setter exportadas abaixo.
let boardState = Array(9).fill().map(() => Array(9).fill(0));         // O tabuleiro atual do Sudoku (9x9, 0 para células vazias).
let solutionState = Array(9).fill().map(() => Array(9).fill(0));      // A solução completa e correta do Sudoku (9x9).
let givenCellsState = Array(9).fill().map(() => Array(9).fill(false)); // Matriz 9x9 booleana, indica se a célula é parte do puzzle original (true) ou editável (false).
let selectedCellState = null;                                       // Referência à célula DOM HTMLElement que está atualmente selecionada.
let isGameOverState = false;                                        // Booleano que indica se a partida terminou (true) ou está em andamento (false).
let hintsState = 3;                                                 // Número de dicas que o jogador ainda tem.

// --- Getters: Funções para Acessar o Estado (Apenas Leitura) ---
// Exportam o estado atual das variáveis internas para outros módulos.
// Isso garante que outros módulos leiam a versão mais recente do estado.
export function getBoard() { return boardState; }            // Retorna o tabuleiro atual do jogo.
export function getSolution() { return solutionState; }      // Retorna a solução completa do Sudoku.
export function getGivenCells() { return givenCellsState; }  // Retorna a matriz de células dadas.
export function getSelectedCell() { return selectedCellState; } // Retorna a célula DOM atualmente selecionada.
export function getIsGameOver() { return isGameOverState; }    // Retorna o status de fim de jogo.
export function getHints() { return hintsState; }              // Retorna o número de dicas restantes.

// --- Setters: Funções para Modificar o Estado (Escrita Controlada) ---
// Exportam funções que permitem a outros módulos modificarem o estado interno de forma controlada.
// Isso centraliza as modificações e ajuda a depurar problemas de estado.
export function setBoard(newBoard) { boardState = newBoard; }               // Define um novo estado para o tabuleiro.
export function setSolution(newSolution) { solutionState = newSolution; }    // Define uma nova solução para o Sudoku.
export function setGivenCells(newGivenCells) { givenCellsState = newGivenCells; } // Define um novo estado para as células dadas.
export function setSelectedCell(cell) { selectedCellState = cell; }       // Define a célula DOM que está selecionada.
export function setIsGameOver(status) { isGameOverState = status; }       // Define o status de fim de jogo (true/false).
export function decrementHints() { hintsState--; }                          // Diminui o contador de dicas em um.
export function resetHints() { hintsState = 3; }                           // Reseta o contador de dicas para o valor inicial (3).

/**
 * Reseta todas as variáveis de estado do jogo para seus valores iniciais.
 * Esta função é chamada no início de uma nova partida para limpar o estado anterior.
 * Garante que cada novo jogo comece de um estado limpo e previsível.
 */
export function resetGameState() {
    boardState = Array(9).fill().map(() => Array(9).fill(0));             // Reinicia o tabuleiro para todos os zeros.
    solutionState = Array(9).fill().map(() => Array(9).fill(0));          // Reinicia a solução para todos os zeros (será preenchida na geração do puzzle).
    givenCellsState = Array(9).fill().map(() => Array(9).fill(false));     // Reinicia todas as células como não dadas.
    selectedCellState = null;                                           // Nenhuma célula selecionada inicialmente.
    isGameOverState = false;                                            // O jogo não está terminado.
    hintsState = 3;                                                     // Reinicia o número de dicas para 3.
}