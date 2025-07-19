// js/game/_timer.js
// Este módulo gerencia o temporizador da partida de Sudoku. Ele é responsável por:
// - Iniciar, parar e resetar a contagem do tempo.
// - Atualizar o display do tempo na interface do usuário a cada segundo.
// - Fornecer o tempo atual formatado para outros módulos quando solicitado.

// --- Importações de Módulos ---
// Importa a referência ao elemento HTML onde o tempo será exibido.
import { timeDisplay } from '../utils/_dom-elements.js';
// Importa a função para verificar o estado do jogo (se terminou ou não),
// o que é crucial para decidir se o temporizador deve continuar ou parar.
import { getIsGameOver } from './_game-state.js';

// --- Variáveis de Estado Internas do Timer ---
let timerStartTime = null;        // Armazena o timestamp (data e hora) de quando o timer foi iniciado pela última vez.
let timerIntervalId = null;       // Armazena o ID do setInterval, permitindo que o timer seja parado (limpo).
let currentFormattedTime = '00:00'; // Armazena a string do tempo formatado (MM:SS) a cada segundo,
                                  // para que possa ser acessado por outros módulos no momento da parada.

/**
 * Inicia o temporizador da partida.
 * Se um temporizador já estiver em execução, ele é parado antes de iniciar um novo,
 * garantindo que apenas um temporizador esteja ativo por vez.
 * A contagem começa a partir do momento em que esta função é chamada.
 */
export function startTimer() {
    // Limpa qualquer temporizador anterior para evitar múltiplas execuções simultâneas.
    if (timerIntervalId) clearInterval(timerIntervalId);
    timerStartTime = new Date(); // Registra o momento exato em que o temporizador começou.
    // Configura um intervalo que chama a função `updateTimer` a cada 1000 milissegundos (1 segundo).
    timerIntervalId = setInterval(updateTimer, 1000);
}

/**
 * Reseta o temporizador para zero ('00:00') e o para.
 * Esta função é tipicamente usada no início de uma nova partida ou ao final do jogo.
 */
export function resetTimer() {
    // Para o temporizador se ele estiver em execução.
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null; // Zera o ID do intervalo para indicar que não há timer ativo.
    }
    timeDisplay.textContent = '00:00'; // Atualiza o display do tempo na interface para zero.
    timerStartTime = null;            // Zera o tempo de início.
    currentFormattedTime = '00:00';   // Reseta o tempo formatado armazenado.
}

/**
 * Função interna (não exportada) que é chamada a cada segundo pelo `setInterval`.
 * Calcula o tempo decorrido, formata-o e atualiza o display na interface.
 * Também verifica se o jogo terminou para parar o próprio temporizador.
 */
function updateTimer() {
    // Condição para parar o temporizador:
    // 1. Se `timerStartTime` for nulo (temporizador não iniciado ou resetado).
    // 2. Ou se o jogo já terminou (verificado via `getIsGameOver()`).
    if (getIsGameOver() || !timerStartTime) {
        if (timerIntervalId) { // Garante que há um ID de intervalo para limpar.
            clearInterval(timerIntervalId); // Para a execução repetida do `setInterval`.
            timerIntervalId = null;        // Remove a referência ao ID.
        }
        return; // Sai da função, impedindo cálculos e atualizações desnecessárias.
    }

    const currentTime = new Date();                 // Obtém o momento atual.
    const elapsed = new Date(currentTime - timerStartTime); // Calcula a diferença entre o tempo atual e o de início.

    // Extrai minutos e segundos do tempo decorrido e formata-os com dois dígitos.
    const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');

    // Atualiza a variável interna com o tempo formatado e o display na interface do usuário.
    currentFormattedTime = `${minutes}:${seconds}`;
    timeDisplay.textContent = currentFormattedTime;
}

/**
 * Retorna o tempo decorrido atual da partida em um formato de string "MM:SS".
 * Esta função é útil para outros módulos que precisam exibir ou registrar o tempo final.
 * @returns {string} O tempo formatado da partida (ex: "05:30").
 */
export function getFormattedTime() {
    return currentFormattedTime;
}

/**
 * Para a execução do temporizador sem resetar o tempo exibido.
 * Esta função é útil quando o jogo termina, para que o tempo final fique visível
 * antes de ser potencialmente resetado por uma nova partida.
 */
export function stopTimer() {
    if (timerIntervalId) { // Garante que há um temporizador ativo para parar.
        clearInterval(timerIntervalId); // Interrompe a chamada repetida de `updateTimer`.
        timerIntervalId = null;        // Zera o ID do intervalo.
    }
}