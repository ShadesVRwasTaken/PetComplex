let pet = {
    money: 100,
    food: 100,
    energy: 100,
    happiness: 100,
    age: 0,
    isSleeping: false,
    currentState: 'neutral'
};

let petX = 180;
let petY = 110;

// Setup Canvas context channels
const canvas = document.getElementById('room-canvas');
const ctx = canvas.getContext('2d');

// Setup intercept controls on canvas window to capture layout placements
canvas.addEventListener('click', function(e) {
    if (!selectedFurnitureToken) return;
    const rect = canvas.getBoundingClientRect();
    // Translate client scale coordinates directly into internal canvas resolution dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    placedFurniture.push({ type: selectedFurnitureToken, x: x, y: y });
    selectedFurnitureToken = null;
    playCuteSFX('bounce');
    renderCoreCanvasView();
});

// Built-in factory-loaded pixel maps (16x16 bitmaps represented as compact hex chains)
// Prevents empty fallbacks or broken image requests on GitHub Pages
const factoryPixelSprites = {
    box: [
        "transparent","transparent","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","#855e42","transparent","transparent",
        "transparent","#855e42","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#a0522d","#855e42","transparent"
    ],
    // Compiled compact 16x16 fallback array injected if sheet structure remains blank
    petDefault: ["transparent","transparent","transparent","transparent","#f1c40f","#f1c40f","#f1c40f","#f1c40f","#f1c40f","#f1c40f","#f1c40f","#f1c40f","transparent","transparent","transparent","transparent"]
};

function usePremadeSet() {
    playCuteSFX('feed');
    // Generate functional pixel artwork frameworks for every state directly into database matrix
    Object.keys(petSpriteSheets).forEach(state => {
        petSpriteSheets[state] = {};
        for(let i=0; i<256; i++) {
            // Programmatically draw a cute neon cyber-slime creature matrix body outline
            let row = Math.floor(i / 16);
            let col = i % 16;
            let color = "transparent";
            
            // Draw spherical round creature body logic parameters
            if(row >= 4 && row <= 13 && col >= 3 && col <= 12) {
                color = "#00d2d3"; // Neon teal body
                if(state === 'sad') color = "#54a0ff";
                if(state === 'hungry') color = "#ff9f43";
                if(state === 'dead') color = "#718093";
                
                // Embedded eye pixels positioning matrices matching state context expressions
                if(row === 7 && (col === 5 || col === 10)) color = "#000000"; 
                if(state === 'sleeping' && row === 7 && (col === 5 || col === 10)) color = "transparent";
                if(state === 'dead' && row === 7 && (col === 5 || col === 10)) color = "#ff4d4d"; // Red dead eyes
            }
            petSpriteSheets[state][i] = color;
        }
    });
    loadStateToPixelCanvas();
    renderCoreCanvasView();
}

function renderCoreCanvasView() {
    // 1. Flush background clear frames
    ctx.fillStyle = "#22252a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw interior wall base wireframes
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 150); ctx.lineTo(canvas.width, 150);
    ctx.stroke();

    // 3. Render Sandbox Furnishing Assets onto Coordinate targets
    placedFurniture.forEach(f => {
        ctx.fillStyle = f.type === 'bed' ? "#9b59b6" : f.type === 'plant' ? "#2ecc71" : f.type === 'tv' ? "#e67e22" : "#3498db";
        // Paint architectural block shapes representing pixel object layers
        ctx.fillRect(f.x - 12, f.y - 12, 24, 24);
        ctx.fillStyle = "#fff";
        ctx.font = "8px Courier";
        ctx.fillText(f.type.toUpperCase(), f.x - 12, f.y - 14);
    });

    // 4. Render Pet Matrix Textures Pixel by Pixel
    const currentFrame = petSpriteSheets[pet.currentState];
    const pixelWidth = 2.5; // Scale element vector resolution output factor

    if(currentFrame && currentFrame[0]) {
        for(let i=0; i<256; i++) {
            let color = currentFrame[i];
            if(color !== "transparent") {
                let px = petX - 20 + (i % 16) * pixelWidth;
                let py = petY - 20 + Math.floor(i / 16) * pixelWidth;
                ctx.fillStyle = color;
                ctx.fillRect(px, py, pixelWidth, pixelWidth);
            }
        }
    } else {
        // Factory Fallback Block indicator if studio canvas sheet data isn't loaded yet
        ctx.fillStyle = "#00d2d3";
        ctx.fillRect(petX - 15, petY - 15, 30, 30);
    }
}

