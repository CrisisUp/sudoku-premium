document.addEventListener('DOMContentLoaded', function () {
    // Game state variables
    let board = Array(9).fill().map(() => Array(9).fill(0));
    let solution = Array(9).fill().map(() => Array(9).fill(0));
    let givenCells = Array(9).fill().map(() => Array(9).fill(false));
    let selectedCell = null;
    let startTime = null;
    let timerInterval = null;
    let isGameOver = false;
    let hints = 3;

    // DOM elements
    const gridElement = document.getElementById('grid');
    const newGameBtn = document.getElementById('new-game-btn');
    const difficultySelect = document.getElementById('difficulty');
    const checkBtn = document.getElementById('check-btn');
    const hintBtn = document.getElementById('hint-btn');
    const solveBtn = document.getElementById('solve-btn');
    const numberBtns = document.querySelectorAll('.number-btn');
    const timeDisplay = document.getElementById('time');
    const messageDisplay = document.getElementById('message');
    const hintElements = document.querySelectorAll('.hint');
    const themeToggle = document.querySelector('.theme-toggle');

    // Initialize the game
    initGame();

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkSolution);
    hintBtn.addEventListener('click', useHint);
    solveBtn.addEventListener('click', solvePuzzle);
    themeToggle.addEventListener('click', toggleTheme);

    numberBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (selectedCell && !isGameOver) {
                const number = parseInt(this.getAttribute('data-number'));
                const row = selectedCell.dataset.row;
                const col = selectedCell.dataset.col;

                if (!givenCells[row][col]) {
                    if (number === 0) {
                        // Erase the cell
                        board[row][col] = 0;
                        selectedCell.textContent = '';
                        selectedCell.classList.remove('user-input', 'error');
                    } else {
                        // Place the number
                        board[row][col] = number;
                        selectedCell.textContent = number;
                        selectedCell.classList.add('user-input');
                        selectedCell.classList.remove('error');

                        // Check if the number is correct
                        if (number !== solution[row][col]) {
                            selectedCell.classList.add('error');
                        }
                    }

                    // Check if the puzzle is complete and correct
                    checkGameCompletion();
                }
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
        if (!selectedCell || isGameOver) return;

        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        if (givenCells[row][col]) return;

        if (e.key >= '1' && e.key <= '9') {
            const number = parseInt(e.key);
            board[row][col] = number;
            selectedCell.textContent = number;
            selectedCell.classList.add('user-input');
            selectedCell.classList.remove('error');

            if (number !== solution[row][col]) {
                selectedCell.classList.add('error');
            }

            checkGameCompletion();
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            board[row][col] = 0;
            selectedCell.textContent = '';
            selectedCell.classList.remove('user-input', 'error');
        } else if (e.key === 'h' || e.key === 'H') {
            useHint();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            moveSelection(e.key);
        }
    });

    // Initialize the game
    function initGame() {
        // Reset game state
        board = Array(9).fill().map(() => Array(9).fill(0));
        solution = Array(9).fill().map(() => Array(9).fill(0));
        givenCells = Array(9).fill().map(() => Array(9).fill(false));
        selectedCell = null;
        isGameOver = false;
        hints = 3;
        updateHintsDisplay();
        messageDisplay.textContent = 'Bom jogo!';
        messageDisplay.className = 'message';

        // Generate a new puzzle
        generatePuzzle();

        // Render the grid
        renderGrid();

        // Start the timer
        resetTimer();
        startTimer();
    }

    // Move selection with arrow keys
    function moveSelection(direction) {
        if (!selectedCell) {
            // Select first cell if none selected
            const firstCell = document.querySelector('.cell');
            if (firstCell) {
                firstCell.click();
            }
            return;
        }

        let row = parseInt(selectedCell.dataset.row);
        let col = parseInt(selectedCell.dataset.col);

        switch (direction) {
            case 'ArrowUp': row = row > 0 ? row - 1 : 8; break;
            case 'ArrowDown': row = row < 8 ? row + 1 : 0; break;
            case 'ArrowLeft': col = col > 0 ? col - 1 : 8; break;
            case 'ArrowRight': col = col < 8 ? col + 1 : 0; break;
        }

        const newCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (newCell) {
            newCell.click();
            newCell.focus();
        }
    }

    // Toggle theme
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Atualiza ícones
    updateThemeIcons(newTheme);


    // Generate a new Sudoku puzzle
    function generatePuzzle() {
        // First generate a complete solution
        generateSolution(solution);

        // Then create a puzzle by removing numbers based on difficulty
        const difficulty = difficultySelect.value;
        let cellsToRemove;

        switch (difficulty) {
            case 'easy':
                cellsToRemove = 40; // ~20-30 cells remaining
                break;
            case 'medium':
                cellsToRemove = 50; // ~25-35 cells remaining
                break;
            case 'hard':
                cellsToRemove = 60; // ~20-25 cells remaining
                break;
            default:
                cellsToRemove = 45;
        }

        // Copy solution to board and remove numbers
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                board[i][j] = solution[i][j];
            }
        }

        // Remove numbers
        let cellsRemoved = 0;
        while (cellsRemoved < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (board[row][col] !== 0) {
                board[row][col] = 0;
                cellsRemoved++;
            }
        }

        // Mark given cells
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                givenCells[i][j] = board[i][j] !== 0;
            }
        }
    }

    // Generate a complete Sudoku solution
    function generateSolution(grid) {
        // Fill the diagonal 3x3 boxes first (they are independent)
        fillDiagonalBoxes(grid);

        // Then solve the rest of the grid
        solveSudoku(grid);
    }

    // Fill the diagonal 3x3 boxes
    function fillDiagonalBoxes(grid) {
        for (let box = 0; box < 9; box += 3) {
            fillBox(grid, box, box);
        }
    }

    // Fill a 3x3 box with random numbers
    function fillBox(grid, row, col) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffleArray(nums);

        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                grid[row + i][col + j] = nums[index++];
            }
        }
    }

    // Shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Solve the Sudoku puzzle using backtracking
    function solveSudoku(grid) {
        const emptyCell = findEmptyCell(grid);
        if (!emptyCell) return true; // Puzzle solved

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
                grid[row][col] = num;

                if (solveSudoku(grid)) {
                    return true;
                }

                grid[row][col] = 0; // Backtrack
            }
        }

        return false; // Trigger backtracking
    }

    // Find the next empty cell
    function findEmptyCell(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    // Check if a number can be placed in a cell
    function isValid(grid, row, col, num) {
        // Check row
        for (let j = 0; j < 9; j++) {
            if (grid[row][j] === num) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    // Render the Sudoku grid
    function renderGrid() {
        gridElement.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.tabIndex = 0; // Make cells focusable

                // Add row divider class for visual separation
                if (i === 2 || i === 5) {
                    cell.classList.add('row-divider');
                }

                if (board[i][j] !== 0) {
                    cell.textContent = board[i][j];
                    if (givenCells[i][j]) {
                        cell.classList.add('given');
                    } else {
                        cell.classList.add('user-input');

                        // Mark errors if the user input is wrong
                        if (board[i][j] !== solution[i][j]) {
                            cell.classList.add('error');
                        }
                    }
                }

                cell.addEventListener('click', function () {
                    // Deselect previous cell
                    if (selectedCell) {
                        selectedCell.classList.remove('selected');
                        highlightRelatedCells(selectedCell, false);
                    }

                    // Select new cell
                    selectedCell = this;
                    this.classList.add('selected');
                    highlightRelatedCells(this, true);
                    this.focus();
                });

                gridElement.appendChild(cell);
            }
        }

        // Focus first cell if none selected
        if (!selectedCell) {
            const firstCell = document.querySelector('.cell');
            if (firstCell) {
                firstCell.click();
            }
        }
    }

    // Highlight related cells (same row, column, and box)
    function highlightRelatedCells(cell, highlight) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Get all cells
        const allCells = document.querySelectorAll('.cell');

        // Reset all highlights first
        if (!highlight) {
            allCells.forEach(c => c.classList.remove('highlighted'));
            return;
        }

        // Highlight related cells
        allCells.forEach(c => {
            const cRow = parseInt(c.dataset.row);
            const cCol = parseInt(c.dataset.col);

            // Same row, column, or 3x3 box
            if (cRow === row || cCol === col ||
                (Math.floor(cRow / 3) === Math.floor(row / 3) &&
                    Math.floor(cCol / 3) === Math.floor(col / 3))) {
                if (c !== cell) {
                    c.classList.add('highlighted');
                }
            }
        });
    }

    // Check the current solution
    function checkSolution() {
        let isCorrect = true;
        let emptyCells = false;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    emptyCells = true;
                } else if (board[i][j] !== solution[i][j]) {
                    isCorrect = false;

                    // Highlight incorrect cells
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    if (cell && !givenCells[i][j]) {
                        cell.classList.add('error');
                    }
                }
            }
        }

        if (emptyCells) {
            messageDisplay.textContent = 'Complete todas as células primeiro!';
            messageDisplay.className = 'message error';
        } else if (isCorrect) {
            messageDisplay.textContent = 'Parabéns! Solução correta!';
            messageDisplay.className = 'message success';
            endGame();
        } else {
            messageDisplay.textContent = 'Existem erros na sua solução.';
            messageDisplay.className = 'message error';
        }
    }

    // Solve the puzzle automatically
    function solvePuzzle() {
        if (isGameOver) return;

        // Copy the solution to the board
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                board[i][j] = solution[i][j];
            }
        }

        // Update the display
        renderGrid();

        messageDisplay.textContent = 'Sudoku resolvido!';
        messageDisplay.className = 'message success';
        endGame();
    }

    // Use a hint
    function useHint() {
        if (hints <= 0) {
            messageDisplay.textContent = 'Você não tem mais dicas disponíveis!';
            messageDisplay.className = 'message error';
            return;
        }

        if (isGameOver || !selectedCell) {
            messageDisplay.textContent = 'Selecione uma célula vazia para usar uma dica.';
            messageDisplay.className = 'message error';
            return;
        }

        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        if (!givenCells[row][col] && board[row][col] === 0) {
            board[row][col] = solution[row][col];
            selectedCell.textContent = solution[row][col];
            selectedCell.classList.add('user-input');
            selectedCell.classList.remove('error');

            hints--;
            updateHintsDisplay();

            messageDisplay.textContent = 'Dica aplicada!';
            messageDisplay.className = 'message';

            checkGameCompletion();
        } else {
            messageDisplay.textContent = 'Selecione uma célula vazia para usar uma dica.';
            messageDisplay.className = 'message error';
        }
    }

    // Update hints display
    function updateHintsDisplay() {
        hintElements.forEach((hint, index) => {
            if (index < hints) {
                hint.classList.add('active');
            } else {
                hint.classList.remove('active');
            }
        });
    }

    // Check if the game is complete and correct
    function checkGameCompletion() {
        // First check if all cells are filled
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) return false;
            }
        }

        // Then check if the solution is correct
        let isCorrect = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== solution[i][j]) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }

        if (isCorrect) {
            messageDisplay.textContent = 'Parabéns! Você resolveu o Sudoku!';
            messageDisplay.className = 'message success';
            endGame();
        }

        return isCorrect;
    }

    // End the game
    function endGame() {
        isGameOver = true;
        clearInterval(timerInterval);

        // Deselect any selected cell
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            highlightRelatedCells(selectedCell, false);
            selectedCell = null;
        }
    }

    // Timer functions
    function startTimer() {
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timeDisplay.textContent = '00:00';
    }

    function updateTimer() {
        const currentTime = new Date();
        const elapsed = new Date(currentTime - startTime);
        const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
        const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }

    // Configuração inicial do tema
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Prioridade: localStorage > preferência do sistema > modo claro
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcons(theme); // Atualiza ícones na inicialização
    }

    // Alternar tema
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Aplica o novo tema
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Atualiza ícones
        updateThemeIcons(newTheme);
    }

    // Controla a visibilidade dos ícones
    function updateThemeIcons(theme) {
        const iconSun = document.querySelector('.icon-sun');
        const iconMoon = document.querySelector('.icon-moon');

        if (theme === 'dark') {
            iconSun.style.opacity = '1';
            iconSun.style.transform = 'rotate(0deg) scale(1)';
            iconMoon.style.opacity = '0';
            iconMoon.style.transform = 'rotate(90deg) scale(0.8)';
        } else {
            iconSun.style.opacity = '0';
            iconSun.style.transform = 'rotate(-90deg) scale(0.8)';
            iconMoon.style.opacity = '1';
            iconMoon.style.transform = 'rotate(0deg) scale(1)';
        }
    }

    initializeTheme();
});