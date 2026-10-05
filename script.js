// Pet State Management
let pet = {
    money: 50,
    food: 100,
    energy: 100,
    happiness: 100,
    age: 0,
    isSleeping: false
};

// Elements DOM Cache
const moneyDisplay = document.getElementById("money-display");
const ageDisplay = document.getElementById("age-display");
const foodBar = document.getElementById("food-bar");
const energyBar = document.getElementById("energy-bar");
const happinessBar = document.getElementById("happiness-bar");
const petAvatar = document.getElementById("pet-avatar");
const petStatusText = document.getElementById("pet-status-text");

// 🔊 8-Bit Web Audio API Sound Synthesizer
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, type, duration, volume = 0.1) {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    // Linear decay smoothly fades the note out so it sounds crisp
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Custom Arcade Sound Effects
function sfxWork() {
    // Upward register cash sound
    playTone(523.25, 'square', 0.08); // C5
    setTimeout(() => playTone(659.25, 'square', 0.15), 80); // E5
}

function sfxFeed() {
    // Crunching sounds
    playTone(150, 'triangle', 0.1);
    setTimeout(() => playTone(120, 'triangle', 0.1), 100);
}

function sfxPlay() {
    // Upward sweeping bouncy sound
    playTone(330, 'sine', 0.15);
    setTimeout(() => playTone(440, 'sine', 0.15), 70);
    setTimeout(() => playTone(554, 'sine', 0.2), 140);
}

function sfxSleep() {
    // Warm low tone toggle sound
    playTone(220, 'triangle', 0.25);
}

function sfxGameOver() {
    // Tragic descending failure sweep
    playTone(293.66, 'sawtooth', 0.2); // D4
    setTimeout(() => playTone(220.00, 'sawtooth', 0.2), 200); // A3
    setTimeout(() => playTone(146.83, 'sawtooth', 0.5), 400); // D3
}


// Core Systems & Interactions
let gameOverTriggered = false;

function updateUI() {
    moneyDisplay.innerText = pet.money;
    ageDisplay.innerText = pet.age;
    
    foodBar.style.width = pet.food + "%";
    energyBar.style.width = pet.energy + "%";
    happinessBar.style.width = pet.happiness + "%";

    // Manage Avatar States & Mood Expression
    if (pet.food <= 0 && pet.energy <= 0) {
        petAvatar.innerText = "💀";
        petStatusText.innerText = "Game Over. Your pet has passed away.";
        disableButtons();
        if (!gameOverTriggered) {
            sfxGameOver();
            gameOverTriggered = true;
        }
    } else if (pet.isSleeping) {
        petAvatar.innerText = "😴";
        petStatusText.innerText = "Zzz... Your pet is resting.";
    } else if (pet.food < 30) {
        petAvatar.innerText = "🤤";
        petStatusText.innerText = "Starving! Please feed your pet.";
    } else if (pet.happiness < 30) {
        petAvatar.innerText = "😢";
        petStatusText.innerText = "Very lonely. Play with your pet!";
    } else if (pet.energy < 30) {
        petAvatar.innerText = "😫";
        petStatusText.innerText = "Exhausted. Let them sleep.";
    } else {
        petAvatar.innerText = "😀";
        petStatusText.innerText = "Your pet is happy and healthy!";
    }
}

function work() {
    if (pet.isSleeping || pet.food <= 0) return;
    sfxWork();
    pet.money += 20;
    pet.energy = Math.max(0, pet.energy - 10);
    pet.happiness = Math.max(0, pet.happiness - 5);
    updateUI();
}

function feed() {
    if (pet.isSleeping || pet.money < 10) return;
    sfxFeed();
    pet.money -= 10;
    pet.food = Math.min(100, pet.food + 30);
    updateUI();
}

function play() {
    if (pet.isSleeping || pet.energy < 15) return;
    sfxPlay();
    pet.energy = Math.max(0, pet.energy - 15);
    pet.happiness = Math.min(100, pet.happiness + 25);
    updateUI();
}

function sleep() {
    sfxSleep();
    pet.isSleeping = !pet.isSleeping;
    const btnSleep = document.getElementById("btn-sleep");
    btnSleep.innerText = pet.isSleeping ? "☀️ Wake Up" : "😴 Sleep";
    
    // Toggle active limitations when sleeping
    document.getElementById("btn-work").disabled = pet.isSleeping;
    document.getElementById("btn-feed").disabled = pet.isSleeping;
    document.getElementById("btn-play").disabled = pet.isSleeping;
    updateUI();
}

function disableButtons() {
    document.querySelectorAll(".controls-panel button").forEach(btn => btn.disabled = true);
}

// Background Simulation Engine (Passive Decay Loop)
setInterval(() => {
    if (pet.food <= 0 && pet.energy <= 0) return; // Skip if dead

    pet.age += 1;

    if (pet.isSleeping) {
        pet.energy = Math.min(100, pet.energy + 8);
        pet.food = Math.max(0, pet.food - 1); // Burns slower during sleep
    } else {
        pet.food = Math.max(0, pet.food - 3);
        pet.energy = Math.max(0, pet.energy - 2);
        pet.happiness = Math.max(0, pet.happiness - 2);
    }

    // Health Penalty: Hunger degrades happiness rapidly
    if (pet.food < 15) {
        pet.happiness = Math.max(0, pet.happiness - 5);
    }

    updateUI();
}, 3000); // Ticks run every 3 seconds

// Initialize Game Engine
updateUI();
