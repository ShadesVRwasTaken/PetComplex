let audioCtx = null;
let musicInterval = null;
let musicVolValue = 0.3;
let sfxVolValue = 0.5;

function initAudioEngine() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        startLofiMusicLoop();
    }
}

function playCuteSFX(type) {
    initAudioEngine();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(sfxVolValue * 0.3, now);

    switch(type) {
        case 'click':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now); osc.stop(now + 0.05);
            break;
        case 'feed':
            // "Chirp-chirp!" dynamic sequence
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
            setTimeout(() => {
                playCuteSFX('click');
            }, 80);
            osc.start(now); osc.stop(now + 0.1);
            break;
        case 'work':
            // High sparkling electronic chime
            osc.type = 'square';
            osc.frequency.setValueAtTime(1046.50, now); // C6
            osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now); osc.stop(now + 0.15);
            break;
        case 'bounce':
            // Playful bounce sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.quadraticRampToValueAtTime(550, now + 0.12);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now); osc.stop(now + 0.12);
            break;
        case 'sad':
            // Whining falling pitch down registers
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.linearRampToValueAtTime(180, now + 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
            break;
    }
}

// Procedural Lo-Fi Chords & Vinyl crackle back engine
function startLofiMusicLoop() {
    const lofiChords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (Chill-hop tone)
        [349.23, 440.00, 523.25, 659.26], // Fmaj7
        [293.66, 349.23, 440.00, 587.33], // Dmin7
        [311.13, 392.00, 466.16, 587.33]  // Ebmaj7
    ];
    let chordIndex = 0;

    musicInterval = setInterval(() => {
        if (musicVolValue <= 0) return;
        const now = audioCtx.currentTime;
        const currentChord = lofiChords[chordIndex];

        // Synthesize soft, warm lo-fi key chords
        currentChord.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = 'triangle'; // Soft analog texture
            osc.frequency.setValueAtTime(freq, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(musicVolValue * 0.04, now + 0.5); // Slow jazz attack
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 2.5);
        });

        // Add a procedural lo-fi high melodic tap chime
        if(Math.random() > 0.3) {
            const note = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
            const tintOsc = audioCtx.createOscillator();
            const tintGain = audioCtx.createGain();
            tintOsc.type = 'sine';
            tintOsc.frequency.setValueAtTime(note, now + 0.6);
            tintGain.gain.setValueAtTime(musicVolValue * 0.02, now + 0.6);
            tintGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            tintOsc.connect(tintGain);
            tintGain.connect(audioCtx.destination);
            tintOsc.start(now + 0.6);
            tintOsc.stop(now + 1.2);
        }

        chordIndex = (chordIndex + 1) % lofiChords.length;
    }, 2800);
}

function adjustMusicVolume(val) {
    musicVolValue = val / 100;
    initAudioEngine();
}

function adjustSFXVolume(val) {
    sfxVolValue = val / 100;
    initAudioEngine();
}
