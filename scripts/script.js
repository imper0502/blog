// 
// 
// 
let deck = [];
let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;
let yourRoundDone = false;
let winner = 0;     // 0:未定義贏家, 1:玩家, 2:莊家, 3:平局

function resetGame() {
    initCards();
    deck = [];    
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    inGame = false;
    yourRoundDone = false;
    winner = 0;
    $('.win').removeClass('win');
    $('.draw').removeClass('draw');
    renderGameTable();
}

$(document).ready(function() {
    initCards();
    initButtons();
    renderGameTable();
});

class Card{
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
    cardNumber() {
        switch(this.number) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.number;
        }
    }
    cardPoint() {
        switch(this.number) {
            case 1:
                return 11;
            case 11:
            case 12:
            case 13:
                return 10;
            default:
                return this.number;
        }
    }
    cardSuit() { 
        switch(this.suit) {
            case 1:
                return '♠';
            case 2:
                return '♥';
            case 3:
                return '♦';
            case 4:
                return '♣';
        }
    }
}

// class Deck{
//     constructor(ownner) {
//         this.ownner = ownner;
//     }
//     cards = [];

//     getCard(theCard) {
//         cards.push(theCard);   
//     }
// }

function initCards() {
    // let allCards = document.querySelectorAll('.card div');
    // allCards.forEach( card => card.innerHTML = '㊙');
    $('.card div').html('㊙');
    $('.card div').css({
        'color':'#0386D7',
        'border-color':'#0386D7'
        });
    $('.card span').html('');
}

function initButtons() {
    $('#action-new-game').click(evt => newGame());
    // document.querySelector('#action-new-game').addEventListener('click', function(evt) {...});

    $('#action-hit').click(evt => {
        evt.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    });
    $('#action-stand').click(evt => {
        evt.preventDefault();
        yourRoundDone = true;
        dealerRound();
        renderGameTable();
    });
}

function newGame() {
    resetGame();
    inGame = true;
    deck = shuffle(buildDeck());

    yourDeck.push(deal());
    dealerDeck.push(deal());
    yourDeck.push(deal());

    renderGameTable();
}

function buildDeck() {
    let deck = [];
    for(let suit = 1; suit <= 4; suit++){
        for(let num = 1; num <= 13; num++){
            let card = new Card(suit, num);
            deck.push(card);
        }
    }
    return deck;
}

// shuffle a deck.(洗牌)
// via 'https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array'
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Deal a Card.
function deal() {
    return deck.shift();
}

// show the table
function renderGameTable() {
    // show cards on table
    yourDeck.forEach( (card, index) => {
        let theCardNumber = $(`#yourCard${index + 1}`);
        theCardNumber.html(card.cardNumber());
        let theCardSuit = theCardNumber.prev();
        theCardSuit.html(card.cardSuit());
        // theCardNumber.prev().html(card.cardSuit());
        if(card.cardSuit()==='♥'||card.cardSuit()==='♦') {
            theCardNumber.css('color', 'red');
            theCardNumber.prev().css('color', 'red');
        }else {
            theCardNumber.css('color', 'black');
            theCardNumber.prev().css('color', 'black');
        }
    });

    dealerDeck.forEach( (card, index) => {
        let theCardNumber = $(`#dealerCard${index + 1}`);
        theCardNumber.html(card.cardNumber());
        theCardNumber.prev().html(card.cardSuit());
        if(card.cardSuit()==='♥'||card.cardSuit()==='♦') {
            theCardNumber.css('color', 'red');
            theCardNumber.prev().css('color', 'red');
        }else {
            theCardNumber.css('color', 'black');
            theCardNumber.prev().css('color', 'black');
        }
    });

    // calculate point
    yourPoint = calcPoints(yourDeck);
    dealerPoint = calcPoints(dealerDeck);
    // if(yourPoint >= 21||dealerPoint >= 21){
    //     inGame = false;
    // }
    $('.your-cards h1').html(`你（${yourPoint}點）`);
    $('.dealer-cards h1').html(`莊家（${dealerPoint}點）`);

    // win or lost
    checkWinner();
    showWinStamp();
   
    // buttons
    $('#action-hit').attr('disabled', !inGame);
    $('#action-stand').attr('disabled', !inGame);
}

function checkWinner() {
    switch(true) {
        // 1.玩家過五關
        case (yourDeck.length == 5) && (yourPoint < 21):
        winner = 1;
        break;
        
        // 2.玩家直接贏 
        case yourPoint == 21:
        winner = 1;
        break;
        
        // 3.玩家直接輸
        case yourPoint > 21:
        winner = 2;
        break;
        
        // 4.莊家直接輸
        case dealerPoint > 21:
        winner = 1;
        break;
        
        // 5.莊家贏
        case yourPoint < dealerPoint && yourRoundDone:
        winner = 2;
        break;
        
        // 6.平局
        case yourPoint == dealerPoint && yourRoundDone:
        winner = 3;
        break;
        
        default:
            winner = 0;
    }
    if (winner == 0) inGame = true;
    else inGame = false;
}

function showWinStamp() {
    switch(winner) {
        case 1:
            $('.your-cards').addClass('win');
            break;

        case 2:
            $('.dealer-cards').addClass('win');
            break;
            
        case 3:
            $('.dealer-cards').addClass('draw');
            $('.your-cards').addClass('draw');
            break;

        default:
            break;
    }
}

// calculate points
function calcPoints(deck) {
    let sumPoint = 0;
    deck.forEach(card => {
        sumPoint += card.cardPoint();
    });
    if (sumPoint > 21) {
        deck.forEach(card => {
            if(card.cardNumber() === 'A'){
                if (sumPoint > 21) sumPoint -= 10;
            }
        });
    }
    return sumPoint;
}

function dealerRound() {
    while(true) {
        dealerPoint = calcPoints(dealerDeck);
        if(dealerPoint <= yourPoint) {
            dealerDeck.push(deal());
        }else {
            break;
        }
    }
}
 