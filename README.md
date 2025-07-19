# Sudoku Premium
### ✨ Onde a Lógica Encontra a Elegância ✨

---

## Visão Geral

O Sudoku Premium é mais que um simples jogo de Sudoku; é uma **experiência imersiva** projetada com foco em **excelência de UX (User Experience)** e **qualidade de código**. Desafie sua mente com quebra-cabeças lógicos em uma interface moderna, intuitiva e totalmente responsiva. Mergulhe em um passatempo clássico reinventado com um toque premium de elegância e funcionalidade.

---

## Funcionalidades

Descubra o que torna o Sudoku Premium uma experiência única:

* **Múltiplos Níveis de Dificuldade:** Escolha entre Fácil, Médio e Difícil para adequar o desafio ao seu nível de habilidade.
* **Alternância de Tema (Claro/Escuro):** Jogue confortavelmente em qualquer ambiente, com um sistema de temas que se adapta às suas preferências (e até mesmo às do seu sistema operacional!).
* **Suporte Total a Teclado:** Navegue pelas células, insira números e use dicas diretamente pelo seu teclado, para uma jogabilidade fluida e acessível.
* **Feedback Visual Inteligente:** Receba informações claras na tela com destaque para células selecionadas, realce de linhas/colunas/blocos relacionados, marcação de erros e animações suaves.
* **Contador de Tempo de Partida:** Acompanhe seu desempenho com um temporizador preciso e visualize seu tempo final de resolução por alguns segundos após cada vitória.
* **Mensagens de Notificação Dinâmicas:** Receba feedback instantâneo sobre seu progresso, erros, uso de dicas e a conclusão do jogo, tudo de forma clara e contextual.
* **Botões de Ação Intuitivos:** Tenha o controle na ponta dos seus dedos com opções para **Verificar** a solução, pedir uma **Dica** estratégica ou **Resolver** o tabuleiro se estiver preso.

---

## A Fascinante História do Sudoku

Você sabia que o Sudoku não nasceu no Japão, como muitos pensam? A ideia por trás do Sudoku surgiu pela primeira vez no século XVIII, com o matemático suíço **Leonhard Euler**. Ele criou algo parecido com o que conhecemos hoje como "Quadrados Latinos", um conceito que explora a organização de números em um grid sem repetições.

No entanto, a versão moderna do quebra-cabeça numérico, com blocos 3x3, foi publicada em 1979 nos Estados Unidos, sob o nome de "Number Place", por Howard Garns. A popularidade explodiu anos mais tarde, no Japão, em meados da década de 1980, onde recebeu o nome de **"Sudoku"**, uma abreviação para "Sūji wa dokushin ni kagiru" (数独), que significa "os números devem ser únicos".

Desde então, o Sudoku conquistou o mundo, tornando-se um passatempo global que exercita o raciocínio lógico e a paciência de milhões de pessoas diariamente. No **Sudoku Premium**, trazemos essa rica história para uma interface moderna e intuitiva, garantindo que cada partida seja uma jornada de descoberta.

---

## Tecnologias Utilizadas

O Sudoku Premium foi desenvolvido utilizando as seguintes tecnologias e boas práticas:

* **HTML5:** Para a estruturação semântica do conteúdo e interface do jogo.
* **CSS3:**
    * **Custom Properties (Variáveis CSS):** Essenciais para um sistema de temas robusto (claro e escuro) e para garantir consistência em espaçamentos, cores e tipografia.
    * **Flexbox & Grid Layout:** Utilizados para criar layouts complexos e responsivos, como o tabuleiro de Sudoku e o painel lateral, que se adaptam a diferentes tamanhos de tela.
    * **Media Queries:** Para garantir uma experiência de usuário otimizada em dispositivos móveis e desktops.
    * **Transições e Animações:** Para um feedback visual suave e elegante durante as interações.
* **JavaScript (ES6+):**
    * **ES6 Modules (`import`/`export`):** Para uma arquitetura de código modular, organizada e de fácil manutenção, separando as funcionalidades em módulos coesos (lógica do tabuleiro, gerenciamento de estado, UI, utilitários, etc.).
    * **Manipulação do DOM:** Interação dinâmica com a interface do usuário.
    * **Lógica de Jogo e Algoritmos:** Implementação de algoritmos de geração e resolução de Sudoku (backtracking).
    * **Gerenciamento de Estado Centralizado:** Utilização de getters e setters para controlar o estado do jogo de forma previsível.

---

## Estrutura do Projeto

