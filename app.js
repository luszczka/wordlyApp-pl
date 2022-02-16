const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'q', 'u', 'w', 'v', 'x', 'y', 'z']
const words = ['afekt', 'afera', 'agawa', 'akord', 'alert', 'aktor', 'alkus', 'amant', 'ameba', 'amper', 'aorta', 'armia', 'audyt', 'awizo', 'awers']
const TILE_CONTAINER_CLASS = "guess-container";
const TILE_ROW_CLASS = "guess-row";
const TILE_CLASS = "guess-tile";
const REFRESH_CLASS = "refresh";

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
        let keys = document.querySelectorAll(`button[data-key]`);
        let backspaceButton = document.querySelector(`button[data-action="backspace"]`);
        let submitButton = document.querySelector(`button[data-action="submit"]`);
        for (let i = 0; i < keys.length; i++) {
            keys[i].addEventListener("click",  () => {
                this.typedLetter = keys[i].dataset.key;
                this.passTypedLetterToTile();
            });
        }
        backspaceButton.addEventListener("click",  () => {
            this.backspaceTypedLetter();
        });
        submitButton.addEventListener("click",  () => {
            this.checkIfAllTilesInRow();
        });
    }

    passTypedLetterToTile() {
        for (let j = 0; j < this.lettersLimit; j++) { // console log values here to check the nextRound issue
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
        if (this.currentRow.attributes.letters.value.length < 5) {
            return;
        }
        if (words.indexOf(this.currentRow.attributes.letters.value) < 0) {
            alert("nie mamy tego słowa w bazie!");
            return;
        }
        if (this.currentRow.attributes.letters.value == this.wordToGuess) {
            this.letterMatch();
            setTimeout(() => {this.youWin()}, 300);
            return;
            
        }
        console.log("word in words but not match");
        this.letterMatch();
        this.letterAlmostMatch();
        this.nextRound();
    }

    letterMatch() {
        for (let k = 0; k < this.lettersLimit; k++) {
            if (this.currentRow.attributes.letters.value[k] == this.wordToGuess[k]) {
                console.log(this.currentRow.attributes.letters.value[k]);
                if (this.currentRow.children[k].attributes.letter.value == this.wordToGuess[k]) {
                    this.currentRow.children[k].classList.add("match");
                } 
            }
        }
    }

    letterAlmostMatch() {
        for (let k = 0; k < this.lettersLimit; k++) {
            if (this.wordToGuess.includes(`${this.currentRow.children[k].attributes.letter.value}`)) {
                if (this.currentRow.children[k].classList.contains("match") || this.currentRow.children[k].classList.contains("in-word")) {
                    console.log("juz zielona lub pomaranczowa"); // orange display issue - to be fixed (count same letters and compare to its amount in word)
                } else{
                    this.currentRow.children[k].classList.add("in-word"); 
                }
            } 
        }
    }

    nextRound() {
        this.currentRound++;
    }

    youWin() {
        alert("Correct!");
        const refreshButton = document.querySelector(`.${REFRESH_CLASS}`);
        refreshButton.classList.add("display");
        refreshButton.addEventListener("click",  () => {
            location.reload();
        });
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