function calculatePetState() {
    const led = document.getElementById("status-led");
    led.className = "lcd-led";

    if (pet.food <= 0 && pet.energy <= 0) {
        pet.currentState = 'dead';
        led.classList.add("off");
    } else if (pet.isSleeping) {
        pet.currentState = 'sleeping';
    } else if (pet.food < 35 || pet.energy < 35 || pet.happiness < 35) {
        led.classList.add("alert"); // Turn on low hardware alarm light
        if (pet.food < 35) pet.currentState = 'hungry';
        else if (pet.energy < 35) pet.currentState = 'tired';
        else pet.currentState = 'sad';
    } else if (pet.happiness > 75) {
        pet.currentState = 'happy';
    } else {
        pet.currentState = 'neutral';
    }
    
    renderCoreCanvasView();
}

function updateGlobalUI() {
    document.getElementById("lbl-money").innerText = pet.money;
    document.getElementById("lbl-age").innerText = pet.age;
    document.getElementById("bar-food").style.width = pet.food + "%";
    document.getElementById("bar-energy").style.width = pet.energy + "%";
    document.getElementById("bar-happy").style.width = pet.happiness + "%";
    calculatePetState();
}

// Global Core Automation Physics Ticker Loop
setInterval(() => {
    if (pet.currentState === 'dead') return;
    pet.age += 1;

    if (pet.isSleeping) {
        pet.energy = Math.min(100, pet.energy + 12);
        pet.food = Math.max(0, pet.food - 1);
    } else {
        pet.food = Math.max(0, pet.food - 3);
        pet.energy = Math.max(0, pet.energy - 2);
        pet.happiness = Math.max(0, pet.happiness - 2);
        
        // Random drift motion loops inside standard coordinates
        if(Math.random() > 0.5) {
            pet.currentState = 'wandering';
            petX = Math.max(40, Math.min(360, petX + (Math.random() * 50 - 25)));
            petY = Math.max(130, Math.min(190, petY + (Math.random() * 30 - 15)));
            playCuteSFX('bounce');
        }
    }
    updateGlobalUI();
}, 4000);

function feedPet() {
    if (pet.currentState === 'dead' || pet.money < 10) { playCuteSFX('sad'); return; }
    playCuteSFX('feed');
    pet.money -= 10;
    pet.food = Math.min(100, pet.food + 30);
    updateGlobalUI();
}

function toggleSleep() {
    if (pet.currentState === 'dead') return;
    playCuteSFX('click');
    pet.isSleeping = !pet.isSleeping;
    document.getElementById('btn-sleep').innerText = pet.isSleeping ? "☀️ WAKE" : "😴 SLEEP";
    updateGlobalUI();
}

/* CARTRIDGE CONTROLLER STORAGE IO DISK HANDLING */
function exportPetFile() {
    playCuteSFX('work');
    const petPackage = {
        petStateData: pet,
        furnitureLayout: placedFurniture,
        customSprites: petSpriteSheets
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(petPackage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyberpet_save_age${pet.age}.pet`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importPetFile(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if(parsed.petStateData && parsed.customSprites) {
                pet = parsed.petStateData;
                placedFurniture = parsed.furnitureLayout || [];
                petSpriteSheets = parsed.customSprites;
                updateGlobalUI();
                playCuteSFX('feed');
                alert("Data file loaded successfully! Simulation updated.");
            }
        } catch(err) { alert("Data structure parse failure."); }
    };
    reader.readAsText(event.target.files);
}

function openModal(id) { playCuteSFX('click'); document.getElementById(id).classList.remove('hidden'); }
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); }
function openSettings() { openModal('modal-settings'); }
function openHomeEditor() { openModal('modal-home'); }
function openPixelEditor() { openModal('modal-pixel'); initCanvasGrid(); loadStateToPixelCanvas(); }

// Initialize and auto-inflate default game loops
usePremadeSet();
updateGlobalUI();
