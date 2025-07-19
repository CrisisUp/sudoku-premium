// js/ui/_home-script.js
// Este é o script JavaScript exclusivo para a página inicial (Home) do Sudoku Premium (index.html).
// Sua principal responsabilidade é gerenciar a funcionalidade de alternância de tema (claro/escuro).
// Ele é projetado para ser leve e carregar apenas o necessário, evitando que a lógica completa do jogo
// seja carregada desnecessariamente na página Home, o que poderia causar conflitos ou lentidão.

/**
 * Função auxiliar para obter as referências aos elementos HTML necessários para a funcionalidade de tema.
 * Estes elementos são o botão principal de alternância de tema e os ícones de sol e lua contidos nele.
 * @returns {object} Um objeto contendo as referências `themeToggleBtn`, `iconSun` e `iconMoon`.
 */
function getThemeToggleElements() {
    return {
        themeToggleBtn: document.querySelector('.theme-toggle'), // O botão que o usuário clica para alternar o tema.
        iconSun: document.querySelector('.icon-sun'),           // O ícone que representa o tema claro (sol).
        iconMoon: document.querySelector('.icon-moon')          // O ícone que representa o tema escuro (lua).
    };
}

/**
 * Inicializa o tema da aplicação quando a página é carregada.
 * Esta função determina qual tema (claro ou escuro) deve ser aplicado com base em uma hierarquia de prioridades:
 * 1. Primeiro, tenta carregar um tema salvo nas preferências do navegador do usuário (via Local Storage).
 * 2. Se nenhum tema salvo for encontrado, verifica a preferência de tema do sistema operacional do usuário.
 * 3. Se nenhuma das opções anteriores se aplicar, o tema padrão é 'light' (claro).
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme'); // Tenta recuperar o tema salvo do Local Storage.
    // Verifica se o sistema operacional do usuário (macOS, Windows, etc.) está configurado para o modo escuro.
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Define o tema a ser aplicado: salvo > preferência do sistema > padrão (claro).
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme); // Aplica o atributo 'data-theme' ao elemento <html>, que o CSS usa para aplicar estilos.
    updateThemeIcons(theme); // Garante que o ícone correto (sol ou lua) seja exibido conforme o tema inicial.
}

/**
 * Alterna o tema da aplicação entre o modo 'dark' (escuro) e 'light' (claro).
 * Esta função é tipicamente chamada quando o botão de alternar tema é clicado pelo usuário.
 * A preferência do novo tema é então salva no Local Storage para ser lembrada em futuras visitas.
 */
function toggleTheme() {
    const html = document.documentElement; // Obtém uma referência ao elemento raiz `<html>` do documento.
    const currentTheme = html.getAttribute('data-theme'); // Lê o tema que está atualmente aplicado (do atributo `data-theme`).
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; // Decide qual será o próximo tema (o oposto do atual).

    html.setAttribute('data-theme', newTheme); // Aplica o novo tema ao elemento `<html>`.
    localStorage.setItem('theme', newTheme); // Salva o tema escolhido no Local Storage para que ele persista entre as sessões.

    updateThemeIcons(newTheme); // Atualiza a visibilidade e animação dos ícones de sol/lua para refletir o novo tema.
}

/**
 * Controla a opacidade e a transformação CSS dos ícones de sol e lua dentro do botão de alternar tema.
 * Esta função cria um efeito visual suave de transição entre os ícones e garante que apenas o ícone
 * relevante para o tema atual esteja visível, enquanto o outro está oculto e animado para fora.
 * @param {string} theme - O tema atual que está sendo aplicado ('dark' ou 'light').
 */
function updateThemeIcons(theme) {
    const { iconSun, iconMoon } = getThemeToggleElements(); // Obtém as referências dos elementos dos ícones.

    // Verifica se ambos os ícones existem no DOM para evitar erros ao tentar manipulá-los.
    if (iconSun && iconMoon) {
        if (theme === 'dark') {
            // No modo escuro: o ícone da lua (representando o modo escuro) fica visível e sem transformação.
            // O ícone do sol (representando o modo claro) desaparece e é "rotacionado para fora".
            iconSun.style.opacity = '1';
            iconSun.style.transform = 'rotate(0deg) scale(1)';
            iconMoon.style.opacity = '0';
            iconMoon.style.transform = 'rotate(90deg) scale(0.8)';
        } else {
            // No modo claro: o ícone do sol (representando o modo claro) fica visível e sem transformação.
            // O ícone da lua (representando o modo escuro) desaparece e é "rotacionado para fora".
            iconSun.style.opacity = '0';
            iconSun.style.transform = 'rotate(-90deg) scale(0.8)';
            iconMoon.style.opacity = '1';
            iconMoon.style.transform = 'rotate(0deg) scale(1)';
        }
    }
}

/**
 * Adiciona um ouvinte de evento para o momento em que o DOM (Document Object Model) estiver completamente carregado.
 * Isso garante que o script tente manipular os elementos HTML apenas depois que eles existirem na página.
 * Na página Home, ele inicializa o tema e configura o listener para o botão de alternar tema.
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme(); // Configura o tema da página assim que o DOM estiver pronto.
    const { themeToggleBtn } = getThemeToggleElements(); // Obtém a referência do botão de alternar tema.
    if (themeToggleBtn) { // Verifica se o botão existe no DOM para evitar erros.
        themeToggleBtn.addEventListener('click', toggleTheme); // Adiciona o listener de clique para alternar o tema.
    }
});