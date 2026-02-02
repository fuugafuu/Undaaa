/**
 * UNDERTALE Web Recreation - Helper Utilities
 * General utility functions used throughout the game
 */

const Utils = {
    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Random float between min and max
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Random element from array
     */
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Shuffle array (Fisher-Yates)
     */
    shuffle(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * Distance between two points
     */
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    /**
     * Angle between two points (in radians)
     */
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
     * Convert degrees to radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Convert radians to degrees
     */
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Check if two rectangles overlap (AABB collision)
     */
    rectCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    },

    /**
     * Check if a point is inside a rectangle
     */
    pointInRect(px, py, rect) {
        return (
            px >= rect.x &&
            px <= rect.x + rect.width &&
            py >= rect.y &&
            py <= rect.y + rect.height
        );
    },

    /**
     * Check circle-rectangle collision
     */
    circleRectCollision(cx, cy, radius, rect) {
        const closestX = Utils.clamp(cx, rect.x, rect.x + rect.width);
        const closestY = Utils.clamp(cy, rect.y, rect.y + rect.height);
        const distX = cx - closestX;
        const distY = cy - closestY;
        return (distX * distX + distY * distY) < (radius * radius);
    },

    /**
     * Wait for specified milliseconds (Promise-based)
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Create a tween animation
     */
    tween(obj, props, duration, easing = 'linear') {
        return new Promise(resolve => {
            const start = {};
            const change = {};
            
            for (const key in props) {
                start[key] = obj[key];
                change[key] = props[key] - obj[key];
            }
            
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = Utils.ease(progress, easing);
                
                for (const key in props) {
                    obj[key] = start[key] + change[key] * easedProgress;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(update);
        });
    },

    /**
     * Easing functions
     */
    ease(t, type) {
        switch (type) {
            case 'easeIn':
                return t * t;
            case 'easeOut':
                return t * (2 - t);
            case 'easeInOut':
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            case 'easeInCubic':
                return t * t * t;
            case 'easeOutCubic':
                return 1 - Math.pow(1 - t, 3);
            case 'easeInOutCubic':
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            case 'bounce':
                if (t < 1 / 2.75) {
                    return 7.5625 * t * t;
                } else if (t < 2 / 2.75) {
                    t -= 1.5 / 2.75;
                    return 7.5625 * t * t + 0.75;
                } else if (t < 2.5 / 2.75) {
                    t -= 2.25 / 2.75;
                    return 7.5625 * t * t + 0.9375;
                } else {
                    t -= 2.625 / 2.75;
                    return 7.5625 * t * t + 0.984375;
                }
            default: // linear
                return t;
        }
    },

    /**
     * Deep clone an object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Merge objects deeply
     */
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                result[key] = Utils.deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },

    /**
     * Format number with leading zeros
     */
    padNumber(num, digits) {
        return String(num).padStart(digits, '0');
    },

    /**
     * Format time (seconds) to MM:SS
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${Utils.padNumber(mins, 2)}:${Utils.padNumber(secs, 2)}`;
    },

    /**
     * Calculate player damage to enemy
     * Formula: ((ATK + WeaponATK - EnemyDEF) * hitMultiplier) + random(-2, 2)
     */
    calculatePlayerDamage(playerAtk, weaponAtk, enemyDef, hitMultiplier = 1) {
        const baseDamage = (playerAtk + weaponAtk - enemyDef) * hitMultiplier;
        const randomMod = Utils.randomInt(-DAMAGE.RANDOM_RANGE, DAMAGE.RANDOM_RANGE);
        return Math.max(DAMAGE.MIN_DAMAGE, Math.floor(baseDamage + randomMod));
    },

    /**
     * Calculate enemy damage to player
     * Formula: EnemyATK - (PlayerDEF / 5) + HPBonus
     */
    calculateEnemyDamage(enemyAtk, playerDef, playerHp) {
        // HP bonus: enemies deal more damage at higher HP thresholds
        let hpBonus = 0;
        const thresholds = [21, 30, 40, 50, 60, 70, 80, 90];
        for (const threshold of thresholds) {
            if (playerHp >= threshold) hpBonus++;
        }
        
        const baseDamage = enemyAtk - Math.floor(playerDef / 5) + hpBonus;
        return Math.max(DAMAGE.MIN_DAMAGE, baseDamage);
    },

    /**
     * Check if player should level up
     */
    checkLevelUp(currentExp, currentLv) {
        if (currentLv >= 20) return null;
        
        const nextThreshold = LV_THRESHOLDS[currentLv];
        if (currentExp >= nextThreshold) {
            return {
                newLv: currentLv + 1,
                stats: LV_STATS[currentLv + 1]
            };
        }
        return null;
    },

    /**
     * Get text with typing effect speed based on character
     */
    getTextSpeed(character) {
        const speeds = {
            'toriel': 50,
            'sans': 40,
            'papyrus': 35,
            'flowey': 30,
            'napstablook': 70,
            'default': 50
        };
        return speeds[character] || speeds.default;
    },

    /**
     * Parse dialogue text for special formatting
     * Supports: [shake], [wave], [color:red], etc.
     */
    parseDialogueText(text) {
        const parts = [];
        let currentText = '';
        let currentEffects = [];
        
        const regex = /\[(\/?[\w:]+)\]/g;
        let lastIndex = 0;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            // Add text before tag
            if (match.index > lastIndex) {
                parts.push({
                    text: text.slice(lastIndex, match.index),
                    effects: [...currentEffects]
                });
            }
            
            const tag = match[1];
            if (tag.startsWith('/')) {
                // Closing tag
                const effectName = tag.slice(1);
                currentEffects = currentEffects.filter(e => !e.startsWith(effectName));
            } else {
                // Opening tag
                currentEffects.push(tag);
            }
            
            lastIndex = regex.lastIndex;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({
                text: text.slice(lastIndex),
                effects: [...currentEffects]
            });
        }
        
        return parts;
    },

    /**
     * Convert Japanese text to display width (accounting for full-width chars)
     */
    getDisplayWidth(text) {
        let width = 0;
        for (const char of text) {
            // Full-width characters (Japanese, etc.) count as 2
            if (char.match(/[\u3000-\u9fff\uff00-\uffef]/)) {
                width += 2;
            } else {
                width += 1;
            }
        }
        return width;
    },

    /**
     * Load an image and return a promise
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Preload multiple images
     */
    preloadImages(sources) {
        return Promise.all(sources.map(Utils.loadImage));
    },

    /**
     * Create a canvas with specified dimensions
     */
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },

    /**
     * Simple event emitter
     */
    createEventEmitter() {
        const events = {};
        
        return {
            on(event, callback) {
                if (!events[event]) events[event] = [];
                events[event].push(callback);
            },
            off(event, callback) {
                if (!events[event]) return;
                events[event] = events[event].filter(cb => cb !== callback);
            },
            emit(event, ...args) {
                if (!events[event]) return;
                events[event].forEach(callback => callback(...args));
            }
        };
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
