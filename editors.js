let activePaintColor = '#000000';
let selectedFurnitureToken = null;
let currentEditingState = 'neutral';

// Global Data Storage Array Mapping Frames for our custom Engine
// Maps: stateName -> 16x16 color strings matrix setup array
let petSpriteSheets = {
    neutral: {}, wandering: {}, happy: {}, sad: {},
    hungry: {}, tired: {}, sleeping: {}, dead: {}
};

// House Furniture Placement Node Tracking
let placedFurniture = [];

function initCanvasGrid() {
    const container = document.getElementById('pixel-canvas-grid');
    container.innerHTML = '';
    for(let i=0; i<256; i++) {
        const cell = document.createElement('div');
        cell.className = 'pixel-canvas-cell';
        cell.dataset.index = i;
        cell.addEventListener('mousedown', paintPixel);
        cell.addEventListener('mouseover', (e) => { if(e.buttons === 1) paintPixel(e); });
        container.appendChild(cell);
    }
}

function setPaintColor(color, swatchElement) {
    playCuteSFX('click');
    activePaintColor = color;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatchElement.classList.add('active');
}

function paintPixel(e) {
    e.target.style.backgroundColor = activePaintColor;
}

function loadStateToPixelCanvas() {
    currentEditingState = document.getElementById('editor-state-select').value;
    const cells = document.querySelectorAll('.pixel-canvas-cell');
    
    cells.forEach((cell, idx) => {
        const color = petSpriteSheets[currentEditingState][idx];
        cell.style.backgroundColor = color || 'transparent';
    });
}

function savePixelArtChanges() {
    playCuteSFX('work');
    const cells = document.querySelectorAll('.pixel-canvas-cell');
    petSpriteSheets[currentEditingState] = {};
    
    cells.forEach((cell, idx) => {
        petSpriteSheets[currentEditingState][idx] = cell.style.backgroundColor || 'transparent';
    });
    
    renderPetSprite();
    alert(`Custom sprite data compiled successfully for state: [${currentEditingState}]!`);
}

// Generate Premade Sets using CSS Fallbacks if user hasn't loaded custom pixel designs
const fallbackEmojis = {
    neutral: "😐", wandering: "🏃", happy: "✨😀✨", sad: "😢",
    hungry: "🤤", tired: "😫", sleeping: "😴", dead: "💀"
};

function usePremadeSet() {
    playCuteSFX('feed');
    // Basic structural preset data setup
    Object.keys(petSpriteSheets).forEach(state => {
        petSpriteSheets[state] = {}; // Wipes to native fallback rendering engine loop
    });
    loadStateToPixelCanvas();
    renderPetSprite();
    alert("Loaded premade fallback configurations standard engines!");
}

/* Home Sandbox Placement Architecture Modifiers */
function selectFurnitureToken(emoji) {
    playCuteSFX('click');
    selectedFurnitureToken = emoji;
    alert(`Token [ ${emoji} ] Selected. Click anywhere inside the room screen zone to drop it.`);
    closeModals();
}

// Intercept room viewport pointer clicks to position objects dynamically
document.getElementById('room-canvas-container').addEventListener('click', function(e) {
    if (!selectedFurnitureToken) return;
    
    // Safety check: ensure clicked position is inside the room container boundaries
    if (e.target.id !== 'room-canvas-container' && !e.target.classList.contains('furniture-token')) return;

    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const item = { token: selectedFurnitureToken, x: x, y: y };
    placedFurniture.push(item);
    
    renderSandboxItems();
    selectedFurnitureToken = null; // Reset selection token pointer
    playCuteSFX('bounce');
});

function renderSandboxItems() {
    const container = document.getElementById('room-canvas-container');
    // Flush out older item nodes, keeping the primary pet layer secure
    document.querySelectorAll('.furniture-token').forEach(el => el.remove());

    placedFurniture.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'furniture-token';
        el.innerText = item.token;
        el.style.left = `${item.x}px`;
        el.style.top = `${item.y}px`;
        // Right click feature removes item from database array tracking
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            placedFurniture.splice(index, 1);
            renderSandboxItems();
            playCuteSFX('click');
        });
        container.appendChild(el);
    });
}

function clearAllFurniture() {
    placedFurniture = [];
    renderSandboxItems();
    playCuteSFX('sad');
}
