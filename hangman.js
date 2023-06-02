const gameElm = document.getElementById("game");
const gameOverElm = document.getElementById("gameOver");
const wordsElm = document.getElementById("words");
const aboutElm = document.getElementById("about");
wordsElm.style.display = "none";
aboutElm.style.display = "none";

document.getElementById("manualInput").addEventListener(("keydown"), (ev) => {
    if (ev.key === "Enter") {
        guess();
    }
})

const gameOver = (win) => {
    gameOverElm.style.display = "flex";
    gameElm.style.display = "none";

    for (const part of bodyParts) {
        part.style.color = "rgb(var(--text))";
        part.style.opacity = "0.25";
    }
    
    document.getElementById("overCondition").innerText = win ? "YOU WON!" : "You Lost!";
    document.getElementById("completionCount").innerText = `You have completed ${completed}/${words.length} words`;

    incorrectGuesses = 0;
    cLetters = [];
    wLetters = [];
    word = null;
    correct = false;
}

const showWords = () => {
    wordsElm.style.display = "flex";
    aboutElm.style.display = "none";

    document.getElementById("possibleWords").innerHTML = "";
    for (const w of words) {
        document.getElementById("possibleWords").innerHTML += `
            <div>
                ${w.word}, Completed: <span style="color: ${w.completed ? "green" : "red"}">${w.completed ? "✓" : "✗"}<span>
            </div>
        `;
    }
}

const showAbout = () => {
    wordsElm.style.display = "none";
    aboutElm.style.display = "flex";
}

const closeMisc = () => {
    wordsElm.style.display = "none";
    aboutElm.style.display = "none";
}

// Fill letters element
const letters = document.getElementById("letters");
const possibleLetters = "abcdefghijklmnopqrstuvwxyz";
for (const l of possibleLetters) {
    letters.innerHTML += `
        <button onclick="guess('${l}')" class="letter">${l}</button>
    `;
}

// Hangman
const bodyParts = [
    document.getElementById("hHead"),
    document.getElementById("hChest"),
    document.getElementById("hRArm"),
    document.getElementById("hLArm"),
    document.getElementById("hTorso"),
    document.getElementById("hHip"),
    document.getElementById("hRLeg"),
    document.getElementById("hLLeg")
];

for (const bodyPart of bodyParts) {
    bodyPart.style.opacity = "0.25";
    bodyPart.style.color = "rgb(var(--text))";
    bodyPart.style.transition = "0.5s ease all";
}

// Game
const words = [
    {word: "Omnichannel", hint: "A seamless expierence across all devices", completed: false},
    {word: "White Hat Hacker", hint: "Someone who uses their talents for good", completed: false},
    {word: "Black Hat Hacker", hint: "Someone who uses their talents for bad", completed: false},
    {word: "DES", hint: "An outdated method of encryption", completed: false},
    {word: "AES", hint: "An advanced method of encryption", completed: false},
    {word: "Social Engineering", hint: "Target individuals or groups to manipulate or to get something", completed: false},
    {word: "LAN", hint: "A network across a small/local area", completed: false},
    {word: "CAN", hint: "Allows the Electronic Control Units (ECUs) found in devices to communicate with each other in a reliable fashion", completed: false},
    {word: "WAN", hint: "A network that spans a vast area", completed: false},
    {word: "Permutation Cipher", hint: "A method of encryption which scrambles the positions of characters", completed: false},
    {word: "Substitution Cipher", hint: "Encrypt the plaintext by swapping each letter or symbol in the plaintext by a different symbol as directed by the key", completed: false},
    {word: "Computer Hardening", hint: "Increase security by reducing surface vulnerabilities", completed: false},
    {word: "Exploit", hint: "A segment of code or a program that maliciously takes advantage of vulnerabilities or security flaws in software or hardware to infiltrate", completed: false},
    {word: "Cybersecurity", hint: "The state of being protected against the criminal or unauthorized use of electronic data, or the measures taken to achieve this.", completed: false}
];
let word = null;
let completed = 0;

// User
let incorrectGuesses = 0;
let correct = false;
let wLetters = [];
let cLetters = [];

const correctElm = document.getElementById("correctElm");
const incorrectElm = document.getElementById("incorrectElm");
const hintElm = document.getElementById("hint");

const guess = (guess) => {
    if (guess === undefined) {
        guess = document.getElementById("manualInput").value;
        document.getElementById("manualInput").value = "";
    }

    if (cLetters.includes(guess.toLowerCase()) || wLetters.includes(guess.toLowerCase())) {
        game();
        return;
    }
    if (guess.length === 1) {
        if (!word.word.toLowerCase().includes(guess.toLowerCase())) {
            if (incorrectGuesses >= 8) {
                gameOver(false);
                return;
            }
    
            bodyParts[incorrectGuesses].style.opacity = "1";
            bodyParts[incorrectGuesses].style.color = "red";
            incorrectGuesses++;
            wLetters.push(guess);
        } else {
            for (let i = 0; i < word.word.length; i++) {
                if (word.word[i].toLowerCase() === guess.toLowerCase()) {
                    cLetters[i] = word.word[i].toLowerCase();
                }
            } 
    
            let fString = "";
            for (let i = 0; i < cLetters.length; i++) {
                fString += cLetters[i].toLowerCase();
            }
    
            correct = (fString.toLowerCase() === word.word.toLowerCase());
        }
    } else {
        if (guess.toLowerCase() === word.word.toLowerCase()) {
            correct = true;
        } else {
            bodyParts[incorrectGuesses].style.opacity = "1";
            bodyParts[incorrectGuesses].style.color = "red";
            incorrectGuesses++;
            wLetters.push(guess);
        }
    }

    if (!correct) {
        game();
    } else {
        if (!word.completed) {
            completed++;
        }
        word.completed = true;
        gameOver(true);
    }
}

const game = () => {
    if (word === null) {
        gameOverElm.style.display = "none";
        gameElm.style.display = "grid";
        word = words[Math.floor(Math.random() * words.length)];
        for (let i = 0; i < word.word.length; i++) {
            if (word.word[i] === " ") {
                cLetters.push(" ");
            } else {
                cLetters.push("");
            }
        }
        hintElm.innerText = word.hint;
    }

    // Construct guess string 
    let correctSoFar = "";
    for (let i = 0; i < word.word.length; i++) {
        if (word[i] === " ") {
            correctSoFar += " ";
            continue;
        }
        if (cLetters.includes(word.word[i].toLowerCase())) {
            correctSoFar += word.word[i];
        } else {
            correctSoFar += "_";
        }
    }
    correctElm.innerText = correctSoFar;

    incorrectElm.innerText = wLetters.toString().replace(/\,/g, ", ");
}

game();