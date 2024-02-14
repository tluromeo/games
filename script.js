window.onload = function() {
    // Initialize games in a hidden state
    document.getElementById("wordle-game").style.display = 'none';
    document.getElementById("connections-game").style.display = 'none';
};

let wordleInitialized = false;
let wordleGameOver = false;

function initializeWordleGame() {
    if (!wordleInitialized) {
        attempts = 0;
        currentRow = 0;
        currentCell = 0;
        document.getElementById("wordle-board").innerHTML = '';
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("div");
            row.className = "wordle-row";
            for (let j = 0; j < 5; j++) {
                let cell = document.createElement("div");
                cell.className = "wordle-cell";
                row.appendChild(cell);
            }
            document.getElementById("wordle-board").appendChild(row);
        }
        wordleInitialized = true;
    }
}

function showGame(gameId) {
    document.getElementById("home-screen").style.display = 'none';
    document.getElementById("wordle-game").style.display = 'none';
    document.getElementById("connections-game").style.display = 'none';

    document.getElementById(gameId).style.display = 'block';

    if (gameId === 'wordle-game' && !wordleInitialized) {
        initializeWordleGame();
    } else if (gameId === 'connections-game') {
        startConnections();
    }
}

function showHome() {
    document.getElementById("home-screen").style.display = 'block';
    document.getElementById("wordle-game").style.display = 'none';
    document.getElementById("connections-game").style.display = 'none';
}



let targetWord = 'slate'; // Hardcoded target word

let attempts = 0;
let currentRow = 0;
let currentCell = 0;

function startWordle() {
    document.getElementById("start-button").style.display = 'none'; // Hide the start button

    attempts = 0;
    currentRow = 0;
    currentCell = 0;
    document.getElementById("wordle-board").innerHTML = '';
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div");
        row.className = "wordle-row";
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("div");
            cell.className = "wordle-cell";
            row.appendChild(cell);
        }
        document.getElementById("wordle-board").appendChild(row);
    }
}


document.addEventListener('keydown', function(event) {
    if (wordleGameOver) return;
    let rows = document.getElementsByClassName("wordle-row");
    let currentRowCells = rows[currentRow].getElementsByClassName("wordle-cell");

    if (event.key === 'Enter') {
        submitGuess();
    } else if (event.key === 'Backspace') {
        deleteLetter();
    } else if (/^[a-zA-Z]$/.test(event.key) && currentCell < 5) {
        currentRowCells[currentCell].innerText = event.key.toUpperCase();
        currentCell++;
    }
});

function deleteLetter() {
    if (currentCell > 0) {
        let rows = document.getElementsByClassName("wordle-row");
        let currentRowCells = rows[currentRow].getElementsByClassName("wordle-cell");
        currentCell--;
        currentRowCells[currentCell].innerText = '';
    }
}

function submitGuess() {
    if (wordleGameOver) {
        return; // Exit if the game is already over
    }
    if (currentCell === 5) {
        let guess = '';
        let rows = document.getElementsByClassName("wordle-row");
        let currentRowCells = rows[currentRow].getElementsByClassName("wordle-cell");

        for (let i = 0; i < 5; i++) {
            guess += currentRowCells[i].innerText.toLowerCase();
        }

        let feedback = checkWord(guess);
        for (let i = 0; i < 5; i++) {
            currentRowCells[i].style.backgroundColor = getColor(feedback[i]);
        }

        let isGameOver = guess === targetWord || currentRow === 5;
        
        currentRow++;
        currentCell = 0;

        // Delay the alert message to allow the feedback colors to be seen first
        setTimeout(function() {
            if (isGameOver) {
                let message = guess === targetWord ? "Congratulations! You guessed the word: \"" + targetWord + "\"" : "Game over! The word was \"" + targetWord + "\"";
                alert(message);
                wordleGameOver = true; // Set the flag when the game ends
            }
        }, 300); // Delay can be adjusted as needed
    } else {
        alert("Please enter a 5-letter guess");
    }
}


function checkWord(guess) {
    let feedback = Array(5).fill('B'); // Start with all letters marked as incorrect
    let targetWordLetters = targetWord.split('');

    // First pass: mark all correctly positioned letters
    for (let i = 0; i < 5; i++) {
        if (guess[i] === targetWord[i]) {
            feedback[i] = 'G'; // Letter is correct and in the correct position
            targetWordLetters[i] = null; // Remove this letter from consideration in the second pass
        }
    }

    // Second pass: mark correct letters in the wrong position
    for (let i = 0; i < 5; i++) {
        if (feedback[i] !== 'G' && targetWordLetters.includes(guess[i])) {
            feedback[i] = 'Y'; // Letter is correct but in the wrong position
            // Remove the first occurrence of this letter from further consideration
            targetWordLetters[targetWordLetters.indexOf(guess[i])] = null;
        }
    }

    return feedback.join('');
}



function getColor(feedbackChar) {
    switch (feedbackChar) {
        case 'G':
            return 'green';
        case 'Y':
            return 'yellow';
        case 'B':
            return 'grey';
        default:
            return 'transparent';
    }
}




