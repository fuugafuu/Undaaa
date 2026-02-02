/**
 * UNDERTALE Web Recreation - Constants
 * Game-wide constants, configuration, and enumerations
 */

const GAME = {
    WIDTH: 640,
    HEIGHT: 480,
    FPS: 30,
    TILE_SIZE: 20,
    VERSION: '1.0.0'
};

// Soul movement speed
const SOUL = {
    SPEED: 4,
    SIZE: 16,
    GRAVITY: 0.5,      // For blue soul
    JUMP_FORCE: -8,    // For blue soul
    MAX_FALL: 10       // Terminal velocity
};

// Soul modes/colors
const SOUL_MODE = {
    RED: 'red',        // Normal movement
    BLUE: 'blue',      // Gravity (platformer)
    CYAN: 'cyan',      // Patient (slow when moving)
    ORANGE: 'orange',  // Bravery (must keep moving)
    PURPLE: 'purple',  // Perseverance (web lines)
    GREEN: 'green',    // Kindness (shield)
    YELLOW: 'yellow'   // Justice (shooter)
};

// Battle constants
const BATTLE = {
    BOX_DEFAULT_WIDTH: 575,
    BOX_DEFAULT_HEIGHT: 140,
    ATTACK_METER_SPEED: 8,
    INVINCIBILITY_FRAMES: 60,  // ~2 seconds at 30fps
    TEXT_SPEED: 2              // Characters per frame
};

// Player initial stats
const PLAYER_BASE_STATS = {
    hp: 20,
    maxHp: 20,
    lv: 1,
    exp: 0,
    gold: 0,
    at: 0,
    df: 0,
    inv: 30  // Default invincibility frames
};

// LV to EXP thresholds
const LV_THRESHOLDS = [
    0,      // LV 1
    10,     // LV 2
    30,     // LV 3
    70,     // LV 4
    120,    // LV 5
    200,    // LV 6
    300,    // LV 7
    500,    // LV 8
    800,    // LV 9
    1200,   // LV 10
    1700,   // LV 11
    2500,   // LV 12
    3500,   // LV 13
    5000,   // LV 14
    7000,   // LV 15
    10000,  // LV 16
    15000,  // LV 17
    25000,  // LV 18
    50000,  // LV 19
    99999   // LV 20
];

// Stats per LV
const LV_STATS = {
    1:  { hp: 20, at: 0, df: 0 },
    2:  { hp: 24, at: 2, df: 0 },
    3:  { hp: 28, at: 4, df: 0 },
    4:  { hp: 32, at: 6, df: 0 },
    5:  { hp: 36, at: 8, df: 1 },
    6:  { hp: 40, at: 10, df: 1 },
    7:  { hp: 44, at: 12, df: 1 },
    8:  { hp: 48, at: 14, df: 1 },
    9:  { hp: 52, at: 16, df: 2 },
    10: { hp: 56, at: 18, df: 2 },
    11: { hp: 60, at: 20, df: 2 },
    12: { hp: 64, at: 22, df: 2 },
    13: { hp: 68, at: 24, df: 3 },
    14: { hp: 72, at: 26, df: 3 },
    15: { hp: 76, at: 28, df: 3 },
    16: { hp: 80, at: 30, df: 3 },
    17: { hp: 84, at: 32, df: 4 },
    18: { hp: 88, at: 34, df: 4 },
    19: { hp: 92, at: 36, df: 4 },
    20: { hp: 99, at: 30, df: 30 }  // Special LV20 stats
};

// Damage calculation constants
const DAMAGE = {
    // Player attack formula: ((ATK - EnemyDEF) * HitMultiplier) + Random(-2, 2)
    // HitMultiplier: 1.0 for center, down to 0.5 for edges
    MIN_DAMAGE: 1,
    RANDOM_RANGE: 2,
    CRITICAL_ZONE: 0.1  // Center 10% of attack bar
};

// Key bindings
const KEYS = {
    UP: ['ArrowUp', 'KeyW'],
    DOWN: ['ArrowDown', 'KeyS'],
    LEFT: ['ArrowLeft', 'KeyA'],
    RIGHT: ['ArrowRight', 'KeyD'],
    CONFIRM: ['KeyZ', 'Enter'],
    CANCEL: ['KeyX', 'Shift', 'Escape'],
    MENU: ['KeyC', 'ControlLeft']
};

// Game states
const STATE = {
    TITLE: 'title',
    NAMING: 'naming',
    OVERWORLD: 'overworld',
    BATTLE: 'battle',
    DIALOGUE: 'dialogue',
    MENU: 'menu',
    CUTSCENE: 'cutscene',
    GAMEOVER: 'gameover'
};

