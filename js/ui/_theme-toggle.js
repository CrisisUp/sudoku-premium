// js/ui/_theme-toggle.js
// Este módulo é responsável por gerenciar a alternância de tema (claro/escuro) da aplicação.
// Ele armazena a preferência do usuário no Local Storage e atualiza a interface
// para refletir o tema escolhido, incluindo a animação dos ícones de sol e lua.

import { themeToggle } from '../utils/_dom-elements.js'; // Importa a referência do botão de alternar tema.

/**
 * Inicializa o tema da aplicação ao carregar a página.
 * A prioridade para definir o tema é a seguinte:
 * 1. Tema salvo no Local Storage (se o usuário já escolheu um antes).
 * 2. Preferência de tema do sistema operacional do usuário (modo escuro).
 * 3. Se nenhuma das opções acima for encontrada, o tema padrão é 'light' (claro).
 */
export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme'); // Tenta obter o tema salvo no navegador do usuário.
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Verifica se o sistema operacional prefere o tema escuro.

    // Determina o tema a ser aplicado com base na prioridade definida.
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme); // Aplica o atributo 'data-theme' ao elemento <html>.
    updateThemeIcons(theme); // Chama a função para garantir que o ícone correto seja exibido no carregamento.
}

/**
 * Alterna o tema atual da aplicação entre 'dark' (escuro) e 'light' (claro).
 * Esta função é tipicamente chamada quando o botão de alternar tema é clicado.
 * A nova preferência é salva no Local Storage para ser lembrada em futuras visitas.
 */
export function toggleTheme() {
    const html = document.documentElement; // Obtém uma referência ao elemento raiz <html> do documento.
    const currentTheme = html.getAttribute('data-theme'); // Lê o tema atualmente aplicado.
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; // Inverte o tema atual.

    html.setAttribute('data-theme', newTheme); // Aplica o novo tema ao elemento <html>.
    localStorage.setItem('theme', newTheme); // Salva o novo tema no Local Storage para persistência.

    updateThemeIcons(newTheme); // Atualiza a visibilidade dos ícones de sol/lua para o novo tema.
}

/**
 * Controla a opacidade e a transformação dos ícones de sol e lua dentro do botão de alternar tema.
 * Isso cria um efeito visual de transição e garante que apenas o ícone relevante ao tema atual esteja visível.
 * @param {string} theme - O tema atual que está sendo aplicado ('dark' ou 'light').
 */
export function updateThemeIcons(theme) {
    // Obtém as referências diretas aos elementos SVG dos ícones.
    // 'themeToggle' é o botão que contém ambos os SVGs.
    const iconSun = themeToggle.querySelector('.icon-sun');
    const iconMoon = themeToggle.querySelector('.icon-moon');

    // Garante que ambos os ícones existam no DOM antes de tentar manipulá-los.
    if (iconSun && iconMoon) {
        if (theme === 'dark') {
            // Se o tema é 'dark', o ícone do sol (representando o modo claro) deve ficar visível,
            // enquanto o ícone da lua (representando o modo escuro) deve desaparecer com uma rotação.
            iconSun.style.opacity = '1';
            iconSun.style.transform = 'rotate(0deg) scale(1)';
            iconMoon.style.opacity = '0';
            iconMoon.style.transform = 'rotate(90deg) scale(0.8)';
        } else {
            // Se o tema é 'light', o ícone do sol deve desaparecer,
            // e o ícone da lua deve ficar visível com sua transformação padrão.
            iconSun.style.opacity = '0';
            iconSun.style.transform = 'rotate(-90deg) scale(0.8)';
            iconMoon.style.opacity = '1';
            iconMoon.style.transform = 'rotate(0deg) scale(1)';
        }
    }
}