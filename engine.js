let pet = {
    money: 100,
    food: 100,
    energy: 100,
    happiness: 100,
    age: 0,
    isSleeping: false,
    currentState: 'neutral'
};

// Internal wandering engine layout bounds tracking variables
let petPositionX = 200;
let petPositionY = 120;

function updateGlobalUI() {
    document.getElementById("lbl-money").innerText = pet.money;
    document.getElementById("lbl-age").innerText = pet.age;
    
    document.getElementById("bar-food").style.width = pet.food + "%";
    document.getElementById("bar-energy").style.width = pet.energy + "%";
    document.getElementById("bar-happy").style.width = pet.happiness + "%";

    calculatePetState();
}

function calculatePetState() {
    // Process core engine status thresholds to compute active states
    if (pet.food <= 0 && pet.energy <= 0) {
        pet.currentState = 'dead';
    } else if (pet.isSleeping) {
        pet.currentState = 'sleeping';
    } else if (pet.food < 30) {
        pet.currentState = 'hungry';
    } else if (pet.energy < 30) {
        pet.currentState = 'tired';
    } else if (pet.happiness < 30) {
        pet.currentState = 'sad';
    } else if (pet.happiness > 75) {
        pet.currentState = 'happy';
    } else {
        // Fallback checks map sandbox movements cleanly
        if (Math.random() > 0.6 && pet.currentState !== 'dead') {
            pet.currentState = 'wandering';
        } else {
            pet.currentState = 'neutral';
        }
    }
    
    renderPetSprite();
}

function renderPetSprite() {
    const container = document.getElementById('sandbox-pet');
    const customFrameData = petSpriteSheets[pet.currentState];

    // Check if the current state map array holds pixel data injection entries
    if (customFrameData && Object.keys(customFrameData).length > 0) {
        container.innerHTML = '';
        const canvasRenderNode = document.createElement('div');
        canvasRenderNode.className = 'pixel-render-canvas';
        
        for(let i=0; i<256; i++) {
            const dot = document.createElement('div');
            dot.className = 'pixel-cell-dot';
            dot.style.backgroundColor = customFrameData[i] || 'transparent';
            canvasRenderNode.appendChild(dot);
        }
        container.appendChild(canvasRenderNode);
    } else {
        // Fallback default emoji tracking
        container.innerHTML = `<span style="font-size:2.2rem; user-select:none;">${fallbackEmojis[pet.currentState]}</span>`;
    }
}

// Background simulation ticker tracking looping mechanics
setInterval(() => {
    if (pet.currentState === 'dead') return;

    pet.age += 1;

    if (pet.isSleeping) {
        pet.energy = Math.min(100, pet.energy + 10);
        pet.food = Math.max(0, pet.food - 1);
    } else {
        pet.food = Math.max(0, pet.food - 3);
        pet.energy = Math.max(0, pet.energy - 2);
        pet.happiness = Math.max(0, pet.happiness - 2);
        
        // Random wandering vector translation changes inside home sandbox limits
        if(Math.random() > 0.4) {
            petPositionX = Math.max(30, Math.min(390, petPositionX + (Math.random() * 60 - 30)));
            petPositionY = Math.max(50, Math.min(210, petPositionY + (Math.random() * 40 - 20)));
            
            const petEl = document.getElementById('sandbox-pet');
            petEl.style.left = `${petPositionX}px`;
            petEl.style.top = `${petPositionY}px`;
            playCuteSFX('bounce');
        }
    }

    if (pet.food < 15) pet.happiness = Math.max(0, pet.happiness - 4);

    updateGlobalUI();
}, 4000);

function feedPet() {
    if (pet.currentState === 'dead' || pet.money < 10) { playCuteSFX('sad'); return; }
    playCuteSFX('feed');
    pet.money -= 10;
    pet.food = Math.min(100, pet.food + 25);
    updateGlobalUI();
}

function toggleSleep() {
    if (pet.currentState === 'dead') return;
    playCuteSFX('click');
    pet.isSleeping = !pet.isSleeping;
    document.getElementById('btn-sleep').innerText = pet.isSleeping ? "☀️ Wake Up Pet" : "😴 Put to Sleep";
    updateGlobalUI();
}

/* Custom Files Save/Load IO Mechanics Engine */
function exportPetFile() {
    playCuteSFX('work');
    // Bundle pet data parameters along with canvas matrices into a global JSON package string
    const petPackage = {
        petStateData: pet,
        furnitureLayout: placedFurniture,
        customSprites: petSpriteSheets
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(petPackage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyberpet_age${pet.age}.pet`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importPetFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if(importedData.petStateData && importedData.customSprites) {
                pet = importedData.petStateData;
                placedFurniture = importedData.furnitureLayout || [];
                petSpriteSheets = importedData.customSprites;
                
                renderSandboxItems();
                updateGlobalUI();
                playCuteSFX('feed');
                alert("Custom .pet save profile imported and decrypted successfully!");
            } else {
                alert("Invalid file header profile structure!");
            }
        } catch(err) {
            alert("Error parsing file structure blocks.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

/* Operational Modal Interceptor Layer Switches */
function openModal(id) {
    playCuteSFX('click');
    document.getElementById(id).classList.remove('hidden');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

function openSettings() { openModal('modal-settings'); }
function openHomeEditor() { openModal('modal-home'); }
function openPixelEditor() { 
    openModal('modal-pixel'); 
    initCanvasGrid();
    loadStateToPixelCanvas();
}

// Initial engine ignition sequence
updateGlobalUI();
