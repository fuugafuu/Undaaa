// ==========================================
// UNDERTALE Web - Complete Working Version
// ==========================================

// Game Configuration
const CONFIG = {
    TILE_SIZE: 40,
    PLAYER_SPEED: 4,
    CANVAS_WIDTH: 640,
    CANVAS_HEIGHT: 480
};

// Color Schemes
const COLORS = {
    ruins: {
        bg: '#1a0f1a',
        wall: '#2d1a33',
        floor1: '#3a2244',
        floor2: '#4a2e54',
        accent: '#8b5a9f'
    }
};

// Map Data
const ROOMS = {
    start: {
        name: 'おちた ばしょ',
        width: 16,
        height: 12,
        playerStart: {x: 8, y: 10},
        exits: {
            top: 'hallway1'
        },
        walls: [
            // Border walls
            ...Array.from({length: 16}, (_, i) => ({x: i, y: 0})),
            ...Array.from({length: 16}, (_, i) => ({x: i, y: 11})),
            ...Array.from({length: 12}, (_, i) => ({x: 0, y: i})),
            ...Array.from({length: 12}, (_, i) => ({x: 15, y: i})),
        ].filter((w, i, arr) => {
            // Remove exit at top
            if (w.y === 0 && w.x >= 7 && w.x <= 8) return false;
            return true;
        }),
        objects: [
            {x: 6, y: 9, w: 4, h: 2, color: '#ff0', type: 'flowers'}
        ]
    },
    
    hallway1: {
        name: 'ろうか',
        width: 16,
        height: 16,
        playerStart: {x: 8, y: 14},
        exits: {
            bottom: 'start',
            top: 'save_room'
        },
        walls: [
            ...Array.from({length: 16}, (_, i) => ({x: i, y: 0})),
            ...Array.from({length: 16}, (_, i) => ({x: i, y: 15})),
            ...Array.from({length: 16}, (_, i) => ({x: 0, y: i})),
            ...Array.from({length: 16}, (_, i) => ({x: 15, y: i})),
        ].filter(w => {
            if (w.y === 0 && w.x >= 7 && w.x <= 8) return false;
            if (w.y === 15 && w.x >= 7 && w.x <= 8) return false;
            return true;
        })
    },
    
    save_room: {
        name: 'セーブポイント',
        width: 20,
        height: 12,
        playerStart: {x: 10, y: 10},
        exits: {
            bottom: 'hallway1',
            right: 'long_hall'
        },
        walls: [
            ...Array.from({length: 20}, (_, i) => ({x: i, y: 0})),
            ...Array.from({length: 20}, (_, i) => ({x: i, y: 11})),
            ...Array.from({length: 12}, (_, i) => ({x: 0, y: i})),
            ...Array.from({length: 12}, (_, i) => ({x: 19, y: i})),
        ].filter(w => {
            if (w.y === 11 && w.x >= 9 && w.x <= 10) return false;
            if (w.x === 19 && w.y >= 5 && w.y <= 6) return false;
            return true;
        }),
        savePoint: {x: 10, y: 6}
    },
    
    long_hall: {
        name: 'ながい ろうか',
        width: 30,
        height: 12,
        playerStart: {x: 2, y: 6},
        exits: {
            left: 'save_room',
            right: 'puzzle_room'
        },
        walls: [
            ...Array.from({length: 30}, (_, i) => ({x: i, y: 0})),
            ...Array.from({length: 30}, (_, i) => ({x: i, y: 11})),
            ...Array.from({length: 12}, (_, i) => ({x: 0, y: i})),
            ...Array.from({length: 12}, (_, i) => ({x: 29, y: i})),
        ].filter(w => {
            if (w.x === 0 && w.y >= 5 && w.y <= 6) return false;
            if (w.x === 29 && w.y >= 5 && w.y <= 6) return false;
            return true;
        }),
        objects: [
            {x: 5, y: 3, w: 1, h: 6, color: COLORS.ruins.accent},
            {x: 10, y: 3, w: 1, h: 6, color: COLORS.ruins.accent},
            {x: 15, y: 3, w: 1, h: 6, color: COLORS.ruins.accent},
            {x: 20, y: 3, w: 1, h: 6, color: COLORS.ruins.accent},
            {x: 25, y: 3, w: 1, h: 6, color: COLORS.ruins.accent},
        ]
    },
    
    puzzle_room: {
        name: 'パズルの へや',
        width: 16,
        height: 16,
        playerStart: {x: 2, y: 8},
        exits: {
            left: 'long_hall',
            bottom: 'house'
        },
        walls: [
            ...Array.from({length: 16}, (_, i) => ({x: i, y: 0})),
            ...Array.from({length: 16}, (_, i) => ({x: i, y: 15})),
            ...Array.from({length: 16}, (_, i) => ({x: 0, y: i})),
            ...Array.from({length: 16}, (_, i) => ({x: 15, y: i})),
        ].filter(w => {
            if (w.x === 0 && w.y >= 7 && w.y <= 8) return false;
            if (w.y === 15 && w.x >= 7 && w.x <= 8) return false;
            return true;
        })
    },
    
    house: {
        name: 'トリエルの いえ',
        width: 12,
        height: 12,
        playerStart: {x: 6, y: 2},
        exits: {
            top: 'puzzle_room'
        },
        walls: [
            ...Array.from({length: 12}, (_, i) => ({x: i, y: 0})),
            ...Array.from({length: 12}, (_, i) => ({x: i, y: 11})),
            ...Array.from({length: 12}, (_, i) => ({x: 0, y: i})),
            ...Array.from({length: 12}, (_, i) => ({x: 11, y: i})),
        ].filter(w => {
            if (w.y === 0 && w.x >= 5 && w.x <= 6) return false;
            return true;
        }),
        savePoint: {x: 6, y: 6},
        objects: [
            {x: 2, y: 4, w: 2, h: 2, color: '#8b4513'},
            {x: 8, y: 4, w: 2, h: 2, color: '#8b4513'}
        ]
    }
};