A arquitetura do projeto foi pensada para promover **código limpo, modularidade e fácil manutenção**. O projeto é organizado em diretórios lógicos, onde cada arquivo tem uma responsabilidade bem definida.

```bash
├── css/                  # Contém todos os arquivos de estilo CSS.
│   ├── abstracts/        # Variáveis globais de design (cores, espaçamentos, etc.).
│   │   ├── _variables.css
│   │   └── ...
│   ├── base/             # Estilos base (reset, tipografia) e globais.
│   │   ├── _reset.css
│   │   ├── _typography.css
│   │   └── ...
│   ├── components/       # Estilos para componentes UI reutilizáveis (botões, seletores).
│   │   ├── _buttons.css
│   │   ├── _select.css
│   │   ├── _theme-toggle.css
│   │   └── ...
│   ├── layout/           # Estilos para a estrutura e layout principais das páginas.
│   │   ├── _game-container.css
│   │   ├── _sudoku-grid.css
│   │   ├── _side-panel.css
│   │   └── ...
│   ├── pages/            # Estilos específicos para páginas (ex: Home).
│   │   ├── _home.css
│   │   └── ...
│   └── themes/           # Definições de cores para diferentes temas (claro/escuro).
│       ├── theme-dark.css
│       ├── theme-light.css
│       └── ...
├── js/                   # Contém todos os arquivos JavaScript.
│   ├── app.js            # Ponto de entrada principal do JS para a página do jogo.
│   ├── game/             # Módulos com a lógica central do jogo.
│   │   ├── _board-logic.js    # Geração e resolução do tabuleiro.
│   │   ├── _game-actions.js   # Ações do jogador (verificar, dica, resolver).
│   │   ├── _game-play.js      # Interação do jogador com as células (cliques, input).
│   │   ├── _game-state.js     # Gerenciamento centralizado de todas as variáveis de estado do jogo.
│   │   ├── _timer.js          # Lógica do temporizador da partida.
│   │   └── ...
│   ├── ui/               # Módulos JavaScript para manipulação da interface de usuário.
│   │   ├── _home-script.js    # Script exclusivo para a página Home (lógica de tema).
│   │   ├── _message-display.js# Exibição de mensagens e estado das dicas.
│   │   ├── _render-grid.js    # Renderização e atualização visual do grid.
│   │   └── ...
│   ├── utils/            # Módulos com funções utilitárias e constantes.
│   │   ├── _dom-elements.js   # Centraliza as referências aos elementos do DOM.
│   │   ├── _helpers.js        # Funções auxiliares (embaralhar array, validações).
│   │   └── ...
├── index.html            # Página inicial do projeto (Home).
├── game.html             # Página principal do jogo Sudoku.
└── README.md             # Este arquivo de documentação.

```

---

## Como Rodar o Projeto Localmente

Para testar e interagir com o Sudoku Premium em seu computador, siga os passos abaixo:

### Pré-requisitos

Você precisará de um ambiente que possa servir arquivos HTML, CSS e JavaScript localmente. A forma mais fácil é usando a extensão **Live Server** para Visual Studio Code.

* **Visual Studio Code:** Baixe e instale o VS Code em [code.visualstudio.com](https://code.visualstudio.com/).
* **Live Server Extension:** No VS Code, vá para a aba de Extensões (Ctrl+Shift+X ou Cmd+Shift+X) e procure por "Live Server" (por Ritwick Dey). Instale-a.

### Passos para Rodar

1.  **Clone o Repositório:**
    Abra seu terminal ou Git Bash e clone o projeto para o seu computador:
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git) # Substitua pelo link do seu repositório
    ```
    Navegue até a pasta do projeto:
    ```bash
    cd SEU_REPOSITORIO
    ```

2.  **Abra o Projeto no VS Code:**
    No terminal, dentro da pasta do projeto, digite:
    ```bash
    code .
    ```
    Isso abrirá a pasta do projeto no VS Code.

3.  **Inicie o Live Server:**
    Dentro do VS Code, clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**. Alternativamente, você pode clicar no botão **"Go Live"** na barra de status inferior do VS Code.

4.  **Acesse no Navegador:**
    Seu navegador padrão abrirá automaticamente o projeto em um endereço como `http://127.0.0.1:5500/index.html` (a porta pode variar).

---

## Deploy

O Sudoku Premium pode ser facilmente implantado online para que o jogo esteja acessível a qualquer momento.

### Vercel

