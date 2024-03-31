const FEATURES = {
    shape: ['oval', 'squiggle', 'diamond'],
    color: ['red', 'green', 'purple'],
    fill: ['solid', 'striped', 'open'],
    count: [1, 2, 3]
};

function generateDeck() {
    let deck = [];
    for (let shape of FEATURES.shape) {
        for (let color of FEATURES.color) {
            for (let fill of FEATURES.fill) {
                for (let count of FEATURES.count) {
                    deck.push({ shape, color, fill, count });
                }
            }
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards(deck, numCards) {
    let dealtCards = [];
    for (let i = 0; i < numCards; i++) {
        dealtCards.push(deck.pop());
    }
    return dealtCards;
}

function isSet(card1, card2, card3) {
    for (let feature in FEATURES) {
        const values = new Set([card1[feature], card2[feature], card3[feature]]);
        if (values.size === 2) {
            return false;
        }
    }
    return true;
}

let selectedCards = [];

function highlightCards(type){ //by adding a class and design it on css
    const container = document.getElementById('cardContainer');
    const cardElements = container.getElementsByClassName('card');
    cardElements[i].classList.add(type); 
}

function toggleCardSelection(index) {
    if (selectedCards.includes(index)) {
        selectedCards = selectedCards.filter(cardIndex => cardIndex !== index);
    } else {
        selectedCards.push(index);
        //color the chosen one
        console.log(cards[index]);
    }

    if (selectedCards.length === 3) {
        checkSet();
    } else {
        renderCards();
    }
}

function showScore(){
    document.getElementById('score').textContent = "Score: "+score;
}

function checkSet() {
    let selected = selectedCards.map(index => cards[index]);
    if (isSet(selected[0], selected[1], selected[2])) {
        console.log('Valid set!');
        score+=3;
        showScore();
        removeSelectedCards();
    } else {
        console.log('Not a valid set. Try again!');
        selectedCards = [];
        renderCards();
    }
}

function removeSelectedCards() {
    selectedCards.sort((a, b) => b - a); // sort in reverse order(save the index)
    selectedCards.forEach(index => {
        cards.splice(index, 1);
    });
    selectedCards = [];
    // Deal new cards to fill up to 12 cards
    while (cards.length < 12) {
        cards.push(...dealCards(deck, 1));
    }
    renderCards();
}


function renderCards() {
    const container = document.getElementById('cardContainer');
    container.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        if (selectedCards.includes(index)) {
            cardElement.classList.add('selected');
        }
        cardElement.innerHTML = `
            <span class="${card.color} ${card.shape} ${card.fill}">
                ${card.count}
            </span>
        `;
        cardElement.addEventListener('click', () => toggleCardSelection(index));
        container.appendChild(cardElement);
    });
}

function giveHint() {
    for (let i = 0; i < cards.length - 2; i++) {
        for (let j = i + 1; j < cards.length - 1; j++) {
            for (let k = j + 1; k < cards.length; k++) {
                if (isSet(cards[i], cards[j], cards[k])) {
                    // Highlight the first card of the set
                    const container = document.getElementById('cardContainer');
                    const cardElements = container.getElementsByClassName('card');
                    cardElements[i].classList.add('hint'); 
                    console.log(i);
                    console.log(j);
                    console.log(k);
                    score-=1; //a fine for the hint
                    if(score>0){
                        showScore();
                    }
                    return; //for hint we need just one set
                }
            }
        }
    }
    console.log("No Sets. Deal 3 more cards to the table");
    // Deal 3 more cards to the table
    cards.push(...dealCards(deck, 3));
    renderCards();
}


let score;
let cards;
let deck;


function playSetGame() {
    score = 0;
    showScore(); //for restart
    cards = [];
    deck = generateDeck();
    shuffleDeck(deck);

    cards = dealCards(deck, 12);
    renderCards();
}

playSetGame();

/*
V- color chosens
V- cancel choose
V - add 3 cards when hint no sets
V- restart button
*/