// Game State
let game = {
    canvas: null,
    ctx: null,
    currentRoom: 'start',
    player: {
        x: 8,
        y: 10,
        direction: 'down',
        hp: 20,
        maxHp: 20,
        name: 'CHARA'
    },
    keys: {},
    camera: {x: 0, y: 0},
    running: false
};

// Initialize game
function init() {
    game.canvas = document.getElementById('canvas');
    game.ctx = game.canvas.getContext('2d');
    game.ctx.imageSmoothingEnabled = false;
    
    // Key listeners
    window.addEventListener('keydown', (e) => {
        game.keys[e.key] = true;
        game.keys[e.code] = true;
        
        // Prevent arrow key scrolling
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        game.keys[e.key] = false;
        game.keys[e.code] = false;
    });
    
    console.log('Game initialized!');
    console.log('Controls: Arrow keys or WASD to move');
}

// Start game
function startGame() {
    document.getElementById('title-screen').classList.remove('active');
    document.getElementById('name-screen').classList.add('active');
    document.getElementById('name-input').focus();
}

// Confirm name
function confirmName() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim().toUpperCase();
    
    if (name.length > 0) {
        game.player.name = name;
        document.getElementById('name-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        // Load starting room
        loadRoom('start');
        
        // Start game loop
        game.running = true;
        gameLoop();
    } else {
        alert('なまえを　いれてください！');
    }
}

// Load room
function loadRoom(roomId) {
    const room = ROOMS[roomId];
    if (!room) {
        console.error('Room not found:', roomId);
        return;
    }
    
    game.currentRoom = roomId;
    
    // Set player position
    if (room.playerStart) {
        game.player.x = room.playerStart.x;
        game.player.y = room.playerStart.y;
    }
    
    updateCamera();
    updateInfo();
    
    console.log('Loaded room:', room.name);
}

// Update camera
function updateCamera() {
    const room = ROOMS[game.currentRoom];
    if (!room) return;
    
    const roomPixelWidth = room.width * CONFIG.TILE_SIZE;
    const roomPixelHeight = room.height * CONFIG.TILE_SIZE;
    
    // Center on player
    game.camera.x = (game.player.x * CONFIG.TILE_SIZE) - CONFIG.CANVAS_WIDTH / 2;
    game.camera.y = (game.player.y * CONFIG.TILE_SIZE) - CONFIG.CANVAS_HEIGHT / 2;
    
    // Clamp camera
    game.camera.x = Math.max(0, Math.min(game.camera.x, roomPixelWidth - CONFIG.CANVAS_WIDTH));
    game.camera.y = Math.max(0, Math.min(game.camera.y, roomPixelHeight - CONFIG.CANVAS_HEIGHT));
}

// Update info display
function updateInfo() {
    const room = ROOMS[game.currentRoom];
    document.getElementById('player-info').textContent = 
        `${game.player.name} HP ${game.player.hp}/${game.player.maxHp}`;
    document.getElementById('room-info').textContent = room ? room.name : '';
}

// Check collision
function canMoveTo(x, y) {
    const room = ROOMS[game.currentRoom];
    if (!room) return false;
    
    // Check bounds
    if (x < 0 || x >= room.width || y < 0 || y >= room.height) {
        return false;
    }
    
    // Check walls
    if (room.walls) {
        for (let wall of room.walls) {
            if (wall.x === Math.floor(x) && wall.y === Math.floor(y)) {
                return false;
            }
        }
    }
    
    // Check objects
    if (room.objects) {
        for (let obj of room.objects) {
            if (x >= obj.x && x < obj.x + obj.w && 
                y >= obj.y && y < obj.y + obj.h) {
                return false;
            }
        }
    }
    
    return true;
}

