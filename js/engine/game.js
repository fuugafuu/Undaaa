/**
 * UNDERTALE Web Recreation - Main Game Engine
 * Core game loop, state management, and system coordination
 */

class Game {
    constructor() {
        this.state = STATE.TITLE;
        this.running = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.frameTime = 1000 / GAME.FPS;
        
        // Core systems
        this.input = null;
        this.audio = null;
        this.renderer = null;
        this.dialogue = null;
        this.battle = null;
        this.mapEngine = null;
        this.save = null;
        
        // Player data
        this.player = {
            name: '',
            hp: 20,
            maxHp: 20,
            lv: 1,
            exp: 0,
            gold: 0,
            at: 0,
            df: 0,
            weapon: null,
            armor: null,
            inventory: [],
            x: 0,
            y: 0,
            direction: 'down',
            moving: false
        };
        
        // Game flags (persistent state)
        this.flags = new GameFlags();
        
        // Current area/room
        this.currentArea = null;
        this.currentRoom = null;
        
        // Phone contacts
        this.phoneContacts = [];
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Initialize all game systems
     */
    async init() {
        console.log('Initializing UNDERTALE Web...');
        
        // Initialize systems
        this.input = new InputManager(this);
        this.audio = new AudioManager(this);
        this.renderer = new Renderer(this);
        this.dialogue = new DialogueSystem(this);
        this.battle = new BattleSystem(this);
        this.mapEngine = new MapEngine(this);
        this.save = new SaveManager(this);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load save if exists
        const hasSave = await this.save.checkSave();
        
        // Show title screen
        this.showTitleScreen(hasSave);
        
        // Start game loop
        this.running = true;
        requestAnimationFrame((time) => this.gameLoop(time));
        
        console.log('Game initialized!');
    }
    
    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Title menu clicks
        document.querySelectorAll('.title-menu .menu-item').forEach((item, index) => {
            item.addEventListener('click', () => this.handleTitleMenuClick(index));
        });
        
        // Name input - Keyboard buttons
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleKeyboardInput(btn.dataset.char));
        });
        
        // Name control buttons
        document.getElementById('btn-quit')?.addEventListener('click', () => this.quitNaming());
        document.getElementById('btn-backspace')?.addEventListener('click', () => this.backspaceName());
        document.getElementById('btn-done')?.addEventListener('click', () => this.confirmName());
        
        // Confirmation buttons
        document.getElementById('name-yes')?.addEventListener('click', () => this.acceptName());
        document.getElementById('name-no')?.addEventListener('click', () => this.rejectName());
        
        // Game over options
        document.querySelectorAll('.gameover-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleGameOverChoice(index));
        });
    }
    
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.accumulator += deltaTime;
        
        // Fixed timestep updates
        while (this.accumulator >= this.frameTime) {
            this.update();
            this.accumulator -= this.frameTime;
        }
        
        // Render
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Update game state
     */
    update() {
        // Update input
        this.input.update();
        
        // State-specific updates
        switch (this.state) {
            case STATE.TITLE:
                this.updateTitleScreen();
                break;
            case STATE.NAMING:
                // Handled by events
                break;
            case STATE.OVERWORLD:
                this.updateOverworld();
                break;
            case STATE.BATTLE:
                this.battle.update();
                break;
            case STATE.DIALOGUE:
                this.dialogue.update();
                break;
            case STATE.MENU:
                this.updateMenu();
                break;
            case STATE.CUTSCENE:
                this.updateCutscene();
                break;
        }
    }
    
    /**
     * Render current state
     */
    render() {
        switch (this.state) {
            case STATE.OVERWORLD:
                this.renderer.renderOverworld();
                break;
            case STATE.BATTLE:
                // Battle rendering handled by CSS and DOM
                break;
        }
    }
    
    /**
     * Show a specific screen
     */
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screenId = `${screenName}-screen`;
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }
    
    /**
     * Show title screen
     */
    showTitleScreen(hasSave) {
        this.state = STATE.TITLE;
        this.showScreen('title');
        
        // Update continue button
        const continueBtn = document.querySelector('[data-action="continue"]');
        if (continueBtn) {
            continueBtn.style.opacity = hasSave ? '1' : '0.5';
            continueBtn.style.pointerEvents = hasSave ? 'auto' : 'none';
        }
        
        this.titleMenuIndex = 0;
        this.updateTitleMenuSelection();
    }
    
    /**
     * Update title screen
     */
    updateTitleScreen() {
        if (this.input.justPressed('up')) {
            this.titleMenuIndex = Math.max(0, this.titleMenuIndex - 1);
            this.audio.playSFX(SFX.SELECT);
            this.updateTitleMenuSelection();
        } else if (this.input.justPressed('down')) {
            this.titleMenuIndex = Math.min(2, this.titleMenuIndex + 1);
            this.audio.playSFX(SFX.SELECT);
            this.updateTitleMenuSelection();
        } else if (this.input.justPressed('confirm')) {
            this.handleTitleMenuClick(this.titleMenuIndex);
        }
    }
    
    /**
     * Update title menu selection visual
     */
    updateTitleMenuSelection() {
        document.querySelectorAll('.title-menu .menu-item').forEach((item, i) => {
            item.classList.toggle('selected', i === this.titleMenuIndex);
        });
    }
    
    /**
     * Handle title menu selection
     */
    handleTitleMenuClick(index) {
        this.audio.playSFX(SFX.CONFIRM);
        
        switch (index) {
            case 0: // New Game
                this.startNaming();
                break;
            case 1: // Continue
                this.loadGame();
                break;
            case 2: // Settings
                this.showSettings();
                break;
        }
    }
    
    /**
     * Start name input screen
     */
    startNaming() {
        this.state = STATE.NAMING;
        this.showScreen('name');
        
        // Reset name
        this.currentName = '';
        this.updateNameDisplay();
        
        // Hide dialogs
        document.getElementById('name-confirm-dialog')?.classList.add('hidden');
        document.getElementById('special-name-msg')?.classList.add('hidden');
    }
    
    /**
     * Handle keyboard button input
     */
    handleKeyboardInput(char) {
        if (!char || char === '') return;
        if (this.currentName.length >= 6) return;
        
        this.currentName += char;
        this.updateNameDisplay();
        
        // Visual feedback
        // this.audio.playSFX(SFX.SELECT);
    }
    
    /**
     * Update the name display
     */
    updateNameDisplay() {
        const display = document.getElementById('name-display-text');
        if (display) {
            display.textContent = this.currentName;
        }
    }
    
    /**
     * Backspace - remove last character
     */
    backspaceName() {
        if (this.currentName.length > 0) {
            this.currentName = this.currentName.slice(0, -1);
            this.updateNameDisplay();
            // this.audio.playSFX(SFX.SELECT);
        }
    }
    
    /**
     * Quit naming - return to title
     */
    quitNaming() {
        // this.audio.playSFX(SFX.CANCEL);
        this.showTitleScreen(false);
    }
    
    /**
     * Handle name input (legacy - not used with keyboard)
     */
    handleNameInput() {
        // Not used with keyboard input
    }
    
    /**
     * Confirm name entry
     */
    confirmName() {
        const name = this.currentName.trim();
        
        if (name.length === 0) return;
        
        // Check for special names
        if (typeof SPECIAL_NAMES !== 'undefined' && SPECIAL_NAMES[name]) {
            const special = SPECIAL_NAMES[name];
            if (special.mode === 'hard') {
                // Hard mode warning
                document.getElementById('confirm-name').textContent = name;
                const msgEl = document.getElementById('special-name-msg');
                if (msgEl) {
                    msgEl.innerHTML = `<p style="color:#ff0">${name}</p><p>${special.message}</p><p style="margin-top:15px;font-size:16px;">（Zキーで続行）</p>`;
                    msgEl.classList.remove('hidden');
                }
                return;
            } else if (special.message) {
                // Other special name message
                const msgEl = document.getElementById('special-name-msg');
                if (msgEl) {
                    msgEl.innerHTML = special.message;
                    msgEl.classList.remove('hidden');
                    setTimeout(() => {
                        msgEl.classList.add('hidden');
                    }, 2000);
                }
                return;
            }
        }
        
        // Normal name confirmation
        document.getElementById('confirm-name').textContent = name;
        document.getElementById('name-confirm-dialog')?.classList.remove('hidden');
        
        // this.audio.playSFX(SFX.CONFIRM);
    }
    
    /**
     * Accept the entered name
     */
    acceptName() {
        this.player.name = this.currentName.trim() || 'CHARA';
        // this.audio.playSFX(SFX.CONFIRM);
        this.startNewGame();
    }
    
    /**
     * Reject name and re-enter
     */
    rejectName() {
        // this.audio.playSFX(SFX.CANCEL);
        document.getElementById('name-confirm-dialog')?.classList.add('hidden');
    }
    
    /**
     * Start a new game
     */
    async startNewGame() {
        console.log(`Starting new game as ${this.player.name}`);
        
        // Reset player stats
        this.player = {
            ...this.player,
            hp: 20,
            maxHp: 20,
            lv: 1,
            exp: 0,
            gold: 0,
            weapon: null,
            armor: null,
            inventory: []
        };
        
        // Reset flags
        this.flags.reset();
        
        // Load first area
        await this.loadArea(AREA.RUINS, RUINS_ROOMS.FALL);
        
        // Start intro sequence
        await this.playIntro();
    }
    
    /**
     * Play the game intro
     */
    async playIntro() {
        this.state = STATE.CUTSCENE;
        this.showScreen('game');
        
        // Intro narration
        const introText = [
            '昔々・・・',
            '地上には　ふたつの種族がいた。',
            'にんげん　と　モンスター。',
            'ある日　ふたつの種族の間で',
            '戦争が　はじまった。',
            '長い戦いの末・・・',
            'にんげんは　勝利をおさめた。',
            'にんげんは　モンスターを',
            '魔法の　封印で　地下に閉じ込めた。',
            '・・・・・・',
            '201X年',
            'エボット山',
            '伝説では　登った者は',
            '二度と　帰ってこないという。'
        ];
        
        for (const text of introText) {
            await this.dialogue.showText(text);
            await Utils.wait(500);
        }
        
        // Transition to actual gameplay - player wakes up on flowers
        await this.fadeToBlack();
        await Utils.wait(1000);
        await this.fadeFromBlack();
        
        // Now in the Ruins
        this.state = STATE.OVERWORLD;
        await this.startFloweyEncounter();
    }
    
    /**
     * Start the Flowey encounter
     */
    async startFloweyEncounter() {
        // Move to Flowey room
        await this.loadRoom(RUINS_ROOMS.FLOWEY);
        
        // Flowey dialogue
        await Utils.wait(500);
        
        await this.dialogue.showCharacterDialogue('flowey', [
            'やあ！',
            'ぼくは　フラウィ。',
            'フラウィ・ザ・フラワー！',
            'きみは　この世界に\nはじめて　来たんだね？',
            'まいったな・・・',
            'だれか　教えてあげないと。',
            'いいよ！　ぼくが　教えてあげる！',
            '準備は　いい？',
            'じゃあ　いくよ！'
        ]);
        
        // Start Flowey "battle" (tutorial)
        await this.battle.startBattle('flowey_tutorial');
    }
    
    /**
     * Load a game area
     */
    async loadArea(areaId, startRoom) {
        this.currentArea = areaId;
        await this.loadRoom(startRoom);
    }
    
    /**
     * Load a specific room
     */
    async loadRoom(roomId) {
        this.currentRoom = roomId;
        
        // Get room data
        const roomData = MAPS[roomId];
        if (!roomData) {
            console.error(`Room not found: ${roomId}`);
            return;
        }
        
        // Set player position
        if (roomData.spawnPoint) {
            this.player.x = roomData.spawnPoint.x;
            this.player.y = roomData.spawnPoint.y;
        }
        
        // Load room into map engine
        this.mapEngine.loadRoom(roomData);
        
        // Play area music
        if (roomData.music) {
            this.audio.playMusic(roomData.music);
        }
    }
    
    /**
     * Update overworld state
     */
    updateOverworld() {
        // Player movement
        let dx = 0, dy = 0;
        const speed = 3;
        
        if (this.input.isPressed('up')) { dy = -speed; this.player.direction = 'up'; }
        if (this.input.isPressed('down')) { dy = speed; this.player.direction = 'down'; }
        if (this.input.isPressed('left')) { dx = -speed; this.player.direction = 'left'; }
        if (this.input.isPressed('right')) { dx = speed; this.player.direction = 'right'; }
        
        this.player.moving = dx !== 0 || dy !== 0;
        
        // Check collision and move
        if (dx !== 0 || dy !== 0) {
            const newX = this.player.x + dx;
            const newY = this.player.y + dy;
            
            if (!this.mapEngine.checkCollision(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
            }
        }
        
        // Check for encounters
        if (this.player.moving) {
            this.mapEngine.checkRandomEncounter();
        }
        
        // Check for room transitions
        this.mapEngine.checkRoomTransitions();
        
        // Interact button
        if (this.input.justPressed('confirm')) {
            this.mapEngine.checkInteraction();
        }
        
        // Menu button
        if (this.input.justPressed('menu')) {
            this.openMenu();
        }
    }
    
    /**
     * Update menu state
     */
    updateMenu() {
        // Menu navigation handled by separate menu system
    }
    
    /**
     * Update cutscene state
     */
    updateCutscene() {
        // Cutscenes are scripted, minimal input handling
        if (this.input.justPressed('confirm')) {
            // Advance dialogue if showing
            if (this.dialogue.active) {
                this.dialogue.advance();
            }
        }
    }
    
    /**
     * Open in-game menu
     */
    openMenu() {
        this.state = STATE.MENU;
        document.getElementById('game-menu').classList.remove('hidden');
        this.audio.playSFX(SFX.SELECT);
    }
    
    /**
     * Close in-game menu
     */
    closeMenu() {
        this.state = STATE.OVERWORLD;
        document.getElementById('game-menu').classList.add('hidden');
    }
    
    /**
     * Load saved game
     */
    async loadGame() {
        const saveData = await this.save.load();
        if (saveData) {
            this.player = saveData.player;
            this.flags.data = saveData.flags;
            this.currentArea = saveData.area;
            
            await this.loadRoom(saveData.room);
            this.state = STATE.OVERWORLD;
            this.showScreen('game');
        }
    }
    
    /**
     * Save the game
     */
    async saveGame() {
        const saveData = {
            player: this.player,
            flags: this.flags.data,
            area: this.currentArea,
            room: this.currentRoom,
            timestamp: Date.now()
        };
        
        await this.save.save(saveData);
        this.audio.playSFX(SFX.SAVE);
    }
    
    /**
     * Handle game over choice
     */
    handleGameOverChoice(index) {
        if (index === 0) {
            // Continue - reload last save
            this.loadGame();
        } else {
            // Give up - return to title
            this.showTitleScreen(true);
        }
    }
    
    /**
     * Resume overworld music after battle
     */
    resumeOverworldMusic() {
        const roomData = MAPS[this.currentRoom];
        if (roomData && roomData.music) {
            this.audio.playMusic(roomData.music);
        }
    }
    
    /**
     * Screen fade effects
     */
    fadeToBlack() {
        return new Promise(resolve => {
            const container = document.getElementById('game-container');
            container.style.transition = 'opacity 1s';
            container.style.opacity = '0';
            setTimeout(resolve, 1000);
        });
    }
    
    fadeFromBlack() {
        return new Promise(resolve => {
            const container = document.getElementById('game-container');
            container.style.opacity = '1';
            setTimeout(resolve, 1000);
        });
    }
    
    /**
     * Add item to inventory
     */
    addItem(item) {
        if (this.player.inventory.length >= 8) {
            return false; // Inventory full
        }
        this.player.inventory.push(item);
        return true;
    }
    
    /**
     * Remove item from inventory
     */
    removeItem(index) {
        if (index >= 0 && index < this.player.inventory.length) {
            this.player.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * Add phone contact
     */
    addPhoneContact(contact) {
        if (!this.phoneContacts.find(c => c.id === contact.id)) {
            this.phoneContacts.push(contact);
        }
    }
    
    /**
     * Show settings menu
     */
    showSettings() {
        // TODO: Implement settings
        console.log('Settings not yet implemented');
    }
}

/**
 * Game Flags - Persistent state tracking
 */
class GameFlags {
    constructor() {
        this.data = {};
    }
    
    set(key, value) {
        this.data[key] = value;
    }
    
    get(key, defaultValue = null) {
        return this.data.hasOwnProperty(key) ? this.data[key] : defaultValue;
    }
    
    has(key) {
        return this.data.hasOwnProperty(key);
    }
    
    increment(key, amount = 1) {
        this.data[key] = (this.data[key] || 0) + amount;
        return this.data[key];
    }
    
    reset() {
        this.data = {};
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Game, GameFlags };
}
