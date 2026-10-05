let activePaintColor = '#000000';
let selectedFurnitureToken = null;
let currentEditingState = 'neutral';

let petSpriteSheets = {
    neutral: {}, wandering: {}, happy: {}, sad: {},
    hungry: {}, tired: {}, sleeping: {}, dead: {}
};

let placedFurniture = [];

function initCanvasGrid() {
    const container = document.getElementById('pixel-canvas-grid');
    container.innerHTML = '';
    for(let i=0; i<256; i++) {
        const cell = document.createElement('div');
        cell.className = 'p-cell';
        cell.dataset.index = i;
        cell.addEventListener('mousedown', paintPixel);
        cell.addEventListener('mouseover', (e) => { if(e.buttons === 1) paintPixel(e); });
        container.appendChild(cell);
    }
}

function setPaintColor(color, swatchElement) {
    playCuteSFX('click');
    activePaintColor = color;
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    swatchElement.classList.add('active');
}

function paintPixel(e) {
    e.target.style.backgroundColor = activePaintColor;
}

function loadStateToPixelCanvas() {
    currentEditingState = document.getElementById('editor-state-select').value;
    const cells = document.querySelectorAll('.p-cell');
    cells.forEach((cell, idx) => {
        const color = petSpriteSheets[currentEditingState][idx];
        cell.style.backgroundColor = color || 'transparent';
    });
}

function savePixelArtChanges() {
    playCuteSFX('work');
    const cells = document.querySelectorAll('.p-cell');
    petSpriteSheets[currentEditingState] = {};
    cells.forEach((cell, idx) => {
        petSpriteSheets[currentEditingState][idx] = cell.style.backgroundColor || 'transparent';
    });
    alert(`Pixel map buffered successfully for [${currentEditingState}]!`);
}

function selectFurnitureToken(type) {
    playCuteSFX('click');
    selectedFurnitureToken = type;
    alert(`Asset [ ${type.toUpperCase()} ] loaded! Click inside the console canvas screen to drop it.`);
    closeModals();
}

function clearAllFurniture() {
    placedFurniture = [];
    playCuteSFX('sad');
}
