/**
 * UNDERTALE Web Recreation - Input Manager
 * Handles keyboard input with support for key holding and just-pressed detection
 */

class InputManager {
    constructor(game) {
        this.game = game;
        
        // Current key states
        this.keys = {};
        
        // Previous frame key states (for just-pressed detection)
        this.prevKeys = {};
        
        // Key mappings
        this.bindings = {
            up: ['ArrowUp', 'KeyW'],
            down: ['ArrowDown', 'KeyS'],
            left: ['ArrowLeft', 'KeyA'],
            right: ['ArrowRight', 'KeyD'],
            confirm: ['KeyZ', 'Enter', 'Space'],
            cancel: ['KeyX', 'Backspace', 'Escape'],
            menu: ['KeyC', 'ControlLeft']
        };
        
        // Set up event listeners
        this.setupListeners();
    }
    
    /**
     * Set up keyboard event listeners
     */
    setupListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Prevent default for game keys
        document.addEventListener('keydown', (e) => {
            const gameKeys = [
                'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'KeyZ', 'KeyX', 'KeyC', 'Enter', 'Space', 'Escape'
            ];
            if (gameKeys.includes(e.code)) {
                e.preventDefault();
            }
        });
        
        // Handle window blur (release all keys)
        window.addEventListener('blur', () => this.releaseAll());
    }
    
    /**
     * Handle key down event
     */
    onKeyDown(e) {
        this.keys[e.code] = true;
    }
    
    /**
     * Handle key up event
     */
    onKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    /**
     * Release all keys
     */
    releaseAll() {
        this.keys = {};
    }
    
    /**
     * Update input state (called each frame)
     */
    update() {
        this.prevKeys = { ...this.keys };
    }
    
    /**
     * Check if an action key is currently pressed
     */
    isPressed(action) {
        const keyCodes = this.bindings[action];
        if (!keyCodes) return false;
        
        return keyCodes.some(code => this.keys[code]);
    }
    
    /**
     * Check if an action key was just pressed this frame
     */
    justPressed(action) {
        const keyCodes = this.bindings[action];
        if (!keyCodes) return false;
        
        return keyCodes.some(code => this.keys[code] && !this.prevKeys[code]);
    }
    
    /**
     * Check if an action key was just released this frame
     */
    justReleased(action) {
        const keyCodes = this.bindings[action];
        if (!keyCodes) return false;
        
        return keyCodes.some(code => !this.keys[code] && this.prevKeys[code]);
    }
    
    /**
     * Check if any movement key is pressed
     */
    anyMovementPressed() {
        return this.isPressed('up') || 
               this.isPressed('down') || 
               this.isPressed('left') || 
               this.isPressed('right');
    }
    
    /**
     * Get movement direction as vector
     */
    getMovementVector() {
        let x = 0, y = 0;
        
        if (this.isPressed('left')) x -= 1;
        if (this.isPressed('right')) x += 1;
        if (this.isPressed('up')) y -= 1;
        if (this.isPressed('down')) y += 1;
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const len = Math.sqrt(x * x + y * y);
            x /= len;
            y /= len;
        }
        
        return { x, y };
    }
    
    /**
     * Convert action to readable key name
     */
    getKeyName(action) {
        const keyCodes = this.bindings[action];
        if (!keyCodes || keyCodes.length === 0) return '?';
        
        const code = keyCodes[0];
        const names = {
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'KeyZ': 'Z',
            'KeyX': 'X',
            'KeyC': 'C',
            'Enter': 'Enter',
            'Space': 'Space',
            'Escape': 'Esc'
        };
        
        return names[code] || code.replace('Key', '');
    }
    
    /**
     * Rebind a key
     */
    rebind(action, newKeyCodes) {
        if (Array.isArray(newKeyCodes)) {
            this.bindings[action] = newKeyCodes;
        } else {
            this.bindings[action] = [newKeyCodes];
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