Este projeto é ideal para ser hospedado na **Vercel** devido à sua natureza estática (HTML, CSS, JS puro) e ao suporte a deploy contínuo (CI/CD) integrado com o GitHub.

* **Passos para Deploy na Vercel:**
    1.  Crie uma conta gratuita na [Vercel](https://vercel.com/).
    2.  No painel da Vercel, clique em "Add New Project".
    3.  Conecte seu repositório do GitHub (`SEU_USUARIO/SEU_REPOSITORIO`).
    4.  A Vercel detectará automaticamente as configurações do projeto. Clique em "Deploy".
    5.  Após o deploy, você receberá um URL (`seu-projeto-nome.vercel.app`) para acessar seu Sudoku online.

### GitHub Pages (Alternativa)

Como alternativa, você pode hospedar o projeto diretamente usando o **GitHub Pages**, uma forma simples e gratuita de publicar sites estáticos diretamente do seu repositório GitHub.

* **Passos para Deploy no GitHub Pages:**
    1.  No seu repositório GitHub, vá em `Settings` (Configurações).
    2.  Clique em `Pages` na barra lateral esquerda.
    3.  Em "Source", selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
    4.  Clique em "Save" (Salvar). Seu site estará disponível em `https://SEU_USUARIO.github.io/SEU_REPOSITORIO/` em poucos minutos.

---

## Boas Práticas e Qualidade de Código

O Sudoku Premium foi desenvolvido com uma forte ênfase em **boas práticas de engenharia de software** e **qualidade de código**, resultando em uma base robusta, escalável e de fácil manutenção.

* **Código Limpo e Modularização:**
    * **JavaScript (ES6 Modules):** O código JavaScript é estritamente modularizado, dividindo as funcionalidades em pequenos arquivos (`.js`) com responsabilidades únicas e bem definidas (ex: `_game-state.js` para gerenciamento de estado, `_board-logic.js` para algoritmos de Sudoku, `_render-grid.js` para renderização da UI). Isso facilita a compreensão, o teste e a depuração, além de promover a reutilização de código.
    * **CSS Modularizado:** Os estilos CSS são organizados em arquivos separados por responsabilidade (abstrações, base, componentes, layout, temas, páginas), importados de forma coesa através de um arquivo `base.css` principal. Isso otimiza a manutenção e a aplicação de temas.

* **Design System com CSS Custom Properties (Variáveis CSS):**
    * A aplicação utiliza um sistema de design baseado em **Custom Properties do CSS**, definindo cores, espaçamentos, raios de borda e sombras de forma centralizada.
    * Isso permite a criação de um **sistema de temas robusto e flexível** (claro e escuro), onde a mudança de paleta de cores é simples e consistente em toda a aplicação.

* **Gerenciamento de Estado Centralizado (JavaScript):**
    * Todas as variáveis críticas do jogo (tabuleiro atual, solução, células dadas, status de fim de jogo, dicas) são gerenciadas de forma centralizada no módulo `_game-state.js`.
    * O acesso e a modificação dessas variáveis são feitos exclusivamente através de funções **getters (para leitura)** e **setters (para escrita)**. Isso garante a previsibilidade do estado, evita inconsistências e facilita a depuração.

* **Foco em Responsividade:**
    * Utilização de **Flexbox, CSS Grid** e **Media Queries** para garantir que a interface do jogo se adapte e ofereça uma excelente experiência de usuário em diferentes tamanhos de tela, desde desktops grandes até dispositivos móveis.

* **Acessibilidade (A11y) e User Experience (UX):**
    * **Navegação por Teclado:** Elementos interativos são acessíveis via teclado, com foco visual claro (`:focus-visible`).
    * **Feedback Visual:** Elementos como o destaque de células selecionadas/relacionadas, marcação de erros e animações suaves fornecem feedback visual intuitivo ao jogador.
    * **Mensagens Contextuais:** As mensagens na tela são dinâmicas, claras e informativas, guiando o usuário durante o jogo e ao final da partida.
    * **Botões Semânticos e Estilizados:** Botões claros com estados de interação (`:hover`, `:active`) e ícones SVG.

* **Clareza e Legibilidade do Código:**
    * **Nomenclatura Semântica:** Variáveis, funções e classes são nomeadas de forma clara e descritiva, refletindo seu propósito (`handleCellClick`, `generatePuzzle`, `messageDisplay`).
    * **Comentários Didáticos:** O código é amplamente comentado, explicando não apenas *o quê* cada seção faz, mas *por que* certas decisões foram tomadas, facilitando o entendimento e a manutenção futura.