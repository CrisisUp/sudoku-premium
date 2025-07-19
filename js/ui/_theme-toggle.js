// js/ui/_theme-toggle.js

import { themeToggle } from '../utils/_dom-elements.js';

export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Prioridade: localStorage > preferência do sistema > modo claro
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme); // Atualiza ícones na inicialização
}

export function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Aplica o novo tema
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Atualiza ícones
    updateThemeIcons(newTheme);
}

export function updateThemeIcons(theme) {
    const iconSun = themeToggle.querySelector('.icon-sun');
    const iconMoon = themeToggle.querySelector('.icon-moon');

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