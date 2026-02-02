/**
 * UNDERTALE Web Recreation - Dialogue System
 * Handles text display, typing effects, and character-specific styling
 */

class DialogueSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.queue = [];
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.typeTimer = 0;
        this.typeSpeed = 50; // ms per character
        this.waiting = false;
        this.choices = null;
        this.selectedChoice = 0;
        this.onComplete = null;
        this.currentCharacter = null;
        
        // DOM elements
        this.elements = {
            box: document.getElementById('dialogue-box'),
            face: document.getElementById('dialogue-face'),
            text: document.getElementById('dialogue-text'),
            choices: document.getElementById('dialogue-choices')
        };
        
        // Character-specific settings
        this.characterSettings = {
            flowey: {
                sound: SFX.TEXT_FLOWEY,
                speed: 30,
                face: 'flowey_normal'
            },
            toriel: {
                sound: SFX.TEXT_TORIEL,
                speed: 45,
                face: 'toriel'
            },
            sans: {
                sound: SFX.TEXT_SANS,
                speed: 40,
                face: 'sans',
                style: 'text-sans'
            },
            papyrus: {
                sound: SFX.TEXT_PAPYRUS,
                speed: 35,
                face: 'papyrus',
                style: 'text-papyrus'
            },
            napstablook: {
                sound: SFX.TEXT,
                speed: 70,
                face: 'napstablook',
                style: 'text-napstablook'
            },
            narrator: {
                sound: SFX.TEXT,
                speed: 50,
                face: null
            }
        };
    }
    
    /**
     * Show a simple text message
     */
    showText(text, onComplete = null) {
        return new Promise((resolve) => {
            this.currentCharacter = 'narrator';
            this.onComplete = () => {
                if (onComplete) onComplete();
                resolve();
            };
            
            this.startDialogue([text]);
        });
    }
    
    /**
     * Show character dialogue with portrait
     */
    showCharacterDialogue(character, texts, onComplete = null) {
        return new Promise((resolve) => {
            this.currentCharacter = character;
            this.onComplete = () => {
                if (onComplete) onComplete();
                resolve();
            };
            
            this.startDialogue(texts);
        });
    }
    
    /**
     * Show dialogue with choices
     */
    showChoices(text, choices, onSelect = null) {
        return new Promise((resolve) => {
            this.currentCharacter = 'narrator';
            this.choices = choices;
            this.selectedChoice = 0;
            
            this.onComplete = () => {
                // Show choices after text is done
                this.showChoiceUI();
            };
            
            this.choiceCallback = (index) => {
                if (onSelect) onSelect(index);
                resolve(index);
            };
            
            this.startDialogue([text]);
        });
    }
    
    /**
     * Start dialogue sequence
     */
    startDialogue(texts) {
        this.active = true;
        this.queue = [...texts];
        this.displayNextText();
        
        // Show dialogue box
        this.elements.box.classList.remove('hidden');
        
        // Set up character-specific settings
        const settings = this.characterSettings[this.currentCharacter] || this.characterSettings.narrator;
        this.typeSpeed = settings.speed;
        
        // Show face if character has one
        if (settings.face) {
            this.elements.face.classList.add('active');
            this.elements.face.innerHTML = `<img src="assets/sprites/faces/${settings.face}.png" alt="${this.currentCharacter}">`;
        } else {
            this.elements.face.classList.remove('active');
        }
        
        // Apply text style
        this.elements.text.className = '';
        if (settings.style) {
            this.elements.text.classList.add(settings.style);
        }
    }
    
    /**
     * Display next text in queue
     */
    displayNextText() {
        if (this.queue.length === 0) {
            this.endDialogue();
            return;
        }
        
        this.currentText = this.queue.shift();
        this.displayedText = '';
        this.charIndex = 0;
        this.waiting = false;
        
        this.elements.text.textContent = '';
        this.elements.text.classList.add('typing');
        
        this.typeNextChar();
    }
    
    /**
     * Type next character with sound
     */
    typeNextChar() {
        if (!this.active) return;
        
        if (this.charIndex >= this.currentText.length) {
            // Text complete
            this.elements.text.classList.remove('typing');
            this.waiting = true;
            return;
        }
        
        const char = this.currentText.charAt(this.charIndex);
        this.displayedText += char;
        this.elements.text.textContent = this.displayedText;
        this.charIndex++;
        
        // Play text sound (not for spaces or punctuation)
        if (char.match(/[a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/)) {
            const settings = this.characterSettings[this.currentCharacter] || this.characterSettings.narrator;
            this.game.audio.playSFX(settings.sound, 0.5);
        }
        
        // Calculate delay for next character
        let delay = this.typeSpeed;
        if (char === '。' || char === '！' || char === '？' || char === '.') {
            delay *= 4; // Longer pause after sentence end
        } else if (char === '、' || char === ',') {
            delay *= 2; // Medium pause after comma
        }
        
        setTimeout(() => this.typeNextChar(), delay);
    }
    
    /**
     * Update dialogue state
     */
    update() {
        if (!this.active) return;
        
        // Handle input during choices
        if (this.choices && this.waiting) {
            if (this.game.input.justPressed('up')) {
                this.selectedChoice = Math.max(0, this.selectedChoice - 1);
                this.game.audio.playSFX(SFX.SELECT);
                this.updateChoiceSelection();
            } else if (this.game.input.justPressed('down')) {
                this.selectedChoice = Math.min(this.choices.length - 1, this.selectedChoice + 1);
                this.game.audio.playSFX(SFX.SELECT);
                this.updateChoiceSelection();
            } else if (this.game.input.justPressed('confirm')) {
                this.selectChoice();
            }
        }
    }
    
    /**
     * Advance dialogue
     */
    advance() {
        if (!this.active) return;
        
        if (!this.waiting) {
            // Skip to end of current text
            this.displayedText = this.currentText;
            this.elements.text.textContent = this.displayedText;
            this.charIndex = this.currentText.length;
            this.elements.text.classList.remove('typing');
            this.waiting = true;
        } else if (this.choices) {
            // Don't advance if choices are showing
            return;
        } else {
            // Move to next text
            this.game.audio.playSFX(SFX.CONFIRM);
            this.displayNextText();
        }
    }
    
    /**
     * Show choice UI
     */
    showChoiceUI() {
        this.elements.choices.classList.remove('hidden');
        this.elements.choices.innerHTML = '';
        
        this.choices.forEach((choice, i) => {
            const choiceEl = document.createElement('div');
            choiceEl.className = 'choice-item';
            if (i === this.selectedChoice) choiceEl.classList.add('selected');
            choiceEl.textContent = choice.text || choice;
            choiceEl.addEventListener('click', () => {
                this.selectedChoice = i;
                this.selectChoice();
            });
            this.elements.choices.appendChild(choiceEl);
        });
    }
    
    /**
     * Update choice selection visual
     */
    updateChoiceSelection() {
        const choiceItems = this.elements.choices.querySelectorAll('.choice-item');
        choiceItems.forEach((item, i) => {
            item.classList.toggle('selected', i === this.selectedChoice);
        });
    }
    
    /**
     * Select current choice
     */
    selectChoice() {
        this.game.audio.playSFX(SFX.CONFIRM);
        const selectedIndex = this.selectedChoice;
        
        this.choices = null;
        this.elements.choices.classList.add('hidden');
        
        if (this.choiceCallback) {
            this.choiceCallback(selectedIndex);
            this.choiceCallback = null;
        }
        
        this.endDialogue();
    }
    
    /**
     * End dialogue
     */
    endDialogue() {
        this.active = false;
        this.elements.box.classList.add('hidden');
        this.elements.choices.classList.add('hidden');
        this.elements.face.classList.remove('active');
        
        if (this.onComplete) {
            this.onComplete();
            this.onComplete = null;
        }
    }
    
    /**
     * Show sign/object text
     */
    showSignText(text) {
        return new Promise((resolve) => {
            this.currentCharacter = 'narrator';
            this.elements.text.classList.add('sign-text');
            
            this.onComplete = () => {
                this.elements.text.classList.remove('sign-text');
                resolve();
            };
            
            this.startDialogue([text]);
        });
    }
    
    /**
     * Show SAVE point text
     */
    showSaveText(locationName, determination) {
        return new Promise(async (resolve) => {
            this.currentCharacter = 'narrator';
            
            await this.showText(`（${locationName}）`);
            
            this.elements.text.classList.add('determination-text');
            await this.showText(determination);
            this.elements.text.classList.remove('determination-text');
            
            resolve();
        });
    }
    
    /**
     * Show phone call dialogue
     */
    showPhoneCall(character, texts) {
        return new Promise((resolve) => {
            this.elements.box.classList.add('phone-dialogue');
            
            this.currentCharacter = character;
            this.onComplete = () => {
                this.elements.box.classList.remove('phone-dialogue');
                resolve();
            };
            
            this.startDialogue(texts);
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DialogueSystem;
}
