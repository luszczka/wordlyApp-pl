const letters = ['a', 'ą', 'b', 'c', 'ć', 'd', 'e', 'ę', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'ł', 'm', 'n', 'ń', 'o', 'ó', 'p', 'r', 's', 'ś', 't', 'q', 'u', 'w', 'v', 'x', 'y', 'z', 'ź', 'ż']
const words = ['afekt', 'afera', 'agawa', 'ajent', 'akcja', 'akord', 'akryl', 'alert', 'aloes', 'aktor', 'album', 'aleja', 'alkus', 'amant', 'ameba', 'amisz', 'amper', 'angaż', 'anime', 'aneks', 'antyk', 'aorta', 'areał', 'armia', 'astma', 'astra', 'atest', 'atuty', 'audyt', 'awizo', 'awers', "azoty", 'ażury']
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
        this.gameWon = false;
    }

    keyboardListener() {        
        document.addEventListener('keydown', (keyPressed) => {
            if (this.gameWon === true) {
                if (keyPressed.key == "Enter") {location.reload()}
                return;
            }
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
                if (this.gameWon === true) {
                    return;
                }
                this.typedLetter = keys[i].dataset.key;
                this.passTypedLetterToTile();
            });
        }
        backspaceButton.addEventListener("click",  () => {
            if (this.gameWon === true) {
                return;
            }
            this.backspaceTypedLetter();
        });
    
        submitButton.addEventListener("click",  () => {
            if (this.gameWon === true) {
                location.reload();
                return;
            }
            this.checkIfAllTilesInRow();
        });
    }

    passTypedLetterToTile() {
        if (this.gameWon === true) {
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
        if (this.gameWon === true) {
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
            if (this.gameWon === true) {
                return;
            }
            this.currentRow.children[k].style = "";
        }, 500);
    }

    letterMatch() {
        for (let k = 0; k < this.lettersLimit; k++) {
            if (this.currentRow.attributes.letters.value[k] == this.wordToGuess[k]) {
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
                    console.log("already green or orange");
                } else{
                    this.currentRow.children[k].classList.add("in-word"); 
                }
            } 
        }
    }

    // letterAlmostMatch() {
    //     let wordToArray = Array.from(this.currentRow.attributes.letters.value);
    //     let wordToGuessToArray = Array.from(this.wordToGuess);
        // for (let k = 0; k < this.lettersLimit; k++) {
        //     let found = wordToArray.some(letterMatch => wordToGuessToArray[k].includes(letterMatch));
        //     if (found) {this.currentRow.children[k].classList.add("in-word"); console.log(this.currentRow.children[k]);console.log("true")}
        //     wordToArray.shift();
        // }
        // for (let k = 0; k < this.lettersLimit; k++) {
        //     if (wordToArray[k] === wordToGuessToArray){
        //         console.log(this.currentRow.children[k]);
        //         console.log("aaa");
        //     }
        //     wordToArray.shift();
        // }
        // console.log(wordToGuessToArray.some(item => wordToArray.includes(item)))
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
        this.gameWon = true;
        alert("Correct!");
    }

    youLost() {
        this.gameWon = true;
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