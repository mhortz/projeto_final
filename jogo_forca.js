//Criar um jogo da forca usando OO;
//Pelo menos três classes para três entidades presentes no sistema do jogo (GameController, Player e Match);
//O usuário deve poder chutar a palavra de uma vez;
//O usuário deve poder jogar/tentar novamente (reiniciar);
//Deve haver uma dica ou tema visualmente indicados;
//O jogo deve possuir pontuação;
// O GameController seria responsável por iniciar e reiniciar a partida
// Match seria a representação da partida em si
// Player seria o jogador
// const prompt = require('prompt-sync')();

const prompt = require('prompt-sync')();

class GameController {
  constructor() {
    this.match = null;
    this.player = null;
    this.wordGenerator = new WordGenerator();
    this.playerName = null;
  }

  startGame() {
    if (!this.playerName) {
      console.log('Bem-vindo ao Jogo da Forca!');
      this.playerName = prompt('Digite seu nome: ');
    } else {
      console.log(`Bem-vindo de volta, ${this.playerName}!`);
    }

    this.player = new Player(this.playerName);
    this.play();
  }

  play() {
    const theme = this.wordGenerator.getRandomTheme();
    this.match = new Match(this.wordGenerator.generateRandomWord(theme));

    while (!this.match.isGameOver()) {
      console.log(`\nTentativas restantes: ${this.match.remainingAttempts}`);
      console.log(`Tema: ${theme}`);
      console.log(`Palavra atual: ${this.match.displayWord()}`);
      
      const guess = prompt('Digite uma letra ou chute a palavra: ').toLowerCase();
      
      if (guess.length === 1) {
        this.match.makeGuess(guess);
      } else if (guess.length > 1) {
        if (this.match.checkWord(guess)) {
          console.log('Parabéns! Você acertou a palavra!');
          break;
        } else {
          console.log('Você errou a palavra.');
        }
      }
    }

    this.endGame();
  }

  endGame() {
    if (this.match.isGameWon()) {
      console.log('Parabéns! Você venceu!');
    } else {
      console.log(`Fim de jogo! A palavra correta era: ${this.match.word}`);
    }

    const playAgain = prompt('Quer jogar novamente? (s/n): ').toLowerCase();
    if (playAgain === 's') {
      this.playAgain();
    } else {
      console.log('Obrigado por jogar!');
    }
  }

  playAgain() {
    this.startGame();
  }
}

class WordGenerator {
  constructor() {
    this.themes = ['animais', 'frutas', 'paises'];
  }

  getRandomTheme() {
    return this.themes[Math.floor(Math.random() * this.themes.length)];
  }

  generateRandomWord(theme) {
    // Lógica para gerar uma palavra aleatória com base no tema
    const themeWords = {
      animais: ['leao', 'elefante', 'girafa', 'tigre'],
      frutas: ['banana', 'maca', 'uva', 'abacaxi'],
      paises: ['brasil', 'eua', 'franca', 'italia']
    };

    return themeWords[theme][Math.floor(Math.random() * themeWords[theme].length)];
  }
}

class Match {
  constructor(word) {
    this.word = word;
    this.remainingAttempts = 6;
    this.guessedLetters = new Set();
  }

  makeGuess(letter) {
    if (!this.guessedLetters.has(letter)) {
      this.guessedLetters.add(letter);

      if (!this.word.includes(letter)) {
        this.remainingAttempts--;
        console.log('Letra incorreta!');
      }
    } else {
      console.log('Você já tentou essa letra. Tente novamente.');
    }
  }

  checkWord(guess) {
    return guess === this.word;
  }

  isGameOver() {
    return this.remainingAttempts === 0 || this.isGameWon();
  }

  isGameWon() {
    return this.word.split('').every(letter => this.guessedLetters.has(letter));
  }

  displayWord() {
    return this.word.split('').map(letter => (this.guessedLetters.has(letter) ? letter : '_')).join(' ');
  }
}

class Player {
  constructor(name) {
    this.name = name;
  }
}

// Iniciar o jogo
const gameController = new GameController();
gameController.startGame();
