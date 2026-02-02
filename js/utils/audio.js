/**
 * UNDERTALE Web Recreation - Audio Manager
 * Handles music playback, sound effects, and volume control
 */

class AudioManager {
    constructor(game) {
        this.game = game;
        
        // Audio elements
        this.bgm = document.getElementById('bgm');
        this.sfx = document.getElementById('sfx');
        
        // Volume settings
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.masterVolume = 1.0;
        
        // Current track
        this.currentMusic = null;
        this.musicPaused = false;
        
        // Audio cache
        this.audioCache = {};
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set initial volumes
        if (this.bgm) {
            this.bgm.volume = this.musicVolume * this.masterVolume;
            this.bgm.loop = true;
        }
        if (this.sfx) {
            this.sfx.volume = this.sfxVolume * this.masterVolume;
        }
        
        // Load settings from localStorage
        this.loadSettings();
    }
    
    /**
     * Play background music
     */
    playMusic(musicId, fadeIn = true) {
        if (!this.bgm || this.currentMusic === musicId) return;
        
        const musicPath = `assets/audio/music/${musicId}.ogg`;
        
        if (fadeIn && this.currentMusic) {
            // Fade out current music
            this.fadeOutMusic(() => {
                this.loadAndPlayMusic(musicPath, musicId);
            });
        } else {
            this.loadAndPlayMusic(musicPath, musicId);
        }
    }
    
    /**
     * Load and play music file
     */
    loadAndPlayMusic(path, musicId) {
        this.bgm.src = path;
        this.bgm.volume = 0;
        this.currentMusic = musicId;
        
        const playPromise = this.bgm.play();
        if (playPromise) {
            playPromise.then(() => {
                this.fadeInMusic();
            }).catch(err => {
                console.log('Music autoplay blocked, waiting for user interaction');
                // Will play on first user interaction
                document.addEventListener('click', () => {
                    if (this.currentMusic === musicId) {
                        this.bgm.play();
                        this.fadeInMusic();
                    }
                }, { once: true });
            });
        }
    }
    
    /**
     * Fade in music
     */
    fadeInMusic() {
        const targetVolume = this.musicVolume * this.masterVolume;
        const step = targetVolume / 20;
        
        const fade = () => {
            if (this.bgm.volume < targetVolume - step) {
                this.bgm.volume += step;
                requestAnimationFrame(fade);
            } else {
                this.bgm.volume = targetVolume;
            }
        };
        
        fade();
    }
    
    /**
     * Fade out music
     */
    fadeOutMusic(callback) {
        const step = this.bgm.volume / 20;
        
        const fade = () => {
            if (this.bgm.volume > step) {
                this.bgm.volume -= step;
                requestAnimationFrame(fade);
            } else {
                this.bgm.volume = 0;
                this.bgm.pause();
                if (callback) callback();
            }
        };
        
        fade();
    }
    
    /**
     * Stop music
     */
    stopMusic(fadeOut = true) {
        if (!this.bgm) return;
        
        if (fadeOut) {
            this.fadeOutMusic(() => {
                this.currentMusic = null;
            });
        } else {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    /**
     * Pause music
     */
    pauseMusic() {
        if (this.bgm && !this.bgm.paused) {
            this.bgm.pause();
            this.musicPaused = true;
        }
    }
    
    /**
     * Resume music
     */
    resumeMusic() {
        if (this.bgm && this.musicPaused) {
            this.bgm.play();
            this.musicPaused = false;
        }
    }
    
    /**
     * Play sound effect
     */
    playSFX(sfxId, volumeMultiplier = 1.0) {
        const sfxPath = `assets/audio/sfx/${sfxId}.ogg`;
        
        // Create new audio element for overlapping sounds
        const audio = new Audio(sfxPath);
        audio.volume = this.sfxVolume * this.masterVolume * volumeMultiplier;
        
        audio.play().catch(err => {
            // Sound blocked, ignore
        });
        
        // Clean up after playing
        audio.addEventListener('ended', () => {
            audio.remove();
        });
    }
    
    /**
     * Play text sound (character voice)
     */
    playTextSound(characterId) {
        const soundMap = {
            default: SFX.TEXT,
            flowey: SFX.TEXT_FLOWEY,
            toriel: SFX.TEXT_TORIEL,
            sans: SFX.TEXT_SANS,
            papyrus: SFX.TEXT_PAPYRUS
        };
        
        const sfxId = soundMap[characterId] || soundMap.default;
        this.playSFX(sfxId, 0.5);
    }
    
    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = this.musicVolume * this.masterVolume;
        }
        this.saveSettings();
    }
    
    /**
     * Set SFX volume
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = this.musicVolume * this.masterVolume;
        }
        this.saveSettings();
    }
    
    /**
     * Save audio settings
     */
    saveSettings() {
        const settings = {
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            masterVolume: this.masterVolume
        };
        localStorage.setItem('undertale_audio', JSON.stringify(settings));
    }
    
    /**
     * Load audio settings
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('undertale_audio');
            if (saved) {
                const settings = JSON.parse(saved);
                this.musicVolume = settings.musicVolume ?? 0.7;
                this.sfxVolume = settings.sfxVolume ?? 0.8;
                this.masterVolume = settings.masterVolume ?? 1.0;
            }
        } catch (e) {
            // Use defaults
        }
    }
    
    /**
     * Preload audio files
     */
    preload(audioList) {
        return Promise.all(audioList.map(id => {
            return new Promise((resolve) => {
                const audio = new Audio(`assets/audio/${id}.ogg`);
                audio.addEventListener('canplaythrough', () => {
                    this.audioCache[id] = audio;
                    resolve();
                });
                audio.addEventListener('error', () => {
                    console.warn(`Failed to load audio: ${id}`);
                    resolve();
                });
            });
        }));
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
