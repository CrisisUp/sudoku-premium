// js/ui/_home-script.js

// Este script é exclusivo para a página Home.
// Ele lida com a alternância de tema sem carregar a lógica completa do jogo.

// Função auxiliar para encontrar elementos DOM necessários para o tema
function getThemeToggleElements() {
    return {
        themeToggleBtn: document.querySelector('.theme-toggle'),
        iconSun: document.querySelector('.icon-sun'),
        iconMoon: document.querySelector('.icon-moon')
    };
}

// Inicializa o tema (lê do localStorage ou preferência do sistema)
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
}

// Alterna o tema entre claro e escuro
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

// Atualiza a visibilidade dos ícones de sol/lua
function updateThemeIcons(theme) {
    const { iconSun, iconMoon } = getThemeToggleElements();

    if (iconSun && iconMoon) { // Garante que os ícones existem antes de manipulá-los
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
}

// Event listener para inicializar o tema e o botão de alternar quando o DOM estiver pronto para a Home
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme(); // Configura o tema na carga da página
    const { themeToggleBtn } = getThemeToggleElements();
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme); // Adiciona o listener ao botão de tema
    }
});