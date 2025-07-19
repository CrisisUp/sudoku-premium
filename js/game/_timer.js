// js/game/_timer.js

import { timeDisplay } from '../utils/_dom-elements.js';
import { getIsGameOver } from './_game-state.js'; // Importar getIsGameOver

let timerStartTime = null; // Variável interna para o início do timer
let timerIntervalId = null; // Variável interna para o ID do intervalo

export function startTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId); // Garante que não há timer duplicado
    timerStartTime = new Date();
    timerIntervalId = setInterval(updateTimer, 1000);
}

export function resetTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null; // Reseta o ID
    }
    timeDisplay.textContent = '00:00';
    timerStartTime = null; // Reseta o tempo de início
}

function updateTimer() {
    if (getIsGameOver() || !timerStartTime) { // Pára se o jogo terminou ou timer não iniciado
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        return;
    }
    const currentTime = new Date();
    const elapsed = new Date(currentTime - timerStartTime);
    const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}