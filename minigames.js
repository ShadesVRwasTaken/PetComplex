let activeGameIndex = 0;
let gameTargetValue = 0;
let gameCurrentValue = 0;

const minigameLibrary = [
    { title: "🍽️ TASK: CLEAN DISHES", desc: "Rapidly press the scrub key to wash the plate clean!", actionLabel: "🧽 SCRUB DISH", target: 10 },
    { title: "📦 TASK: LOADING DOCK", desc: "Stop the high-speed loading crane directly inside the sweet spot (>85)!", actionLabel: "🏗️ DROP PALLET", target: 85 },
    { title: "🧹 TASK: SWEEP FLOORS", desc: "Catch the moving pixelated dust speck on screen before it moves!", actionLabel: "🧹 SWEEP NODE", target: 1 },
    { title: "📄 TASK: DATA ENTRY", desc: "Type the matching encrypted mainframe string code sequence exactly!", actionLabel: "⌨️ TRANSMIT BATCH", target: 0 },
    { title: "☕ TASK: ESPRESSO BAR", desc: "Hold down action button to fill beaker precisely to the target line!", actionLabel: "☕ POUR STEAM", target: 72 }
];

function openMinigameSelector() {
    if (pet.isSleeping || pet.energy < 15) {
        alert("Your pet is resting or lacks the energy resources to start work!");
        return;
    }
    initAudioContext();
    openModal('modal-minigame');
    activeGameIndex = Math.floor(Math.random() * minigameLibrary.length);
    setupMinigameInstance();
}

function setupMinigameInstance() {
    const config = minigameLibrary[activeGameIndex];
    document.getElementById('minigame-title').innerText = config.title;
    document.getElementById('minigame-feedback').innerText = config.desc;
    document.getElementById('btn-close-game').style.display = 'none';

    const surface = document.getElementById('minigame-playground');
    surface.innerHTML = '';
    gameCurrentValue = 0;
    gameTargetValue = config.target;

    if(activeGameIndex === 0) {
        const btn = document.createElement('button');
        btn.className = "commit-btn"; btn.innerText = config.actionLabel;
        btn.style.margin = "40px auto"; display="block"; width="60%";
        btn.onclick = () => {
            gameCurrentValue++;
            playCuteSFX('bounce');
            document.getElementById('minigame-feedback').innerText = `Scrub Velocity: ${gameCurrentValue}/${gameTargetValue}`;
            if(gameCurrentValue >= gameTargetValue) winMinigamePayout();
        };
        surface.appendChild(btn);
    } 
    else if(activeGameIndex === 1) {
        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = 10;
        slider.style.width = "80%"; slider.style.margin = "40px 10%"; slider.id = "stacker-slider";
        surface.appendChild(slider);

        let velocity = 5;
        const loop = setInterval(() => {
            if(!document.getElementById('stacker-slider')) { clearInterval(loop); return; }
            let val = parseInt(slider.value);
            if(val >= 100 || val <= 0) velocity *= -1;
            slider.value = val + velocity;
        }, 25);

        const btn = document.createElement('button');
        btn.className = "commit-btn"; btn.innerText = config.actionLabel;
        btn.style.margin = "0 auto"; display="block";
        btn.onclick = () => {
            let score = parseInt(slider.value);
            if(score >= gameTargetValue) { clearInterval(loop); winMinigamePayout(); }
            else { playCuteSFX('sad'); document.getElementById('minigame-feedback').innerText = `Missed Alignment! Calibration registered [${score}]. Try again.`; }
        };
        surface.appendChild(btn);
    }
    else if(activeGameIndex === 2) {
        const block = document.createElement('div');
        block.style.width = "20px"; block.style.height = "20px"; block.style.background = "#ff4757";
        block.style.position = "absolute"; block.style.cursor = "pointer"; block.style.left = "30px"; block.style.top = "30px";
        block.onclick = () => winMinigamePayout();
        setInterval(() => {
            block.style.left = `${Math.random() * 85}%`;
            block.style.top = `${Math.random() * 75}%`;
        }, 800);
        surface.appendChild(block);
    }
    else if(activeGameIndex === 3) {
        const key = Math.floor(1000 + Math.random() * 9000);
        gameTargetValue = key;
        const lbl = document.createElement('div');
        lbl.innerText = `MAINFRAME KEY: ${key}`; lbl.style.textAlign = "center"; lbl.style.marginTop = "20px";
        surface.appendChild(lbl);

        const input = document.createElement('input');
        input.type = "number"; input.style.display = "block"; input.style.margin = "10px auto"; input.id = "minigame-input";
        surface.appendChild(input);

        const btn = document.createElement('button');
        btn.className = "commit-btn"; btn.innerText = config.actionLabel;
        btn.onclick = () => {
            if(parseInt(input.value) === gameTargetValue) winMinigamePayout();
            else { playCuteSFX('sad'); document.getElementById('minigame-feedback').innerText = "Encryption mismatch! Re-verify strings."; }
        };
        surface.appendChild(btn);
    }
    else if(activeGameIndex === 4) {
        const track = document.createElement('div');
        track.style.background = "#222"; track.style.width = "30px"; track.style.height = "90px"; track.style.margin = "10px auto"; track.style.position = "relative";
        const filler = document.createElement('div');
        filler.style.background = "#ffa502"; filler.style.width = "100%"; filler.style.height = "0%"; filler.style.position = "absolute"; filler.style.bottom = "0";
        track.appendChild(filler); surface.appendChild(track);

        const btn = document.createElement('button');
        btn.className = "commit-btn"; btn.innerText = config.actionLabel;
        btn.style.margin = "0 auto"; display="block";
        
        let pourTimer;
        btn.onmousedown = () => {
            pourTimer = setInterval(() => {
                gameCurrentValue = Math.min(100, gameCurrentValue + 3);
                filler.style.height = `${gameCurrentValue}%`;
                playCuteSFX('click');
            }, 60);
        };
        btn.onmouseup = () => {
            clearInterval(pourTimer);
            if(gameCurrentValue >= 65 && gameCurrentValue <= 80) winMinigamePayout();
            else { playCuteSFX('sad'); document.getElementById('minigame-feedback').innerText = `Pressure unstable! Discharged to [${gameCurrentValue}%]. Target is 72%`; gameCurrentValue = 0; filler.style.height = "0%"; }
        };
        surface.appendChild(btn);
    }
}

function winMinigamePayout() {
    playCuteSFX('work');
    pet.money += 35;
    pet.energy = Math.max(0, pet.energy - 15);
    pet.happiness = Math.max(0, pet.happiness - 5);
    document.getElementById('minigame-feedback').innerText = "🎉 JOB TASK RESOLVED! Payroll processing generated +\$35 cash assets.";
    document.getElementById('minigame-playground').innerHTML = "";
    document.getElementById('btn-close-game').style.display = 'block';
    updateGlobalUI();
}
