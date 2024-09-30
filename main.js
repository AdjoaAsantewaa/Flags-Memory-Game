// Select the game board element from the DOM
const gameBoard = document.getElementById('gameBoard');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const popupCloseButton = document.getElementById('popupCloseButton');
const restartButton = document.getElementById('restartButton'); // Select the restart button

// Event listener for the restart button
restartButton.addEventListener('click', restartGame); // Restart game on button click

// A larger pool of world flag image URLs and country names
const allFlags = [
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/14/australia-162232_640.png', name: 'Australia' },
    { url: 'https://cdn.pixabay.com/photo/2014/04/02/11/12/brazil-305531_640.png', name: 'Brazil' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/23/16/18/flag-38776_1280.png', name: 'Canada' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/23/05/china-26841_640.png', name: 'China' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/15/france-162295_1280.png', name: 'France' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/12/23/52/germany-31017_640.png', name: 'Germany' },
    { url: 'https://cdn.pixabay.com/photo/2022/08/22/12/19/flag-7403565_1280.png', name: 'India' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/22/59/japan-26803_1280.png', name: 'Japan' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/16/mexico-162359_640.png', name: 'Mexico' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/23/12/russia-26896_1280.png', name: 'Russia' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/17/spain-162428_1280.png', name: 'Spain' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/16/14/union-jack-26119_640.png', name: 'United Kingdom' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/16/22/united-26177_640.png', name: 'United States' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/15/italy-162326_1280.png', name: 'Italy' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/17/south-africa-162425_640.png', name: 'South Africa' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/17/south-korea-162427_640.png', name: 'South Korea' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/14/argentina-162229_640.png', name: 'Argentina' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/16/nigeria-162376_1280.png', name: 'Nigeria' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/12/19/14/sweden-154401_640.png', name: 'Sweden' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/22/58/singapore-26793_1280.png', name: 'Singapore' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/12/51/holland-160486_1280.png', name: 'Netherlands' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/16/norway-162381_1280.png', name: 'Norway' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/17/turkey-162445_640.png', name: 'Turkey' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/23/04/vietnam-26834_640.png', name: 'Vietnam' },
    { url: 'https://cdn.pixabay.com/photo/2013/07/13/14/15/ghana-162302_640.png', name: 'Ghana' },
    { url: 'https://cdn.pixabay.com/photo/2012/04/10/23/17/ivory-coast-26939_640.png', name: 'Ivory Coast' }
];

// Array to hold the flags that will be used in the current game
let cardValues = [];
let moveCount = 0; // Initialize move counter

// Function to select random pairs of flags for the game
function selectRandomFlags() {
    // Shuffle the array of all flags
    const shuffledFlags = allFlags.sort(() => Math.random() - 0.5);
    
    // Select the first 8 flags from the shuffled list and create pairs
    cardValues = shuffledFlags.slice(0, 8).flatMap(flag => [flag, flag]);

    // Shuffle the pairs to randomize their positions on the game board
    cardValues.sort(() => Math.random() - 0.5);
}

// Variables to track the first and second card clicked, 
// and flags to manage the game state
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

// Function to create the game board
function createBoard() {
    // Select random flags to display on the board
    selectRandomFlags();

    // Create a card element for each value in cardValues
    cardValues.forEach(value => {
        // Create a new div element for each card
        const card = document.createElement('div');
        // Add the class 'card' to the element
        card.classList.add('card');
        // Store the flag object in the card's dataset
        card.dataset.value = JSON.stringify(value);

        // Create an img element to hold the flag image
        const img = document.createElement('img');
        img.src = value.url; // Set the image source to the flag URL
        img.classList.add('card-img');
        img.style.display = 'none'; // Initially hide the image

        // Create a span element for the country name
        const span = document.createElement('span');
        span.textContent = value.name;
        span.classList.add('card-name');
        span.style.display = 'none'; // Initially hide the name

        // Add the img and span elements to the card
        card.appendChild(img);
        card.appendChild(span);

        // Add a click event listener to flip the card when clicked
        card.addEventListener('click', flipCard);
        // Add the card to the game board
        gameBoard.appendChild(card);
    });
}

// Function to handle the card flip
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    const img = this.querySelector('img');
    const name = this.querySelector('.card-name');
    
    img.style.display = 'block';
    name.style.display = 'block';

    // Increment move count on each valid card flip
    moveCount++;
    updateMoveCounter();

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Function to update the moves counter display
function updateMoveCounter() {
    const moveCounter = document.getElementById('moveCounter');
    moveCounter.textContent = `Moves: ${moveCount}`; // Update the moves counter text
}

// Function to check if the two flipped cards are a match
function checkForMatch() {
    // Check if the data values of the two cards are the same
    let isMatch = JSON.parse(firstCard.dataset.value).url === JSON.parse(secondCard.dataset.value).url;

    // If they match, disable them; if not, unflip them
    isMatch ? disableCards() : unflipCards();
}

// Function to disable matching cards
function disableCards() {
    // Remove the event listeners from the matched cards
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Reset the board for the next turn
    resetBoard();
    checkForWin();
}

// Function to unflip non-matching cards
function unflipCards() {
    lockBoard = true;

    // Set a delay to hide the card faces after a short time
    setTimeout(() => {
        firstCard.querySelector('img').style.display = 'none';
        firstCard.querySelector('.card-name').style.display = 'none';
        secondCard.querySelector('img').style.display = 'none';
        secondCard.querySelector('.card-name').style.display = 'none';

        // Reset the board for the next turn
        resetBoard();
    }, 1000);
}

// Function to reset the board state after a turn
function resetBoard() {
    // Reset all game state variables
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Function to restart the game by clearing the board and setting up a new game
function restartGame() {
    gameBoard.innerHTML = ''; // Clear the game board
    moveCount = 0; // Reset move counter
    updateMoveCounter(); // Update move counter display
    createBoard(); // Set up the board again
}

// Function to check if the player has won the game
function checkForWin() {
    // Check if all cards are disabled (matched)
    const allMatched = Array.from(gameBoard.children).every(card => 
        card.querySelector('img').style.display === 'block'
    );

    // Show the popup message if all cards are matched
    if (allMatched) {
        popupMessage.textContent = `Congratulations! You've won the game in ${moveCount} moves.`;
        popup.style.display = 'flex';
        gameBoard.style.filter = 'blur(5px)'; // Blur the game board
    }
}

// Event listener to close the popup message
popupCloseButton.addEventListener('click', () => {
    popup.style.display = 'none';
    gameBoard.style.filter = 'none'; // Remove blur effect from the game board
    restartGame(); // Restart the game after closing the popup
});

// Create the initial game board when the page loads
createBoard();
