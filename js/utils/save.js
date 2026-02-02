/**
 * UNDERTALE Web Recreation - Save Manager
 * Handles save/load functionality with localStorage
 */

class SaveManager {
    constructor(game) {
        this.game = game;
        this.storageKey = 'undertale_save';
        this.maxSlots = 3;
    }
    
    /**
     * Check if save exists
     */
    async checkSave(slot = 0) {
        try {
            const key = `${this.storageKey}_${slot}`;
            const data = localStorage.getItem(key);
            return data !== null;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Save game data
     */
    async save(data, slot = 0) {
        try {
            const key = `${this.storageKey}_${slot}`;
            const saveData = {
                ...data,
                version: '1.0',
                timestamp: Date.now(),
                playtime: data.playtime || 0
            };
            
            localStorage.setItem(key, JSON.stringify(saveData));
            console.log(`Game saved to slot ${slot}`);
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }
    
    /**
     * Load game data
     */
    async load(slot = 0) {
        try {
            const key = `${this.storageKey}_${slot}`;
            const data = localStorage.getItem(key);
            
            if (!data) {
                console.log(`No save found in slot ${slot}`);
                return null;
            }
            
            const saveData = JSON.parse(data);
            console.log(`Game loaded from slot ${slot}`);
            return saveData;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }
    
    /**
     * Delete save
     */
    async deleteSave(slot = 0) {
        try {
            const key = `${this.storageKey}_${slot}`;
            localStorage.removeItem(key);
            console.log(`Save deleted from slot ${slot}`);
            return true;
        } catch (e) {
            console.error('Delete failed:', e);
            return false;
        }
    }
    
    /**
     * Get save info (for display)
     */
    async getSaveInfo(slot = 0) {
        try {
            const data = await this.load(slot);
            if (!data) return null;
            
            return {
                slot: slot,
                name: data.player?.name || 'CHARA',
                lv: data.player?.lv || 1,
                location: this.getLocationName(data.room),
                playtime: this.formatPlaytime(data.playtime || 0),
                timestamp: new Date(data.timestamp).toLocaleString()
            };
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Get all save slots info
     */
    async getAllSaveInfo() {
        const saves = [];
        for (let i = 0; i < this.maxSlots; i++) {
            const info = await this.getSaveInfo(i);
            saves.push(info);
        }
        return saves;
    }
    
    /**
     * Get location name from room ID
     */
    getLocationName(roomId) {
        const locationMap = {
            'ruins_fall': 'いせき - 最初の部屋',
            'ruins_flowey': 'いせき - フラウィの部屋',
            'ruins_entrance': 'いせき - 入口',
            'ruins_home': 'トリエルの家',
            'ruins_exit': 'いせき - 出口',
            'snowdin_entrance': 'スノーフル - 入口',
            'snowdin_town': 'スノーフルの町',
            'skeleton_house': 'サンズとパピルスの家'
        };
        
        return locationMap[roomId] || roomId || '不明な場所';
    }
    
    /**
     * Format playtime
     */
    formatPlaytime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }
    
    /**
     * Export save as file
     */
    exportSave(slot = 0) {
        const key = `${this.storageKey}_${slot}`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            console.log('No save to export');
            return;
        }
        
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `undertale_save_${slot}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Import save from file
     */
    importSave(file, slot = 0) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const key = `${this.storageKey}_${slot}`;
                    localStorage.setItem(key, JSON.stringify(data));
                    console.log(`Save imported to slot ${slot}`);
                    resolve(true);
                } catch (err) {
                    console.error('Import failed:', err);
                    reject(err);
                }
            };
            
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    /**
     * Copy save to another slot
     */
    async copySave(fromSlot, toSlot) {
        const data = await this.load(fromSlot);
        if (data) {
            await this.save(data, toSlot);
            return true;
        }
        return false;
    }
    
    /**
     * Clear all saves
     */
    async clearAllSaves() {
        for (let i = 0; i < this.maxSlots; i++) {
            await this.deleteSave(i);
        }
        console.log('All saves cleared');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveManager;
}
