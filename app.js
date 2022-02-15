const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'q', 'u', 'w', 'v', 'x', 'y', 'z']
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
            if (keyPressed.key == "Enter") {this.checkIfAllTilesInRow()};
            if (letters.indexOf(keyPressed.key) < 0) {
                return;
            }
            this.typedLetter = keyPressed.key;
            this.passTypedLetterToTile();
        });
    }

    clickedLetter() {
        let letters = document.querySelectorAll(`button[data-key]`);
        for (let i = 0; i < letters.length; i++) {
            letters[i].addEventListener("click",  () => {
                this.typedLetter = letters[i].dataset.key;
                this.passTypedLetterToTile();
            });
        }
    }

    passTypedLetterToTile() {
        for (let j = 0; j < this.lettersLimit; j++) {
            if (this.currentRow.children[j].attributes.letter.value == "") {
                this.passTypedLettersToTileRow();
                this.currentRow.children[j].attributes.letter.value = `${this.typedLetter}`
                this.currentRow.children[j].innerHTML = `${this.typedLetter}`;
                break;
            }
        }
    }

    passTypedLettersToTileRow() {
        let currentlyPassedLetters = this.currentRow.attributes.letters.value;
        this.currentRow.attributes.letters.value = `${currentlyPassedLetters}${this.typedLetter}`;
    }

    backspaceTypedLetter() {
        for (let j = this.lettersLimit - 1; j >= 0; j--) {
            if (!this.currentRow.children[j].attributes.letter.value == "") {
                this.currentRow.attributes.letters.textContent = `${this.currentRow.attributes.letters.textContent.slice(0, -1)}`;
                this.currentRow.children[j].attributes.letter.value = ``
                this.currentRow.children[j].innerHTML = ``;
                break;
            }
        }
    }

    checkIfAllTilesInRow() {      
        if (this.currentRow.children[0].attributes.letter.value == "" || this.currentRow.children[1].attributes.letter.value == "" || this.currentRow.children[2].attributes.letter.value == "" || this.currentRow.children[3].attributes.letter.value == "" || this.currentRow.children[4].attributes.letter.value == "") {
            return;
        }
        console.log("enter"); 
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