// Check room transitions
function checkRoomTransition() {
    const room = ROOMS[game.currentRoom];
    if (!room || !room.exits) return;
    
    const px = Math.floor(game.player.x);
    const py = Math.floor(game.player.y);
    
    // Check each exit
    if (room.exits.top && py <= 0) {
        const nextRoom = ROOMS[room.exits.top];
        if (nextRoom) {
            game.player.y = nextRoom.height - 2;
            loadRoom(room.exits.top);
        }
    }
    if (room.exits.bottom && py >= room.height - 1) {
        const nextRoom = ROOMS[room.exits.bottom];
        if (nextRoom) {
            game.player.y = 1;
            loadRoom(room.exits.bottom);
        }
    }
    if (room.exits.left && px <= 0) {
        const nextRoom = ROOMS[room.exits.left];
        if (nextRoom) {
            game.player.x = nextRoom.width - 2;
            loadRoom(room.exits.left);
        }
    }
    if (room.exits.right && px >= room.width - 1) {
        const nextRoom = ROOMS[room.exits.right];
        if (nextRoom) {
            game.player.x = 1;
            loadRoom(room.exits.right);
        }
    }
}

// Update game state
function update() {
    if (!game.running) return;
    
    // Movement
    let dx = 0;
    let dy = 0;
    let moved = false;
    
    if (game.keys['ArrowUp'] || game.keys['KeyW'] || game.keys['w']) {
        dy = -1;
        game.player.direction = 'up';
        moved = true;
    }
    if (game.keys['ArrowDown'] || game.keys['KeyS'] || game.keys['s']) {
        dy = 1;
        game.player.direction = 'down';
        moved = true;
    }
    if (game.keys['ArrowLeft'] || game.keys['KeyA'] || game.keys['a']) {
        dx = -1;
        game.player.direction = 'left';
        moved = true;
    }
    if (game.keys['ArrowRight'] || game.keys['KeyD'] || game.keys['d']) {
        dx = 1;
        game.player.direction = 'right';
        moved = true;
    }
    
    if (moved) {
        const speed = CONFIG.PLAYER_SPEED / CONFIG.TILE_SIZE;
        const newX = game.player.x + dx * speed;
        const newY = game.player.y + dy * speed;
        
        if (canMoveTo(newX, game.player.y)) {
            game.player.x = newX;
        }
        if (canMoveTo(game.player.x, newY)) {
            game.player.y = newY;
        }
        
        updateCamera();
        checkRoomTransition();
    }
}

// Render game
function render() {
    const ctx = game.ctx;
    const room = ROOMS[game.currentRoom];
    if (!room) return;
    
    // Clear
    ctx.fillStyle = COLORS.ruins.bg;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    const ts = CONFIG.TILE_SIZE;
    
    // Render floor
    for (let y = 0; y < room.height; y++) {
        for (let x = 0; x < room.width; x++) {
            const screenX = x * ts - game.camera.x;
            const screenY = y * ts - game.camera.y;
            
            if (screenX < -ts || screenX > CONFIG.CANVAS_WIDTH ||
                screenY < -ts || screenY > CONFIG.CANVAS_HEIGHT) continue;
            
            ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.ruins.floor1 : COLORS.ruins.floor2;
            ctx.fillRect(screenX, screenY, ts, ts);
        }
    }
    
    // Render walls
    ctx.fillStyle = COLORS.ruins.wall;
    if (room.walls) {
        room.walls.forEach(wall => {
            const x = wall.x * ts - game.camera.x;
            const y = wall.y * ts - game.camera.y;
            ctx.fillRect(x, y, ts, ts);
            ctx.strokeStyle = COLORS.ruins.accent;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, ts, ts);
        });
    }
    
    // Render objects
    if (room.objects) {
        room.objects.forEach(obj => {
            const x = obj.x * ts - game.camera.x;
            const y = obj.y * ts - game.camera.y;
            const w = obj.w * ts;
            const h = obj.h * ts;
            ctx.fillStyle = obj.color || '#888';
            ctx.fillRect(x, y, w, h);
        });
    }
    
    // Render save point
    if (room.savePoint) {
        const sx = room.savePoint.x * ts - game.camera.x;
        const sy = room.savePoint.y * ts - game.camera.y;
        
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? 15 : 7;
            const px = sx + ts/2 + Math.cos(angle) * radius;
            const py = sy + ts/2 + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    // Render player
    const px = game.player.x * ts - game.camera.x;
    const py = game.player.y * ts - game.camera.y;
    
    // Body
    ctx.fillStyle = '#aa6644';
    ctx.fillRect(px - 6, py - 12, 12, 16);
    
    // Head
    ctx.fillStyle = '#ffcc99';
    ctx.beginPath();
    ctx.arc(px, py - 16, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(px - 3, py - 18, 2, 2);
    ctx.fillRect(px + 1, py - 18, 2, 2);
    
    // Legs
    ctx.fillStyle = '#6644aa';
    ctx.fillRect(px - 5, py + 4, 4, 8);
    ctx.fillRect(px + 1, py + 4, 4, 8);
}

// Game loop
function gameLoop() {
    update();
    render();
    if (game.running) {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize on load
window.addEventListener('load', init);
