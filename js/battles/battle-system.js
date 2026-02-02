/**
 * UNDERTALE Web Recreation - Battle System
 * Core battle mechanics with accurate damage formulas and turn management
 */

class BattleSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.phase = null;
        this.enemy = null;
        this.enemies = [];
        this.turns = 0;
        this.enemyFlags = {};
        
        // Battle box dimensions
        this.box = {
            x: 32,
            y: 250,
            width: BATTLE.BOX_DEFAULT_WIDTH,
            height: BATTLE.BOX_DEFAULT_HEIGHT
        };
        
        // Soul state
        this.soul = {
            x: 0,
            y: 0,
            mode: SOUL_MODE.RED,
            invincible: false,
            invincibilityTimer: 0,
            velocityY: 0,  // For blue soul
            grounded: false
        };
        
        // Attack meter
        this.attackMeter = {
            active: false,
            position: 0,
            direction: 1,
            speed: BATTLE.ATTACK_METER_SPEED
        };
        
        // Bullets array
        this.bullets = [];
        this.bulletTimer = 0;
        this.attackDuration = 0;
        
        // Menu state
        this.menuIndex = 0;
        this.submenuIndex = 0;
        this.submenuItems = [];
        
        // DOM elements
        this.elements = {};
        this.initElements();
    }
    
    initElements() {
        this.elements = {
            screen: document.getElementById('battle-screen'),
            enemyArea: document.getElementById('enemy-area'),
            enemySprite: document.getElementById('enemy-sprite'),
            enemyDialogue: document.getElementById('enemy-dialogue'),
            battleBox: document.getElementById('battle-box'),
            playerSoul: document.getElementById('player-soul'),
            battleText: document.getElementById('battle-text'),
            battleMenu: document.getElementById('battle-menu'),
            battleSubmenu: document.getElementById('battle-submenu'),
            battleStats: document.getElementById('battle-stats'),
            hpBar: document.getElementById('hp-bar'),
            hpVal: document.getElementById('stat-hp-val'),
            hpMax: document.getElementById('stat-hp-max'),
            lvVal: document.getElementById('stat-lv-val'),
            attackMeter: document.getElementById('attack-meter'),
            attackCursor: document.getElementById('attack-cursor')
        };
    }
    
    /**
     * Start a battle encounter
     */
    async startBattle(enemyId, encounterData = {}) {
        const enemyData = ENEMIES[enemyId];
        if (!enemyData) {
            console.error(`Enemy not found: ${enemyId}`);
            return;
        }
        
        this.active = true;
        this.enemy = { ...enemyData, currentHp: enemyData.hp };
        this.enemies = [this.enemy];
        this.turns = 0;
        this.enemyFlags = {};
        
        // Reset soul
        this.soul.x = this.box.width / 2;
        this.soul.y = this.box.height / 2;
        this.soul.mode = SOUL_MODE.RED;
        this.soul.invincible = false;
        
        // Show battle screen
        this.game.showScreen('battle');
        
        // Set up enemy sprite
        this.renderEnemySprite();
        
        // Update stats display
        this.updateStats();
        
        // Play encounter music
        if (enemyData.music) {
            this.game.audio.playMusic(enemyData.music);
        } else {
            this.game.audio.playMusic(MUSIC.ENEMY_APPROACHING);
        }
        
        // Play encounter sound
        this.game.audio.playSFX(SFX.ENCOUNTER);
        
        // Show encounter text
        await this.showText(enemyData.encounterText);
        
        // Start battle menu
        this.setPhase(BATTLE_PHASE.MENU);
    }
    
    /**
     * Set battle phase
     */
    setPhase(phase) {
        this.phase = phase;
        
        switch (phase) {
            case BATTLE_PHASE.MENU:
                this.showMainMenu();
                break;
            case BATTLE_PHASE.FIGHT:
                this.startFightPhase();
                break;
            case BATTLE_PHASE.ACT:
                this.showActMenu();
                break;
            case BATTLE_PHASE.ITEM:
                this.showItemMenu();
                break;
            case BATTLE_PHASE.MERCY:
                this.showMercyMenu();
                break;
            case BATTLE_PHASE.ENEMY_TURN:
                this.startEnemyTurn();
                break;
        }
    }
    
    /**
     * Show main battle menu
     */
    showMainMenu() {
        this.elements.battleSubmenu.classList.add('hidden');
        this.elements.battleMenu.classList.remove('hidden');
        this.menuIndex = 0;
        this.updateMenuSelection();
        
        // Show flavor text
        const flavor = Utils.randomChoice(this.enemy.flavorTexts);
        this.elements.battleText.textContent = flavor;
    }
    
    /**
     * Update menu button selection
     */
    updateMenuSelection() {
        const buttons = this.elements.battleMenu.querySelectorAll('.battle-btn');
        buttons.forEach((btn, i) => {
            btn.classList.toggle('selected', i === this.menuIndex);
        });
    }
    
    /**
     * Handle menu input
     */
    handleMenuInput(key) {
        if (this.phase === BATTLE_PHASE.MENU) {
            if (key === 'left') {
                this.menuIndex = Math.max(0, this.menuIndex - 1);
                this.game.audio.playSFX(SFX.SELECT);
            } else if (key === 'right') {
                this.menuIndex = Math.min(3, this.menuIndex + 1);
                this.game.audio.playSFX(SFX.SELECT);
            } else if (key === 'confirm') {
                this.selectMenuOption();
            }
            this.updateMenuSelection();
        } else if (this.phase === BATTLE_PHASE.ACT || 
                   this.phase === BATTLE_PHASE.ITEM || 
                   this.phase === BATTLE_PHASE.MERCY) {
            this.handleSubmenuInput(key);
        }
    }
    
    /**
     * Select current menu option
     */
    selectMenuOption() {
        this.game.audio.playSFX(SFX.CONFIRM);
        
        switch (this.menuIndex) {
            case 0: // FIGHT
                this.setPhase(BATTLE_PHASE.FIGHT);
                break;
            case 1: // ACT
                this.setPhase(BATTLE_PHASE.ACT);
                break;
            case 2: // ITEM
                this.setPhase(BATTLE_PHASE.ITEM);
                break;
            case 3: // MERCY
                this.setPhase(BATTLE_PHASE.MERCY);
                break;
        }
    }
    
    /**
     * Start FIGHT phase with attack meter
     */
    startFightPhase() {
        this.elements.battleMenu.classList.add('hidden');
        this.attackMeter.active = true;
        this.attackMeter.position = 0;
        this.attackMeter.direction = 1;
        
        this.elements.attackMeter.classList.remove('hidden');
        this.elements.attackCursor.style.left = '0px';
        
        // Start attack meter animation
        this.attackMeterLoop();
    }
    
    /**
     * Attack meter animation loop
     */
    attackMeterLoop() {
        if (!this.attackMeter.active) return;
        
        this.attackMeter.position += this.attackMeter.direction * this.attackMeter.speed;
        
        // Bounce at edges
        const maxPos = 492; // 500 - cursor width
        if (this.attackMeter.position >= maxPos || this.attackMeter.position <= 0) {
            this.attackMeter.direction *= -1;
        }
        
        this.elements.attackCursor.style.left = `${this.attackMeter.position}px`;
        
        if (this.attackMeter.active) {
            requestAnimationFrame(() => this.attackMeterLoop());
        }
    }
    
    /**
     * Execute attack when player confirms
     */
    async executeAttack() {
        this.attackMeter.active = false;
        this.elements.attackMeter.classList.add('hidden');
        
        // Calculate hit quality (0 to 1, 1 being center)
        const centerPos = 250;
        const distance = Math.abs(this.attackMeter.position - centerPos);
        const maxDistance = 250;
        const hitMultiplier = 1 - (distance / maxDistance);
        
        // Check if critical hit (center zone)
        const isCritical = distance < 20;
        
        // Calculate damage
        const player = this.game.player;
        const weaponAtk = player.weapon ? player.weapon.atk : 0;
        const enemyDef = this.getEnemyDef();
        
        let damage = Utils.calculatePlayerDamage(
            LV_STATS[player.lv].at + 10, // Base AT is 10 higher internally
            weaponAtk,
            enemyDef,
            hitMultiplier
        );
        
        // Check for special cases (Toriel low HP, etc.)
        if (this.enemy.getEffectiveDef) {
            const effectiveDef = this.enemy.getEffectiveDef(this, player);
            if (effectiveDef < 0) {
                damage = this.enemy.currentHp; // One-shot
            }
        }
        
        // Play attack sound
        this.game.audio.playSFX(SFX.ATTACK);
        
        // Show damage
        this.showDamageNumber(damage, isCritical);
        
        // Apply damage
        this.enemy.currentHp -= damage;
        
        // Enemy hit animation
        this.elements.enemySprite.classList.add('enemy-hit');
        setTimeout(() => {
            this.elements.enemySprite.classList.remove('enemy-hit');
        }, 200);
        
        // Check if enemy defeated
        if (this.enemy.currentHp <= 0) {
            if (this.enemy.cantDie) {
                this.enemy.currentHp = 1;
                await this.showText('パピルスは　まだ　あきらめない！');
            } else {
                await this.enemyDefeated();
                return;
            }
        }
        
        // Custom onHit behavior
        if (this.enemy.onHit) {
            const result = this.enemy.onHit(damage);
            if (result && result.noDamage) {
                this.enemy.currentHp += damage; // Restore HP
            }
            if (result && result.text) {
                await this.showText(result.text);
            }
        }
        
        // Proceed to enemy turn
        this.setPhase(BATTLE_PHASE.ENEMY_TURN);
    }
    
    /**
     * Get enemy's effective defense
     */
    getEnemyDef() {
        if (this.enemy.getEffectiveDef) {
            return this.enemy.getEffectiveDef(this, this.game.player);
        }
        return this.enemy.def;
    }
    
    /**
     * Show damage number animation
     */
    showDamageNumber(damage, isCritical = false) {
        const numEl = document.createElement('div');
        numEl.className = 'damage-number' + (isCritical ? ' critical' : '');
        numEl.textContent = damage;
        
        const rect = this.elements.enemySprite.getBoundingClientRect();
        numEl.style.left = `${rect.left + rect.width / 2}px`;
        numEl.style.top = `${rect.top}px`;
        
        document.body.appendChild(numEl);
        
        setTimeout(() => numEl.remove(), 1000);
    }
    
    /**
     * Show ACT menu
     */
    showActMenu() {
        this.submenuItems = this.enemy.acts || [];
        this.submenuIndex = 0;
        this.renderSubmenu();
    }
    
    /**
     * Show ITEM menu
     */
    showItemMenu() {
        this.submenuItems = this.game.player.inventory.map((item, i) => ({
            name: item.name,
            effect: 'use_item',
            itemIndex: i,
            item: item
        }));
        
        if (this.submenuItems.length === 0) {
            this.submenuItems = [{ name: 'アイテムがない', effect: 'none' }];
        }
        
        this.submenuIndex = 0;
        this.renderSubmenu();
    }
    
    /**
     * Show MERCY menu
     */
    showMercyMenu() {
        const spareable = this.checkSpareCondition();
        
        this.submenuItems = [
            { 
                name: 'にがす', 
                effect: 'spare',
                highlight: spareable ? 'yellow' : null
            },
            { 
                name: 'にげる', 
                effect: 'flee',
                disabled: !this.enemy.canFlee
            }
        ];
        
        this.submenuIndex = 0;
        this.renderSubmenu();
    }
    
    /**
     * Check if enemy can be spared
     */
    checkSpareCondition() {
        if (this.enemy.spareCondition) {
            return this.enemy.spareCondition(this);
        }
        return false;
    }
    
    /**
     * Render submenu
     */
    renderSubmenu() {
        this.elements.battleSubmenu.classList.remove('hidden');
        this.elements.battleSubmenu.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = 'submenu-grid';
        
        this.submenuItems.forEach((item, i) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'submenu-item';
            if (i === this.submenuIndex) itemEl.classList.add('selected');
            if (item.highlight === 'yellow') itemEl.classList.add('spare-ready');
            if (item.highlight === 'pink') itemEl.classList.add('spare-pink');
            if (item.disabled) itemEl.style.color = '#666';
            itemEl.textContent = item.name;
            grid.appendChild(itemEl);
        });
        
        this.elements.battleSubmenu.appendChild(grid);
    }
    
    /**
     * Handle submenu input
     */
    handleSubmenuInput(key) {
        const cols = 2;
        const rows = Math.ceil(this.submenuItems.length / cols);
        
        if (key === 'left') {
            if (this.submenuIndex % cols !== 0) {
                this.submenuIndex--;
                this.game.audio.playSFX(SFX.SELECT);
            }
        } else if (key === 'right') {
            if (this.submenuIndex % cols !== cols - 1 && 
                this.submenuIndex < this.submenuItems.length - 1) {
                this.submenuIndex++;
                this.game.audio.playSFX(SFX.SELECT);
            }
        } else if (key === 'up') {
            if (this.submenuIndex >= cols) {
                this.submenuIndex -= cols;
                this.game.audio.playSFX(SFX.SELECT);
            }
        } else if (key === 'down') {
            if (this.submenuIndex + cols < this.submenuItems.length) {
                this.submenuIndex += cols;
                this.game.audio.playSFX(SFX.SELECT);
            }
        } else if (key === 'confirm') {
            this.selectSubmenuOption();
        } else if (key === 'cancel') {
            this.setPhase(BATTLE_PHASE.MENU);
        }
        
        this.renderSubmenu();
    }
    
    /**
     * Execute selected submenu option
     */
    async selectSubmenuOption() {
        const selected = this.submenuItems[this.submenuIndex];
        if (!selected || selected.disabled) return;
        
        this.game.audio.playSFX(SFX.CONFIRM);
        
        // Handle different effects
        switch (selected.effect) {
            case 'check':
                await this.showText(this.enemy.check);
                this.setPhase(BATTLE_PHASE.ENEMY_TURN);
                break;
                
            case 'spare':
                await this.attemptSpare();
                break;
                
            case 'flee':
                await this.attemptFlee();
                break;
                
            case 'use_item':
                await this.useItem(selected.item, selected.itemIndex);
                break;
                
            case 'none':
                this.setPhase(BATTLE_PHASE.MENU);
                break;
                
            default:
                // Custom ACT effects
                await this.executeAct(selected.effect);
                break;
        }
    }
    
    /**
     * Execute ACT option
     */
    async executeAct(effectName) {
        // Check for onAnyAct (for tutorial)
        if (this.enemy.onAnyAct) {
            const result = this.enemy.onAnyAct(this);
            if (result) {
                await this.showText(result.text);
                if (result.endBattle) {
                    await this.endBattle(false, false);
                    return;
                }
            }
        }
        
        // Look for specific handler
        const handlerName = `on${effectName.charAt(0).toUpperCase()}${effectName.slice(1)}`;
        
        if (this.enemy[handlerName]) {
            const result = this.enemy[handlerName](this);
            
            if (result) {
                if (result.text) {
                    await this.showText(result.text);
                }
                
                if (result.spareable) {
                    this.enemyFlags.spareable = true;
                }
                
                if (result.heal) {
                    this.game.player.hp = Math.min(
                        this.game.player.hp + result.heal,
                        this.game.player.maxHp
                    );
                    this.updateStats();
                }
                
                if (result.endBattle) {
                    await this.endBattle(false, false);
                    return;
                }
                
                if (result.specialEvent) {
                    await this.handleSpecialEvent(result.specialEvent);
                }
            }
        } else {
            // Default ACT text
            await this.showText('なにも　おこらなかった。');
        }
        
        this.setPhase(BATTLE_PHASE.ENEMY_TURN);
    }
    
    /**
     * Attempt to spare enemy
     */
    async attemptSpare() {
        // Check custom onSpare handler
        if (this.enemy.onSpare) {
            const result = this.enemy.onSpare(this);
            if (result && result.text) {
                await this.showText(result.text);
            }
            if (result && result.spareable) {
                await this.spareEnemy();
                return;
            }
        }
        
        // Check spare condition
        if (this.checkSpareCondition()) {
            await this.spareEnemy();
        } else {
            // Can't spare yet
            await this.showText(`${this.enemy.name}は　あなたを　見ている。`);
            this.setPhase(BATTLE_PHASE.ENEMY_TURN);
        }
    }
    
    /**
     * Successfully spare enemy
     */
    async spareEnemy() {
        this.game.audio.playSFX(SFX.SPARE);
        
        // Spare animation
        this.elements.enemySprite.classList.add('enemy-spare');
        
        // Award gold but no EXP
        this.game.player.gold += this.enemy.gold;
        
        await this.showText(`${this.enemy.name}を　みのがした。`);
        
        await this.endBattle(false, true);
    }
    
    /**
     * Attempt to flee
     */
    async attemptFlee() {
        if (!this.enemy.canFlee) {
            await this.showText('にげられない！');
            this.setPhase(BATTLE_PHASE.MENU);
            return;
        }
        
        this.game.audio.playSFX(SFX.FLEE);
        await this.showText('にげだした！');
        await this.endBattle(false, false);
    }
    
    /**
     * Use item in battle
     */
    async useItem(item, index) {
        // Remove from inventory
        this.game.player.inventory.splice(index, 1);
        
        // Apply effect
        if (item.heal) {
            const healed = Math.min(item.heal, this.game.player.maxHp - this.game.player.hp);
            this.game.player.hp += healed;
            this.game.audio.playSFX(SFX.HEAL);
            await this.showText(`${item.name}を　食べた！\nHPが　${healed}　回復した！`);
        }
        
        this.updateStats();
        this.setPhase(BATTLE_PHASE.ENEMY_TURN);
    }
    
    /**
     * Start enemy turn
     */
    async startEnemyTurn() {
        this.turns++;
        
        // Check for turn-based events
        if (this.enemy.onTurnEnd) {
            const result = this.enemy.onTurnEnd(this);
            if (result) {
                if (result.text) await this.showText(result.text);
                if (result.spareable || result.bossSpares) {
                    this.enemyFlags.spareable = true;
                    this.setPhase(BATTLE_PHASE.MENU);
                    return;
                }
            }
        }
        
        // Show enemy dialogue if any
        if (Math.random() < 0.3 && this.enemy.dialogues) {
            this.showEnemyDialogue(Utils.randomChoice(this.enemy.dialogues));
        }
        
        // Execute enemy attack
        await this.executeEnemyAttack();
    }
    
    /**
     * Execute enemy attack pattern
     */
    async executeEnemyAttack() {
        // Get attack pattern
        // (Simplified - actual implementation would use attack generators)
        
        this.elements.battleMenu.classList.add('hidden');
        this.elements.battleSubmenu.classList.add('hidden');
        
        // Prepare bullet board
        this.centerSoulInBox();
        
        // Set attack duration
        this.attackDuration = 180; // frames
        this.bulletTimer = 0;
        
        // Start attack loop
        await this.runAttackPhase();
        
        // End enemy turn
        this.setPhase(BATTLE_PHASE.MENU);
    }
    
    /**
     * Run the bullet-hell attack phase
     */
    runAttackPhase() {
        return new Promise((resolve) => {
            const attackLoop = () => {
                if (this.bulletTimer >= this.attackDuration) {
                    this.bullets = [];
                    resolve();
                    return;
                }
                
                this.bulletTimer++;
                
                // Update soul position
                this.updateSoul();
                
                // Update bullets
                this.updateBullets();
                
                // Check collisions
                this.checkBulletCollisions();
                
                // Render
                this.renderBattleBox();
                
                requestAnimationFrame(attackLoop);
            };
            
            attackLoop();
        });
    }
    
    /**
     * Update soul position based on input and mode
     */
    updateSoul() {
        const input = this.game.input;
        const speed = SOUL.SPEED;
        
        if (this.soul.mode === SOUL_MODE.RED) {
            // Free movement
            if (input.isPressed('up')) this.soul.y -= speed;
            if (input.isPressed('down')) this.soul.y += speed;
            if (input.isPressed('left')) this.soul.x -= speed;
            if (input.isPressed('right')) this.soul.x += speed;
        } else if (this.soul.mode === SOUL_MODE.BLUE) {
            // Platformer physics
            if (input.isPressed('left')) this.soul.x -= speed;
            if (input.isPressed('right')) this.soul.x += speed;
            
            // Gravity
            this.soul.velocityY += SOUL.GRAVITY;
            this.soul.velocityY = Math.min(this.soul.velocityY, SOUL.MAX_FALL);
            this.soul.y += this.soul.velocityY;
            
            // Ground check
            const groundY = this.box.height - SOUL.SIZE;
            if (this.soul.y >= groundY) {
                this.soul.y = groundY;
                this.soul.velocityY = 0;
                this.soul.grounded = true;
            } else {
                this.soul.grounded = false;
            }
            
            // Jump
            if (input.justPressed('up') && this.soul.grounded) {
                this.soul.velocityY = SOUL.JUMP_FORCE;
                this.soul.grounded = false;
            }
        }
        
        // Clamp to box bounds
        this.soul.x = Utils.clamp(this.soul.x, 0, this.box.width - SOUL.SIZE);
        this.soul.y = Utils.clamp(this.soul.y, 0, this.box.height - SOUL.SIZE);
        
        // Update invincibility
        if (this.soul.invincible) {
            this.soul.invincibilityTimer--;
            if (this.soul.invincibilityTimer <= 0) {
                this.soul.invincible = false;
            }
        }
    }
    
    /**
     * Update bullet positions
     */
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // Update position based on behavior
            switch (bullet.behavior) {
                case 'horizontal':
                    bullet.x += bullet.speed;
                    break;
                case 'fall_straight':
                    bullet.y += bullet.speed;
                    break;
                case 'homing':
                    const angle = Utils.angle(bullet.x, bullet.y, this.soul.x, this.soul.y);
                    bullet.x += Math.cos(angle) * bullet.speed;
                    bullet.y += Math.sin(angle) * bullet.speed;
                    break;
                // Add more behaviors as needed
            }
            
            // Remove if out of bounds
            if (bullet.x < -50 || bullet.x > this.box.width + 50 ||
                bullet.y < -50 || bullet.y > this.box.height + 50) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    /**
     * Check bullet collisions with soul
     */
    checkBulletCollisions() {
        if (this.soul.invincible) return;
        
        const soulRect = {
            x: this.soul.x,
            y: this.soul.y,
            width: SOUL.SIZE,
            height: SOUL.SIZE
        };
        
        for (const bullet of this.bullets) {
            const bulletRect = {
                x: bullet.x,
                y: bullet.y,
                width: bullet.width || 10,
                height: bullet.height || 10
            };
            
            if (Utils.rectCollision(soulRect, bulletRect)) {
                // Blue bullets only damage if moving
                if (bullet.blueAttack && !this.game.input.anyMovementPressed()) {
                    continue;
                }
                
                // Green bullets heal
                if (bullet.type === 'green') {
                    this.game.player.hp = Math.min(
                        this.game.player.hp + (bullet.heal || 1),
                        this.game.player.maxHp
                    );
                    this.game.audio.playSFX(SFX.HEAL);
                    this.updateStats();
                    continue;
                }
                
                // Apply damage
                this.takeDamage(bullet.damage);
            }
        }
    }
    
    /**
     * Player takes damage
     */
    takeDamage(baseDamage) {
        const player = this.game.player;
        const damage = Utils.calculateEnemyDamage(
            baseDamage,
            LV_STATS[player.lv].df + (player.armor ? player.armor.df : 0),
            player.hp
        );
        
        player.hp -= damage;
        this.game.audio.playSFX(SFX.HURT);
        
        // Invincibility frames
        this.soul.invincible = true;
        this.soul.invincibilityTimer = BATTLE.INVINCIBILITY_FRAMES;
        this.elements.playerSoul.classList.add('invincible');
        
        setTimeout(() => {
            this.elements.playerSoul.classList.remove('invincible');
        }, BATTLE.INVINCIBILITY_FRAMES * (1000 / GAME.FPS));
        
        this.updateStats();
        
        // Check for death
        if (player.hp <= 0) {
            player.hp = 0;
            this.playerDefeated();
        }
    }
    
    /**
     * Center soul in battle box
     */
    centerSoulInBox() {
        this.soul.x = this.box.width / 2 - SOUL.SIZE / 2;
        this.soul.y = this.box.height / 2 - SOUL.SIZE / 2;
    }
    
    /**
     * Render battle box contents
     */
    renderBattleBox() {
        // Update soul position
        this.elements.playerSoul.style.left = `${this.soul.x}px`;
        this.elements.playerSoul.style.top = `${this.soul.y}px`;
        
        // Update soul color class
        this.elements.playerSoul.className = '';
        if (this.soul.mode !== SOUL_MODE.RED) {
            this.elements.playerSoul.classList.add(this.soul.mode);
        }
        if (this.soul.invincible) {
            this.elements.playerSoul.classList.add('invincible');
        }
    }
    
    /**
     * Update HP and stats display
     */
    updateStats() {
        const player = this.game.player;
        
        this.elements.hpVal.textContent = player.hp;
        this.elements.hpMax.textContent = player.maxHp;
        this.elements.lvVal.textContent = player.lv;
        
        // HP bar
        const hpPercent = (player.hp / player.maxHp) * 100;
        this.elements.hpBar.style.width = `${hpPercent}%`;
        
        // HP bar color
        this.elements.hpBar.classList.remove('mid', 'low');
        if (hpPercent <= 25) {
            this.elements.hpBar.classList.add('low');
        } else if (hpPercent <= 50) {
            this.elements.hpBar.classList.add('mid');
        }
    }
    
    /**
     * Show text in battle text area
     */
    showText(text) {
        return new Promise((resolve) => {
            this.elements.battleText.textContent = '';
            let i = 0;
            
            const typeChar = () => {
                if (i < text.length) {
                    this.elements.battleText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeChar, 30);
                } else {
                    setTimeout(resolve, 500);
                }
            };
            
            typeChar();
        });
    }
    
    /**
     * Show enemy dialogue bubble
     */
    showEnemyDialogue(text) {
        this.elements.enemyDialogue.textContent = text;
        this.elements.enemyDialogue.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.enemyDialogue.classList.add('hidden');
        }, 2000);
    }
    
    /**
     * Render enemy sprite
     */
    renderEnemySprite() {
        const spritePath = `assets/sprites/enemies/${this.enemy.sprite}.png`;
        this.elements.enemySprite.innerHTML = `<img src="${spritePath}" alt="${this.enemy.name}">`;
    }
    
    /**
     * Enemy defeated (killed)
     */
    async enemyDefeated() {
        // Death animation
        this.elements.enemySprite.classList.add('enemy-death');
        this.game.audio.playSFX(SFX.DAMAGE);
        
        await Utils.wait(1000);
        
        // Check for special death dialogue
        if (this.enemy.onKill) {
            const result = this.enemy.onKill();
            if (result && result.dialogue) {
                for (const line of result.dialogue) {
                    await this.showText(line);
                    await Utils.wait(500);
                }
            }
        }
        
        // Award EXP and gold
        const expGained = this.enemy.exp;
        const goldGained = this.enemy.gold;
        
        this.game.player.exp += expGained;
        this.game.player.gold += goldGained;
        
        await this.showText(`${this.enemy.name}を　たおした！\n${expGained} EXP と ${goldGained} G を　もらった。`);
        
        // Check level up
        const levelUp = Utils.checkLevelUp(this.game.player.exp, this.game.player.lv);
        if (levelUp) {
            this.game.player.lv = levelUp.newLv;
            this.game.player.maxHp = levelUp.stats.hp;
            this.game.player.hp = this.game.player.maxHp;
            this.game.audio.playSFX(SFX.SAVE);
            await this.showText(`LOVE が　あがった！\nLV ${levelUp.newLv} に　なった！`);
        }
        
        // Set killed flag
        this.game.flags.set(`killed_${this.enemy.id}`, true);
        
        await this.endBattle(true, false);
    }
    
    /**
     * Player defeated
     */
    async playerDefeated() {
        this.active = false;
        this.game.audio.stopMusic();
        this.game.audio.playSFX(SFX.SOUL_BREAK);
        
        // Show game over screen
        this.game.showScreen('gameover');
    }
    
    /**
     * End battle
     */
    async endBattle(killed, spared) {
        this.active = false;
        this.bullets = [];
        
        // Return to overworld
        this.game.showScreen('game');
        
        // Resume overworld music
        this.game.resumeOverworldMusic();
    }
    
    /**
     * Handle special events during battle
     */
    async handleSpecialEvent(eventName) {
        switch (eventName) {
            case 'dapper_blook':
                // Napstablook's "dapperblook" hat
                await this.showText('ナプスタブルークは　なみだを\nぼうしの　形にした。\n「・・・ぼく・・・　"ダッパーブルーク"・・・」');
                break;
            // Add more special events
        }
    }
    
    /**
     * Handle battle input
     */
    handleInput(key) {
        if (!this.active) return;
        
        if (this.phase === BATTLE_PHASE.FIGHT && this.attackMeter.active) {
            if (key === 'confirm') {
                this.executeAttack();
            }
        } else if (this.phase === BATTLE_PHASE.MENU ||
                   this.phase === BATTLE_PHASE.ACT ||
                   this.phase === BATTLE_PHASE.ITEM ||
                   this.phase === BATTLE_PHASE.MERCY) {
            this.handleMenuInput(key);
        }
    }
    
    /**
     * Update battle state (called each frame)
     */
    update() {
        if (!this.active) return;
        
        // Update based on current phase
        // Most updates are handled by individual phase methods
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleSystem;
}