const connectionsWords = [
    "apple", "pear", "orange", "banana", 
    "tomato", "carrot", "broccoli", "celery", 
    "paris", "london", "amsterdam", "stockholm", 
    "bed", "pillow", "blanket", "sheets"
];
let selectedWords = [];



let connectionsInitialized = false;
let connectionsGameOver = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function startConnections() {
    if (!connectionsInitialized) {
        const board = document.getElementById("connections-board");
        board.innerHTML = '';

        // Shuffle the array of words multiple times
        for (let i = 0; i < 3; i++) { // Shuffle three times for more randomness
            shuffleArray(connectionsWords);
        }

        connectionsWords.forEach(word => {
            let tile = document.createElement("div");
            tile.innerText = word;
            tile.className = "connections-tile";
            tile.onclick = function() { selectWord(word, tile); };
            board.appendChild(tile);
        });

        connectionsInitialized = true;
    }
}



function showGame(gameId) {
    document.getElementById("home-screen").style.display = 'none';
    document.getElementById("wordle-game").style.display = 'none';
    document.getElementById("connections-game").style.display = 'none';

    document.getElementById(gameId).style.display = 'block';

    if (gameId === 'wordle-game' && !wordleInitialized) {
        initializeWordleGame();
    } else if (gameId === 'connections-game' && !connectionsInitialized) {
        startConnections();
    }
}

function selectWord(word, tile) {
    if (connectionsGameOver) return;
    if (selectedWords.includes(word)) {
        // Deselect the word if it's already selected
        selectedWords = selectedWords.filter(w => w !== word);
        tile.classList.remove("selected");
    } else {
        // Select a new word only if there are less than 4 words already selected
        if (selectedWords.length < 4) {
            selectedWords.push(word);
            tile.classList.add("selected");
        }
    }
}

// things that keep you warm: goose, sweater, hugs, engine
// ada poems: raincoat, lover, endlessness, conditional
// 
// 

const categories = {
    'fruit': ['apple', 'pear', 'orange', 'banana'],
    'vegetables': ['tomato', 'carrot', 'broccoli', 'celery'],
    'europe_capitals': ['paris', 'london', 'amsterdam', 'stockholm'],
    'sleeping': ['bed', 'pillow', 'blanket', 'sheets']
};
let lives = 4;
let correctlyGuessedCategories = [];




function checkConnections() {
    if (connectionsGameOver) {
        return; // Exit if the game is already over
    }
    // Check if exactly four words are selected
    if (selectedWords.length !== 4) {
        alert("You must select exactly 4 words to make a guess.");
        return; // Exit the function without checking the guess
    }

    let isCorrect = false;
    for (let category in categories) {
        if (categories[category].every(word => selectedWords.includes(word))) {
            isCorrect = true;
            correctlyGuessedCategories.push(...categories[category]);
            createCategoryTile(category);
            removeGuessedWords(category);
            selectedWords = []; // Reset selected words for the next attempt
            break;
        }
    }

    if (!isCorrect) {
        lives--;
        updateLivesDisplay();
    }

    setTimeout(() => {
        // Check if all categories have been guessed correctly
        if (correctlyGuessedCategories.length === Object.keys(categories).length * 4) {
            connectionsGameOver = true;
            alert("Congratulations! You've correctly guessed all categories!");
        }
    }, 500); // Adjust the delay as needed

    if (lives === 0) {
        alert("Game over!");
        connectionsGameOver = true;
        // Optionally, reset the game or offer a retry
    }


}



function updateLivesDisplay() {
    const lifeIndicators = document.querySelectorAll("#lives-container .life");
    // Fade out the rightmost life indicator first
    if (lives >= 0 && lives < lifeIndicators.length) {
        lifeIndicators[lifeIndicators.length - (4 - lives)].style.opacity = '0';
    }
}



function createCategoryTile(categoryName) {
    const board = document.getElementById("connections-board");
    let categoryTile = document.createElement("div");
    categoryTile.className = "category-tile " + categoryName;

    // Category name
    let title = document.createElement("div");
    title.innerText = categoryName;
    title.className = "category-title";
    categoryTile.appendChild(title);

    // Comma-separated list of items
    let itemsText = document.createElement("div");
    itemsText.innerText = categories[categoryName].join(", ");
    categoryTile.appendChild(itemsText);

    // Determine the insert position based on the number of category tiles already present
    let existingCategoryTiles = board.getElementsByClassName("category-tile").length;
    let insertPosition = board.children[existingCategoryTiles]; // Element to insert before

    if (insertPosition) {
        board.insertBefore(categoryTile, insertPosition);
    } else {
        board.appendChild(categoryTile); // If no tiles, append at the end
    }
}




function removeGuessedWords(category) {
    const board = document.getElementById("connections-board");
    categories[category].forEach(word => {
        let tileToRemove = Array.from(board.children).find(tile => tile.innerText.toLowerCase() === word);
        if (tileToRemove) {
            board.removeChild(tileToRemove);
        }
    });
}



// Call startConnections to initialize the game
startConnections();
