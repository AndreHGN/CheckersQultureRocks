Este é o meu código para o desafio proposto pela empresa Qulture Rocks como parte do processo seletivo para uma vaga de estágio. O intuito é desenvolver uma interface que permita que duas pessoas joguem Damas adequadamente, indicando quando é a vez de quem e quem é o vencedor ao fim da partida.

Como um projeto React padrão, os arquivos estão divididos em públicos e privados, sendo os arquivos no formato JavaScript  compõem principalmente as características do software. O arquivo index.js faz a ligação do arquivo html público com os arquivos privados. Utilizei o App.js como uma carcaça para o conteúdo do código para facilitar a programção das propriedades visuais da interface, usando o CSS de mesmo nome.

Na pasta components temos as partes que contém as funções e objetos do jogo. Primeiramente em piece.js está separado o construtor de cada objeto peça do jogo, separando em seus respectivos atributos. Agora em cell.js, temos a função que cria as células do tabuleiro, diferenciando as células claras e das escuras e já implementando a imagem de cada peça. Por fim, mas não menos importante, há o board.js que contém as várias funções que determinam o procedimento do jogo e é através delas que conseguimos interagir com cada componente pela interface do browser. Temos desde funções para inicializar o tabuleiro até para restringir as jogadas não permitidas. É o board.js que dita as regras do jogo e como os usuários vão conseguir jogar. A última coisa é o arquivo CSS que estiliza minimamente cada um dos commponentes citados. As imagens utilizadas para as peças estão no diretório de images na pasta pública.