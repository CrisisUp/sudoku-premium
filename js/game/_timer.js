// js/game/_timer.js

import { timeDisplay } from '../utils/_dom-elements.js';
import { getIsGameOver } from './_game-state.js';

let timerStartTime = null;
let timerIntervalId = null;
let currentFormattedTime = '00:00'; // Nova variável para armazenar o tempo formatado atual

export function startTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId);
    timerStartTime = new Date();
    timerIntervalId = setInterval(updateTimer, 1000);
}

export function resetTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
    timeDisplay.textContent = '00:00';
    timerStartTime = null;
    currentFormattedTime = '00:00'; // Reseta o tempo formatado também
}

function updateTimer() {
    // A condição para parar o timer deve ser antes do cálculo, como já está
    if (getIsGameOver() || !timerStartTime) {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
        return;
    }

    const currentTime = new Date();
    const elapsed = new Date(currentTime - timerStartTime);
    const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');

    // Atualiza o display e armazena o tempo formatado
    currentFormattedTime = `${minutes}:${seconds}`;
    timeDisplay.textContent = currentFormattedTime;
}

// Exporta o tempo formatado atual
export function getFormattedTime() {
    return currentFormattedTime;
}

// Exporta uma forma de parar o timer explicitamente
export function stopTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
}