// Battle phases
const BATTLE_PHASE = {
    START: 'start',
    MENU: 'menu',
    FIGHT: 'fight',
    ACT: 'act',
    ITEM: 'item',
    MERCY: 'mercy',
    ENEMY_TURN: 'enemy_turn',
    ATTACK: 'attack',
    RESULT: 'result',
    END: 'end'
};

// Map/Area identifiers
const AREA = {
    RUINS: 'ruins',
    SNOWDIN_FOREST: 'snowdin_forest',
    SNOWDIN_TOWN: 'snowdin_town'
};

// Room IDs for Ruins
const RUINS_ROOMS = {
    FALL: 'ruins_fall',
    FLOWEY: 'ruins_flowey',
    SAVE1: 'ruins_save1',
    PUZZLE1: 'ruins_puzzle1',
    PUZZLE2: 'ruins_puzzle2',
    DUMMY: 'ruins_dummy',
    SPIKES: 'ruins_spikes',
    FIRST_FROGGIT: 'ruins_first_froggit',
    LONG_HALL: 'ruins_long_hall',
    PILLAR: 'ruins_pillar',
    LEAF_FALL: 'ruins_leaf_fall',
    ROCK_PUZZLE1: 'ruins_rock1',
    ROCK_PUZZLE2: 'ruins_rock2',
    CHEESE: 'ruins_cheese',
    NAPSTABLOOK: 'ruins_napstablook',
    SPIDER: 'ruins_spider',
    SWITCH_PUZZLE: 'ruins_switch',
    HOME_EXTERIOR: 'ruins_home_ext',
    HOME_ENTRY: 'ruins_home_entry',
    HOME_LIVING: 'ruins_home_living',
    HOME_KITCHEN: 'ruins_home_kitchen',
    HOME_HALLWAY: 'ruins_home_hall',
    HOME_BEDROOM: 'ruins_home_bedroom',
    HOME_TORIEL: 'ruins_home_toriel',
    BASEMENT: 'ruins_basement',
    BASEMENT_HALL: 'ruins_basement_hall',
    EXIT: 'ruins_exit'
};

// Room IDs for Snowdin Forest
const SNOWDIN_ROOMS = {
    ENTRANCE: 'snowdin_entrance',
    SANS_INTRO: 'snowdin_sans',
    BOX_ROAD: 'snowdin_box',
    PAPYRUS_STATION: 'snowdin_pap_station',
    ELECTRIC_MAZE: 'snowdin_maze',
    BALL_GAME: 'snowdin_ball',
    DOGGO: 'snowdin_doggo',
    DOGI_PUZZLE: 'snowdin_dogi',
    SLIDE: 'snowdin_slide',
    NICE_CREAM: 'snowdin_nice_cream',
    WORD_SEARCH: 'snowdin_word',
    BRIDGE: 'snowdin_bridge',
    TOWN_ENTRANCE: 'snowdin_town_entrance',
    TOWN_CENTER: 'snowdin_town_center',
    SHOP: 'snowdin_shop',
    INN: 'snowdin_inn',
    GRILLBYS: 'snowdin_grillbys',
    LIBRARY: 'snowdin_library',
    SKELETON_HOUSE: 'snowdin_skeleton_house',
    PAPYRUS_FIGHT: 'snowdin_papyrus_fight'
};

// Audio tracks
const MUSIC = {
    // Ruins
    RUINS: 'mus_ruins',
    HOME: 'mus_home',
    HOME_MUSIC_BOX: 'mus_home_box',
    HEARTACHE: 'mus_heartache',
    
    // Snowdin
    SNOWY: 'mus_snowy',
    SNOWDIN_TOWN: 'mus_snowdin',
    NYEH_HEH_HEH: 'mus_nyeh',
    BONETROUSLE: 'mus_bonetrousle',
    SANS: 'mus_sans',
    DOGSONG: 'mus_dogsong',
    
    // Battle
    ENEMY_APPROACHING: 'mus_enemy_approaching',
    GHOST_FIGHT: 'mus_ghost_fight',
    DETERMINATION: 'mus_determination'
};

