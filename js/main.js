/**
 * UNDERTALE Web Recreation - Main Entry Point
 * Initializes the game when the page loads
 */

// Game instance
let game = null;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('UNDERTALE Web Recreation');
    console.log('Version 1.0 - Ruins to Snowdin');
    console.log('========================');
    
    // Create game instance
    game = new Game();
});

// Prevent context menu on game canvas
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('#game-container')) {
        e.preventDefault();
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (game && game.audio) {
        if (document.hidden) {
            game.audio.pauseMusic();
        } else {
            game.audio.resumeMusic();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game && game.renderer) {
        game.renderer.handleResize();
    }
});

// Debug commands (development only)
if (typeof window !== 'undefined') {
    window.DEBUG = {
        // Skip to specific room
        goto: (roomId) => {
            if (game && game.mapEngine) {
                game.loadRoom(roomId);
                console.log(`Teleported to ${roomId}`);
            }
        },
        
        // Set player stats
        setHP: (hp) => {
            if (game && game.player) {
                game.player.hp = hp;
                game.player.maxHp = Math.max(game.player.maxHp, hp);
                console.log(`HP set to ${hp}`);
            }
        },
        
        // Set level
        setLV: (lv) => {
            if (game && game.player && LV_STATS[lv]) {
                game.player.lv = lv;
                game.player.maxHp = LV_STATS[lv].hp;
                game.player.hp = game.player.maxHp;
                console.log(`LV set to ${lv}`);
            }
        },
        
        // Add gold
        addGold: (amount) => {
            if (game && game.player) {
                game.player.gold += amount;
                console.log(`Gold: ${game.player.gold}`);
            }
        },
        
        // Add item
        addItem: (itemId) => {
            if (game && ITEMS[itemId]) {
                game.addItem({ ...ITEMS[itemId] });
                console.log(`Added ${ITEMS[itemId].name}`);
            }
        },
        
        // Set flag
        setFlag: (key, value = true) => {
            if (game && game.flags) {
                game.flags.set(key, value);
                console.log(`Flag ${key} = ${value}`);
            }
        },
        
        // Get flag
        getFlag: (key) => {
            if (game && game.flags) {
                console.log(`Flag ${key} = ${game.flags.get(key)}`);
            }
        },
        
        // Start battle
        battle: (enemyId) => {
            if (game && game.battle && ENEMIES[enemyId]) {
                game.battle.startBattle(enemyId);
                console.log(`Starting battle with ${enemyId}`);
            }
        },
        
        // Heal to full
        heal: () => {
            if (game && game.player) {
                game.player.hp = game.player.maxHp;
                console.log('Healed to full HP');
            }
        },
        
        // Toggle invincibility
        godMode: false,
        toggleGodMode: () => {
            window.DEBUG.godMode = !window.DEBUG.godMode;
            console.log(`God mode: ${window.DEBUG.godMode ? 'ON' : 'OFF'}`);
        },
        
        // List all rooms
        listRooms: () => {
            console.log('Available rooms:');
            Object.keys(MAPS).forEach(room => console.log(`  - ${room}`));
        },
        
        // List all enemies
        listEnemies: () => {
            console.log('Available enemies:');
            Object.keys(ENEMIES).forEach(enemy => console.log(`  - ${enemy}`));
        },
        
        // Show current state
        state: () => {
            if (game) {
                console.log('=== Game State ===');
                console.log('Player:', game.player);
                console.log('Room:', game.currentRoom);
                console.log('Area:', game.currentArea);
                console.log('State:', game.state);
                console.log('Flags:', game.flags.data);
            }
        }
    };
    
    console.log('Debug commands available via window.DEBUG');
    console.log('  DEBUG.goto(roomId) - Teleport to room');
    console.log('  DEBUG.battle(enemyId) - Start battle');
    console.log('  DEBUG.heal() - Heal to full');
    console.log('  DEBUG.state() - Show current state');
    console.log('  DEBUG.listRooms() - List all rooms');
    console.log('  DEBUG.listEnemies() - List all enemies');
}
