const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'q', 'u', 'w', 'x', 'y', 'z']
const words = ['afekt', 'afera', 'agawa', 'akord', 'alert', 'aktor', 'alkus', 'amant', ' ameba', 'amper', 'aorta', 'armia', 'audyt', 'awizo', 'awers']
const TILE_CONTAINER_CLASS = "guess-container";
const TILE_ROW_CLASS = "guess-row";
const TILE_CLASS = "guess-tile";

class Game{
    constructor() {
        this.wordToGuess = words[Math.floor(Math.random() * words.length)];
        this.allRows = document.querySelectorAll(`.${TILE_ROW_CLASS}`);
        this.lettersLimit = 5;
        this.currentRound = 1;
        this.roundsLimit = 6;
        this.typedLetter;
        this.currentRow = this.allRows[this.currentRound-1];
    }

    keyboardListener() {
        document.addEventListener('keydown', (keyPressed) => {
            if (keyPressed.key == "Backspace") {this.backspaceTypedLetter()};
            if (letters.indexOf(keyPressed.key) < 0) {
                return;
            }
            this.typedLetter = keyPressed.key; // filtrować i wyciągnąć z interakcji znaki niepotrzebne
            this.passTypedLetterToTile();
        });
    }

    clickedLetter() {
        let letters = document.querySelectorAll(`button[data-key]`);
        for (let i = 0; i < letters.length; i++) {
            letters[i].addEventListener("click", function() {
                this.typedLetter = letters[i].dataset.key;
                console.log(this.typedLetter);
                this.passTypedLetterToTile();
            });
        }
    }

    passTypedLetterToTile() {
        for (let j = 0; j < this.lettersLimit; j++) {
            if (this.currentRow.children[j].attributes.letter.value == "") {
                this.currentRow.children[j].attributes.letter.value = `${this.typedLetter}`
                this.currentRow.children[j].innerHTML = `${this.typedLetter}`;
                console.log(this.currentRow.children[j].attributes.letter.value);
                break;
            }
        }
    }

    backspaceTypedLetter() {
        for (let j = this.lettersLimit - 1; j >= 0; j--) {
            if (!this.currentRow.children[j].attributes.letter.value == "") {
                this.currentRow.children[j].attributes.letter.value = ``
                this.currentRow.children[j].innerHTML = ``;
                break;
            }
        }
    }

    showWordToGuess() {
        console.log(this.wordToGuess);
    }

    runGame() {
        this.keyboardListener();
        this.clickedLetter();
        this.showWordToGuess();
    }
}

const newGame = new Game();
newGame.runGame();