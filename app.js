const letters = ['a', 'ą', 'b', 'c', 'ć', 'd', 'e', 'ę', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'ł', 'm', 'n', 'ń', 'o', 'ó', 'p', 'r', 's', 'ś', 't', 'q', 'u', 'w', 'v', 'x', 'y', 'z', 'ź', 'ż']
const words = ['afekt', 'afera', 'agawa', 'ajent', 'akcja', 'akord', 'akryl', 'alert', 'aloes', 'aktor', 'album', 'aleja', 'alkus', 'amant', 'ameba', 'amisz', 'amper', 'angaż', 'anime', 'aneks', 'antyk', 'aorta', 'arbuz', 'areał', 'armia', 'astma', 'astra', 'atest', 'audyt', 'awizo', 'awers', "azoty"]
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
        this.gameOver = false;
    }

    keyboardListener() {        
        document.addEventListener('keydown', (keyPressed) => {
            if (this.gameOver === true) {
                if (keyPressed.key == "Enter") {location.reload()}
                return;
            }
            if (keyPressed.key == "Backspace") {this.backspaceTypedLetter()};
            if (keyPressed.key == "Enter") {this.checkIfAllTilesInRow()};
            if (letters.indexOf(keyPressed.key) < 0) {
                return;
            }
            this.typedLetter = keyPressed.key;
            this.showKeyPressedOnScreen();
            this.passTypedLetterToTile();
        });
    }

    showKeyPressedOnScreen() {
        let pressedKey = document.querySelector(`button[data-key="${this.typedLetter}"]`);
        pressedKey.classList.add("clicked");
        setTimeout(() => {pressedKey.classList.remove("clicked")}, 200);
    }

    changeKeyboardKeyColorAfterSubmission(letter, status) {
        let pressedKey = document.querySelector(`button[data-key="${letter}"]`);
        if (status == "not-matched") {
            pressedKey.classList.add("not-matched");
            return;
        }
        if (status == "almostMatched") {
            pressedKey.classList.add("almost-matched");
            return;
        }
        if (status == "matched") {
            pressedKey.classList.add("matched");
            return;
        }
    }

    clickedLetter() {
        let keys = document.querySelectorAll(`button[data-key]`);
        let backspaceButton = document.querySelector(`button[data-action="backspace"]`);
        let submitButton = document.querySelector(`button[data-action="submit"]`);
        for (let i = 0; i < keys.length; i++) {
            keys[i].addEventListener("click", () => {
                if (this.gameOver === true) {
                    return;
                }
                this.typedLetter = keys[i].dataset.key;
                this.passTypedLetterToTile();
            });
        }
        backspaceButton.addEventListener("click", () => {
            if (this.gameOver === true) {
                return;
            }
            this.backspaceTypedLetter();
        });
    
        submitButton.addEventListener("click", () => {
            if (this.gameOver === true) {
                location.reload();
                return;
            }
            this.checkIfAllTilesInRow();
        });
    }

    passTypedLetterToTile() {
        if (this.gameOver === true) {
            return;
        }
        for (let j = 0; j < this.lettersLimit; j++) {
            if (this.currentRow.children[j].attributes.letter.value == "") {
                this.passTypedLettersToTileRow();
                this.currentRow.children[j].classList.add("guessing");
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
                this.currentRow.children[j].classList.remove("guessing");
                this.currentRow.attributes.letters.textContent = `${this.currentRow.attributes.letters.textContent.slice(0, -1)}`;
                this.currentRow.children[j].attributes.letter.value = ``
                this.currentRow.children[j].innerHTML = ``;
                break;
            }
        }
    }

    checkIfAllTilesInRow() {  
        if (this.gameOver === true) {
            return;
        }
        this.setAnimation(this.currentRow.children, 'popping', '.5s')
        if (this.currentRow.attributes.letters.value.length < 5) {
            this.setAnimation(this.currentRow.children, 'colorChange', '.3s')
            return;
        }
        // fix na pomaranczowe pola --> zamienic całe wpisane slowo na arrayke i kolejno wyrzucać litery przy sprawdzaniu
        if (words.indexOf(this.currentRow.attributes.letters.value) < 0) {
            this.setAnimation(this.currentRow.children, 'colorChange', '.3s')
            alert("nie mamy tego słowa w bazie!");
            return;
        }
        if (this.currentRow.attributes.letters.value == this.wordToGuess) {
            this.letterMatch();
            setTimeout(() => {this.youWin()}, 300);
            return;
        }
        this.letterMatch();
        this.letterAlmostMatch();
        this.nextRound();
    }

    setAnimation(element, animationName, durance) {
        for (let k = 0; k < this.lettersLimit; k++) {
            element[k].style.animation = `${animationName} ${durance}`;
            this.clearAnimation(k);
        }
    }

    clearAnimation(k) { 
        setTimeout(() => {
            if (this.gameOver === true) {
                return;
            }
            this.currentRow.children[k].style = "";
        }, 500);
    }

    letterMatch() {
        for (let k = 0; k < this.lettersLimit; k++) {
            this.changeKeyboardKeyColorAfterSubmission(this.currentRow.children[k].attributes.letter.value, "not-matched");
            if (this.currentRow.attributes.letters.value[k] == this.wordToGuess[k]) {
                if (this.currentRow.children[k].attributes.letter.value == this.wordToGuess[k]) {
                    this.currentRow.children[k].classList.add("match");
                    this.changeKeyboardKeyColorAfterSubmission(this.currentRow.children[k].attributes.letter.value, "matched");
                }
            }
        }
    }

    letterAlmostMatch() {
        const wordToArray = Array.from(this.currentRow.attributes.letters.value);
        const wordToGuessToArray = Array.from(this.wordToGuess);
        const found = wordToArray.filter(letterMatch => wordToGuessToArray.includes(letterMatch));
        if (!found) {
            return;
        } 
        const counts = {};
        found.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

        const countsToGuess = {};
        wordToGuessToArray.forEach(function (x) { countsToGuess[x] = (countsToGuess[x] || 0) + 1; });
        
        for (let k = 0; k < this.lettersLimit; k++) {
            for (let j = 0; j < found.length; j++) {   
                if (found[j] == null) {
                    return;
                }
                const elementOfFound = found[j];
                const pushElementOfFound = counts[elementOfFound];
                const elementOfSearched = countsToGuess[elementOfFound];
                if (pushElementOfFound > elementOfSearched) {
                    found.splice(found[j], 1);
                }
                if (this.currentRow.children[k].attributes.letter.value == found[j]) {
                    this.currentRow.children[k].classList.add("in-word");
                    this.changeKeyboardKeyColorAfterSubmission(this.currentRow.children[k].attributes.letter.value, "almostMatched");
                }
            }
        }
    }

    nextRound() {
        this.currentRound++;
        this.currentRow = this.allRows[this.currentRound-1];
        if (this.currentRound > this.roundsLimit) {
            setTimeout(() => {this.youLost()}, 300);
            return;
        }
    }

    youWin() {
        this.gameOver = true;
        alert("Correct!");
    }

    youLost() {
        this.gameOver = true;
        alert("You lost!");
    }

    restartGame() {
        const refreshButton = document.querySelector(`.${REFRESH_CLASS}`);
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
        this.restartGame();
        this.showWordToGuess();
    }
}

const newGame = new Game();
newGame.runGame();
// game is key sensitive - only small letters alowed
// orange color is not working correctly 