// Sound effects
const SFX = {
    TEXT: 'snd_text',
    TEXT_TORIEL: 'snd_text_toriel',
    TEXT_SANS: 'snd_text_sans',
    TEXT_PAPYRUS: 'snd_text_papyrus',
    TEXT_FLOWEY: 'snd_text_flowey',
    SELECT: 'snd_select',
    CONFIRM: 'snd_confirm',
    CANCEL: 'snd_cancel',
    SAVE: 'snd_save',
    HEAL: 'snd_heal',
    HURT: 'snd_hurt',
    DAMAGE: 'snd_damage',
    ATTACK: 'snd_attack',
    SOUL_BREAK: 'snd_soul_break',
    ENCOUNTER: 'snd_encounter',
    SPARE: 'snd_spare',
    FLEE: 'snd_flee',
    ITEM: 'snd_item',
    EQUIP: 'snd_equip',
    PHONE: 'snd_phone',
    STEP: 'snd_step',
    DOOR: 'snd_door'
};

// Sprite paths (relative to assets/sprites/)
const SPRITES = {
    PLAYER: {
        DOWN: 'characters/player_down.png',
        UP: 'characters/player_up.png',
        LEFT: 'characters/player_left.png',
        RIGHT: 'characters/player_right.png'
    },
    TORIEL: {
        FRONT: 'characters/toriel_front.png',
        WALK: 'characters/toriel_walk.png',
        BATTLE: 'enemies/toriel_battle.png'
    },
    FLOWEY: {
        NORMAL: 'characters/flowey_normal.png',
        EVIL: 'characters/flowey_evil.png',
        BATTLE: 'enemies/flowey_battle.png'
    },
    SANS: {
        FRONT: 'characters/sans_front.png',
        WALK: 'characters/sans_walk.png'
    },
    PAPYRUS: {
        FRONT: 'characters/papyrus_front.png',
        WALK: 'characters/papyrus_walk.png',
        BATTLE: 'enemies/papyrus_battle.png'
    },
    // Enemy battle sprites
    ENEMIES: {
        FROGGIT: 'enemies/froggit.png',
        WHIMSUN: 'enemies/whimsun.png',
        MOLDSMAL: 'enemies/moldsmal.png',
        LOOX: 'enemies/loox.png',
        VEGETOID: 'enemies/vegetoid.png',
        MIGOSP: 'enemies/migosp.png',
        NAPSTABLOOK: 'enemies/napstablook.png',
        DUMMY: 'enemies/dummy.png',
        SNOWDRAKE: 'enemies/snowdrake.png',
        ICECAP: 'enemies/icecap.png',
        GYFTROT: 'enemies/gyftrot.png',
        DOGGO: 'enemies/doggo.png',
        LESSER_DOG: 'enemies/lesser_dog.png',
        GREATER_DOG: 'enemies/greater_dog.png',
        DOGAMY: 'enemies/dogamy.png',
        DOGARESSA: 'enemies/dogaressa.png',
        JERRY: 'enemies/jerry.png'
    },
    // UI elements
    UI: {
        SOUL: 'ui/soul.png',
        SOUL_BLUE: 'ui/soul_blue.png',
        HEART: 'ui/heart.png',
        BOX: 'ui/box.png'
    },
    // Attack/bullet sprites
    ATTACKS: {
        BONE: 'effects/bone.png',
        BONE_BLUE: 'effects/bone_blue.png',
        FIREBALL: 'effects/fireball.png',
        TEAR: 'effects/tear.png',
        FLY: 'effects/fly.png'
    }
};

// Special name easter eggs (Japanese)
const SPECIAL_NAMES = {
    'フリスク': { mode: 'hard', message: '警告: このモードは かなり難しいです。 本当にこの名前でいいですか？' },
    'FRISK': { mode: 'hard', message: '警告: このモードは かなり難しいです。 本当にこの名前でいいですか？' },
    'トリエル': { message: 'あなたが決めるべき名前ではありません。' },
    'サンズ': { message: 'いい名前だけど...' },
    'パピルス': { message: '気に入らない!!!' },
    'アンダイン': { message: 'この名前を盗むな！' },
    'アルフィー': { message: 'これは... えっと...' },
    'メタトン': { message: 'おおおおぅ!!!! この名前すてき!!!!' },
    'アズゴア': { message: '名前をつけるのが下手だね。' },
    'アズリエル': { message: '...' },
    'チャラ': { message: '本当の名前。' },
    'フラウィ': { message: 'きみは ぼくじゃないよ！' },
    'ガスター': { message: '■■■■■■' }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME, SOUL, SOUL_MODE, BATTLE, PLAYER_BASE_STATS,
        LV_THRESHOLDS, LV_STATS, DAMAGE, KEYS, STATE, BATTLE_PHASE,
        AREA, RUINS_ROOMS, SNOWDIN_ROOMS, MUSIC, SFX, SPRITES, SPECIAL_NAMES
    };
}
