// js/utils/_dom-elements.js
// Este módulo centraliza todas as referências a elementos do Document Object Model (DOM)
// que são utilizados em diferentes partes da aplicação.
// O objetivo é evitar a repetição de `document.getElementById` ou `document.querySelector`
// em vários arquivos, tornando o código mais limpo, fácil de manter e mais performático,
// pois a busca por esses elementos é feita apenas uma vez.

// --- Exportações de Referências a Elementos do DOM ---
// Cada constante exportada representa um elemento HTML específico na sua página.

export const gridElement = document.getElementById('grid');             // O contêiner principal do grid do Sudoku.
export const newGameBtn = document.getElementById('new-game-btn');     // Botão para iniciar uma nova partida.
export const difficultySelect = document.getElementById('difficulty'); // O seletor de dificuldade do jogo (Fácil, Médio, Difícil).
export const checkBtn = document.getElementById('check-btn');           // Botão para verificar a solução do usuário.
export const hintBtn = document.getElementById('hint-btn');             // Botão para usar uma dica.
export const solveBtn = document.getElementById('solve-btn');           // Botão para resolver o Sudoku automaticamente.
export const numberBtns = document.querySelectorAll('.number-btn');     // Coleção de todos os botões numéricos (1-9, 0/apagar) do teclado virtual.
export const timeDisplay = document.getElementById('time');             // O elemento <span> onde o tempo do jogo é exibido.
export const messageDisplay = document.getElementById('message');       // A área onde mensagens de feedback ao usuário são mostradas.
export const hintElements = document.querySelectorAll('.hint');         // Coleção de elementos visuais que representam as dicas restantes (bolinhas).
export const themeToggle = document.querySelector('.theme-toggle');     // O botão para alternar entre o tema claro e escuro.
export const hintsContainer = document.querySelector('.hints');         // O contêiner que agrupa os elementos visuais das dicas.