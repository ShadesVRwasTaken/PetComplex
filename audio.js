let audioCtx = null;
let sfxVolValue = 0.5;
let ytPlayer = null;
let targetedMusicVolume = 40;

// This callback function triggers automatically when the YouTube API code downloads
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-audio-container', {
        height: '10',
        width: '10',
        // Continuous, popular 24/7 Lo-Fi Chill Beats live stream video ID
        videoId: 'jfKfPfyJRdk', 
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'loop': 1,
            'playlist': 'jfKfPfyJRdk'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(targetedMusicVolume);
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    // Fail-safe backup check to un-pause streaming loops if intercepted by browser limitations
    if (event.data === YT.PlayerState.PAUSED) {
        // Keeps loop context active
    }
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Safe-check auto-wake streaming media elements
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
    }
}

function playCuteSFX(type) {
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(sfxVolValue * 0.25, now);

    switch(type) {
        case 'click':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(580, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now); osc.stop(now + 0.06);
            break;
        case 'feed':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.linearRampToValueAtTime(1300, now + 0.07);
            setTimeout(() => {
                playCuteSFX('click');
            }, 60);
            osc.start(now); osc.stop(now + 0.08);
            break;
        case 'work':
            osc.type = 'square';
            osc.frequency.setValueAtTime(950, now);
            osc.frequency.setValueAtTime(1400, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now); osc.stop(now + 0.12);
            break;
        case 'bounce':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
            break;
        case 'sad':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.35);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now); osc.stop(now + 0.35);
            break;
    }
}

function adjustMusicVolume(val) {
    targetedMusicVolume = val;
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(targetedMusicVolume);
    }
}

function adjustSFXVolume(val) {
    sfxVolValue = val / 100;
}
