let activeGameIndex = 0;
let gameTargetValue = 0;
let gameCurrentValue = 0;

const minigameLibrary = [
    { title: "🍽️ Task: Dish Scrubber", desc: "Mash the blue button 12 times to clean the grease!", actionLabel: "🧽 Scrub!", target: 12 },
    { title: "📦 Task: Box Stacker", desc: "Click exactly when the timing slider hits max density (>85)!", actionLabel: "🏗️ Drop Box!", target: 85 },
    { title: "🧹 Task: Floor Sweeper", desc: "Click the runaway dust bunnies before they vanish!", actionLabel: "💨 Catch Dust!", target: 1 },
    { title: "📄 Task: Data Entry Clerking", desc: "Type the matching system generation access key number sequence code!", actionLabel: "⌨️ Verify Number!", target: 0 },
    { title: "☕ Task: Coffee Brewer", desc: "Hold down button to fill beaker precisely to the target line!", actionLabel: "☕ Pour Espresso!", target: 70 }
];

function openMinigameSelector() {
    if (pet.isSleeping || pet.energy < 15) {
        alert("Your pet is too tired or resting to work right now!");
        return;
    }
    initAudioEngine();
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

    // Interface generation mechanics engine based on the active dynamic game index
    if(activeGameIndex === 0) {
        // Dish Scrubber
        const btn = document.createElement('button');
        btn.innerText = config.actionLabel;
        btn.style.margin = "60px auto";
        btn.style.display = "block";
        btn.onclick = () => {
            gameCurrentValue++;
            playCuteSFX('bounce');
            document.getElementById('minigame-feedback').innerText = `Scrub progress: ${gameCurrentValue}/${gameTargetValue}`;
            if(gameCurrentValue >= gameTargetValue) winMinigamePayout();
        };
        surface.appendChild(btn);
    } 
    else if(activeGameIndex === 1) {
        // Box Stacker slider timing system
        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = 10;
        slider.style.width = "80%"; slider.style.margin = "40px 10%";
        slider.id = "stacker-slider";
        surface.appendChild(slider);

        let dynamicDir = 4;
        const loopInt = setInterval(() => {
            if(!document.getElementById('stacker-slider')) { clearInterval(loopInt); return; }
            let val = parseInt(slider.value);
            if(val >= 100 || val <= 0) dynamicDir *= -1;
            slider.value = val + dynamicDir;
        }, 30);

        const btn = document.createElement('button');
        btn.innerText = config.actionLabel;
        btn.style.margin = "10px auto"; btn.style.display = "block";
        btn.onclick = () => {
            let finalVal = parseInt(slider.value);
            if(finalVal >= gameTargetValue) {
                clearInterval(loopInt);
                winMinigamePayout();
            } else {
                playCuteSFX('sad');
                document.getElementById('minigame-feedback').innerText = `Missed! Slider timing score was [${finalVal}]. Try again!`;
            }
        };
        surface.appendChild(btn);
    }
    else if(activeGameIndex === 2) {
        // Floor Sweeper target hunter node
        const targetObj = document.createElement('div');
        targetObj.innerText = "🏽"; targetObj.style.position = "absolute";
        targetObj.style.fontSize = "2rem"; targetObj.style.cursor = "pointer";
        targetObj.style.left = "40px"; targetObj.style.top = "40px";
        
        targetObj.onclick = () => {
            winMinigamePayout();
        };
        
        setInterval(() => {
            targetObj.style.left = `${Math.random() * 80}%`;
            targetObj.style.top = `${Math.random() * 70}%`;
        }, 900);
        
        surface.appendChild(targetObj);
    }
    else if(activeGameIndex === 3) {
        // Data Entry verification sequence text matcher engine logic
        const targetPass = Math.floor(1000 + Math.random() * 9000);
        gameTargetValue = targetPass;

        const label = document.createElement('p');
        label.innerText = `System Code Entry: ${targetPass}`;
        label.style.textAlign = "center"; label.style.color = "#fff";
        surface.appendChild(label);

        const input = document.createElement('input');
        input.type = "number"; input.placeholder = "Type entry key...";
        input.style.display = "block"; input.style.margin = "10px auto";
        input.id = "data-input-field";
        surface.appendChild(input);

        const btn = document.createElement('button');
        btn.innerText = config.actionLabel;
        btn.style.margin = "5px auto"; btn.style.display = "block";
        btn.onclick = () => {
            if(parseInt(input.value) === gameTargetValue) {
                winMinigamePayout();
            } else {
                playCuteSFX('sad');
                document.getElementById('minigame-feedback').innerText = "Incorrect sequence! Check matching verification strings.";
            }
        };
        surface.appendChild(btn);
    }
    else if(activeGameIndex === 4) {
        // Coffee Pour holding duration game
        const fluidTank = document.createElement('div');
        fluidTank.style.background = "#333"; fluidTank.style.width = "40px"; fluidTank.style.height = "100px";
        fluidTank.style.margin = "10px auto"; fluidTank.style.position = "relative";
        
        const fluidFill = document.createElement('div');
        fluidFill.style.background = "#70a1ff"; fluidFill.style.width = "100%"; fluidFill.style.height = "0%";
        fluidFill.style.position = "absolute"; fluidFill.style.bottom = "0";
        fluidTank.appendChild(fluidFill);
        surface.appendChild(fluidTank);

        const btn = document.createElement('button');
        btn.innerText = config.actionLabel;
        btn.style.margin = "5px auto"; btn.style.display = "block";
        
        let pourInterval;
        btn.onmousedown = () => {
            pourInterval = setInterval(() => {
                gameCurrentValue = Math.min(100, gameCurrentValue + 2);
                fluidFill.style.height = `${gameCurrentValue}%`;
                playCuteSFX('click');
            }, 50);
        };
        
        btn.onmouseup = () => {
            clearInterval(pourInterval);
            if(gameCurrentValue >= 65 && gameCurrentValue <= 80) {
                winMinigamePayout();
            } else {
                playCuteSFX('sad');
                document.getElementById('minigame-feedback').innerText = `Overflow/Underflow! Filled total to: [${gameCurrentValue}%]. Target was 70%`;
                gameCurrentValue = 0; fluidFill.style.height = "0%";
            }
        };
        surface.appendChild(btn);
    }
}

function winMinigamePayout() {
    playCuteSFX('work');
    pet.money += 35;
    pet.energy = Math.max(0, pet.energy - 15);
    pet.happiness = Math.max(0, pet.happiness - 5);
    
    document.getElementById('minigame-feedback').innerText = "🎉 Task Completed successfully! Earned +\$35 cash payroll.";
    document.getElementById('minigame-playground').innerHTML = "⚙️ JOB SLOT FREE";
    document.getElementById('btn-close-game').style.display = 'block';
    
    updateGlobalUI();
}
