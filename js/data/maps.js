/**
 * UNDERTALE Web Recreation - Map Data
 * Room definitions, connections, and event triggers for Ruins and Snowdin
 */

const MAPS = {
    // ============================================
    // RUINS - First Area
    // ============================================
    
    ruins_fall: {
        id: 'ruins_fall',
        name: 'おちてきた場所',
        area: 'ruins',
        width: 320,
        height: 240,
        background: 'ruins_fall',
        music: null,
        spawnPoint: { x: 160, y: 200 },
        collision: [
            { x: 0, y: 0, w: 320, h: 40 },
            { x: 0, y: 0, w: 40, h: 240 },
            { x: 280, y: 0, w: 40, h: 240 }
        ],
        exits: [
            { x: 130, y: 0, w: 60, h: 10, target: 'ruins_flowey', spawnX: 160, spawnY: 220 }
        ],
        objects: [
            { type: 'flowers', x: 140, y: 180, w: 40, h: 30 }
        ]
    },
    
    ruins_flowey: {
        id: 'ruins_flowey',
        name: 'フラウィの部屋',
        area: 'ruins',
        width: 320,
        height: 240,
        background: 'ruins_dark',
        music: null,
        spawnPoint: { x: 160, y: 220 },
        exits: [
            { x: 130, y: 0, w: 60, h: 10, target: 'ruins_entrance', spawnX: 160, spawnY: 220 }
        ],
        npcs: [
            { 
                id: 'flowey',
                x: 160, y: 120,
                sprite: 'flowey',
                interaction: 'flowey_intro',
                disappearAfter: 'flowey_intro_done'
            }
        ]
    },
    
    ruins_entrance: {
        id: 'ruins_entrance',
        name: 'いせきの入口',
        area: 'ruins',
        width: 640,
        height: 480,
        background: 'ruins_entrance',
        music: 'mus_ruins',
        spawnPoint: { x: 320, y: 440 },
        exits: [
            { x: 280, y: 470, w: 80, h: 10, target: 'ruins_flowey', spawnX: 160, spawnY: 20 },
            { x: 280, y: 90, w: 80, h: 10, target: 'ruins_toriel', spawnX: 320, spawnY: 440 }
        ],
        savePoint: {
            x: 100, y: 200,
            name: 'いせきの入口',
            text: 'おちばの　かおり・・・\nケツイが　みなぎった。'
        }
    },
    
    ruins_toriel: {
        id: 'ruins_toriel',
        name: 'トリエルの部屋',
        area: 'ruins',
        width: 640,
        height: 480,
        background: 'ruins_room',
        music: 'mus_ruins',
        spawnPoint: { x: 320, y: 440 },
        npcs: [
            {
                id: 'toriel_guide',
                x: 320, y: 200,
                sprite: 'toriel',
                interaction: 'toriel_first_puzzle',
                disappearAfter: 'toriel_left_ruins'
            }
        ],
        exits: [
            { x: 280, y: 470, w: 80, h: 10, target: 'ruins_entrance', spawnX: 320, spawnY: 100 },
            { x: 600, y: 200, w: 40, h: 80, target: 'ruins_puzzle1', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_puzzle1: {
        id: 'ruins_puzzle1',
        name: 'スイッチパズル1',
        area: 'ruins',
        width: 640,
        height: 480,
        background: 'ruins_puzzle',
        music: 'mus_ruins',
        spawnPoint: { x: 40, y: 240 },
        puzzle: {
            type: 'switch_order',
            switches: [
                { x: 200, y: 150, correct: true },
                { x: 300, y: 150, correct: false },
                { x: 400, y: 150, correct: true },
                { x: 200, y: 300, correct: false },
                { x: 300, y: 300, correct: true },
                { x: 400, y: 300, correct: true }
            ],
            solution: [0, 2, 4, 5]
        },
        exits: [
            { x: 0, y: 200, w: 10, h: 80, target: 'ruins_toriel', spawnX: 580, spawnY: 240 },
            { x: 600, y: 200, w: 40, h: 80, target: 'ruins_puzzle2', spawnX: 40, spawnY: 240, requires: 'puzzle1_complete' }
        ],
        signs: [
            { x: 320, y: 100, text: '「マークの　ついたスイッチだけ　押しなさい」' }
        ]
    },
    
    ruins_dummy: {
        id: 'ruins_dummy',
        name: 'ダミーの部屋',
        area: 'ruins',
        width: 320,
        height: 240,
        background: 'ruins_room',
        music: 'mus_ruins',
        spawnPoint: { x: 160, y: 200 },
        npcs: [
            {
                id: 'dummy',
                x: 160, y: 100,
                sprite: 'dummy',
                interaction: 'dummy_battle',
                battleOnInteract: 'dummy'
            },
            {
                id: 'toriel_dummy',
                x: 80, y: 150,
                sprite: 'toriel',
                dialogue: 'toriel_dummy_hint',
                disappearAfter: 'dummy_defeated'
            }
        ],
        exits: [
            { x: 0, y: 100, w: 10, h: 80, target: 'ruins_puzzle2', spawnX: 280, spawnY: 120 },
            { x: 310, y: 100, w: 10, h: 80, target: 'ruins_hall1', spawnX: 40, spawnY: 120 }
        ]
    },
    
    ruins_froggit: {
        id: 'ruins_froggit',
        name: '最初の戦闘',
        area: 'ruins',
        width: 480,
        height: 320,
        background: 'ruins_corridor',
        music: 'mus_ruins',
        spawnPoint: { x: 40, y: 160 },
        encounters: [
            { enemies: ['froggit_first'], x: 200, y: 160, w: 80, h: 80, oneshot: true, flag: 'first_battle_done' }
        ],
        npcs: [
            {
                id: 'toriel_battle',
                x: 350, y: 160,
                sprite: 'toriel',
                script: 'toriel_first_battle',
                disappearAfter: 'first_battle_done'
            }
        ],
        exits: [
            { x: 0, y: 120, w: 10, h: 80, target: 'ruins_hall1', spawnX: 440, spawnY: 160 },
            { x: 470, y: 120, w: 10, h: 80, target: 'ruins_spike_puzzle', spawnX: 40, spawnY: 160 }
        ]
    },
    
    ruins_spike_puzzle: {
        id: 'ruins_spike_puzzle',
        name: 'スパイクパズル',
        area: 'ruins',
        width: 640,
        height: 480,
        background: 'ruins_puzzle',
        music: 'mus_ruins',
        spawnPoint: { x: 40, y: 240 },
        puzzle: {
            type: 'spike_path',
            safePath: [
                { x: 100, y: 240 }, { x: 150, y: 240 }, { x: 200, y: 240 },
                { x: 200, y: 190 }, { x: 250, y: 190 }, { x: 300, y: 190 },
                { x: 300, y: 240 }, { x: 350, y: 240 }, { x: 400, y: 240 }
            ],
            damageOnWrong: 1
        },
        exits: [
            { x: 0, y: 200, w: 10, h: 80, target: 'ruins_froggit', spawnX: 440, spawnY: 160 },
            { x: 630, y: 200, w: 10, h: 80, target: 'ruins_long_hall', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_home: {
        id: 'ruins_home',
        name: 'トリエルの家',
        area: 'ruins',
        width: 640,
        height: 480,
        background: 'toriel_home',
        music: 'mus_home',
        spawnPoint: { x: 320, y: 400 },
        exits: [
            { x: 280, y: 470, w: 80, h: 10, target: 'ruins_home_outside', spawnX: 320, spawnY: 40 },
            { x: 80, y: 200, w: 60, h: 80, target: 'ruins_home_livingroom', spawnX: 280, spawnY: 200 },
            { x: 500, y: 200, w: 60, h: 80, target: 'ruins_home_hallway', spawnX: 160, spawnY: 200 },
            { x: 280, y: 150, w: 80, h: 10, target: 'ruins_basement', spawnX: 320, spawnY: 400, requires: 'toriel_permission' }
        ],
        npcs: [
            {
                id: 'toriel_home',
                x: 200, y: 300,
                sprite: 'toriel',
                interaction: 'toriel_home_dialogue'
            }
        ],
        savePoint: {
            x: 100, y: 350,
            name: 'トリエルの家',
            text: 'トリエルの家の　あたたかさ・・・\nケツイが　みなぎった。'
        }
    },
    
    ruins_basement: {
        id: 'ruins_basement',
        name: '地下通路',
        area: 'ruins',
        width: 1280,
        height: 240,
        background: 'ruins_basement',
        music: 'mus_ruins',
        spawnPoint: { x: 40, y: 120 },
        exits: [
            { x: 0, y: 80, w: 10, h: 80, target: 'ruins_home', spawnX: 320, spawnY: 200 },
            { x: 1270, y: 80, w: 10, h: 80, target: 'ruins_exit', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_exit: {
        id: 'ruins_exit',
        name: 'いせきの出口',
        area: 'ruins',
        width: 640,
        height: 480,
        background: 'ruins_exit',
        music: null,
        spawnPoint: { x: 40, y: 240 },
        npcs: [
            {
                id: 'toriel_battle_final',
                x: 320, y: 200,
                sprite: 'toriel_battle',
                interaction: 'toriel_final_battle',
                battleOnInteract: 'toriel',
                disappearAfter: 'toriel_defeated'
            }
        ],
        exits: [
            { x: 0, y: 200, w: 10, h: 80, target: 'ruins_basement', spawnX: 1240, spawnY: 120 },
            { x: 280, y: 0, w: 80, h: 10, target: 'snowdin_entrance', spawnX: 160, spawnY: 440, requires: 'toriel_defeated' }
        ]
    },

    // ============================================
    // SNOWDIN - Second Area
    // ============================================
    
    snowdin_entrance: {
        id: 'snowdin_entrance',
        name: 'スノーフル入口',
        area: 'snowdin',
        width: 640,
        height: 480,
        background: 'snowdin_forest',
        music: 'mus_snowy',
        spawnPoint: { x: 160, y: 440 },
        exits: [
            { x: 130, y: 470, w: 60, h: 10, target: 'ruins_exit', spawnX: 320, spawnY: 50 },
            { x: 600, y: 200, w: 40, h: 80, target: 'snowdin_path1', spawnX: 40, spawnY: 240 }
        ],
        objects: [
            { type: 'bush', x: 400, y: 300, w: 60, h: 40, canHide: true }
        ]
    },
    
    snowdin_path1: {
        id: 'snowdin_path1',
        name: '雪の道1',
        area: 'snowdin',
        width: 960,
        height: 320,
        background: 'snowdin_path',
        music: 'mus_snowy',
        spawnPoint: { x: 40, y: 160 },
        randomEncounters: {
            rate: 0.05,
            enemies: ['snowdrake', 'icecap']
        },
        exits: [
            { x: 0, y: 120, w: 10, h: 80, target: 'snowdin_entrance', spawnX: 580, spawnY: 240 },
            { x: 950, y: 120, w: 10, h: 80, target: 'snowdin_sans', spawnX: 40, spawnY: 160 }
        ],
        objects: [
            { type: 'branch', x: 500, y: 160, sound: 'snd_branch' }
        ]
    },
    
    snowdin_sans: {
        id: 'snowdin_sans',
        name: 'サンズとの出会い',
        area: 'snowdin',
        width: 640,
        height: 320,
        background: 'snowdin_bridge_area',
        music: 'mus_snowy',
        spawnPoint: { x: 40, y: 160 },
        npcs: [
            {
                id: 'sans_intro',
                x: 400, y: 160,
                sprite: 'sans',
                interaction: 'sans_intro',
                disappearAfter: 'sans_intro_done'
            }
        ],
        exits: [
            { x: 0, y: 120, w: 10, h: 80, target: 'snowdin_path1', spawnX: 920, spawnY: 160 },
            { x: 630, y: 120, w: 10, h: 80, target: 'snowdin_gate', spawnX: 40, spawnY: 160 }
        ]
    },
    
    snowdin_gate: {
        id: 'snowdin_gate',
        name: 'スケルトンの門',
        area: 'snowdin',
        width: 640,
        height: 320,
        background: 'snowdin_gate',
        music: 'mus_snowy',
        spawnPoint: { x: 40, y: 160 },
        objects: [
            { type: 'gate', x: 280, y: 100, w: 80, h: 120, passable: true }
        ],
        npcs: [
            {
                id: 'papyrus_intro',
                x: 500, y: 160,
                sprite: 'papyrus',
                interaction: 'papyrus_intro',
                disappearAfter: 'papyrus_intro_done'
            },
            {
                id: 'sans_gate',
                x: 200, y: 180,
                sprite: 'sans',
                interaction: 'sans_gate_dialogue'
            }
        ],
        exits: [
            { x: 0, y: 120, w: 10, h: 80, target: 'snowdin_sans', spawnX: 600, spawnY: 160 },
            { x: 630, y: 120, w: 10, h: 80, target: 'snowdin_doggo', spawnX: 40, spawnY: 160 }
        ]
    },
    
    snowdin_doggo: {
        id: 'snowdin_doggo',
        name: 'ドゴーの小屋',
        area: 'snowdin',
        width: 640,
        height: 320,
        background: 'snowdin_doggo',
        music: 'mus_snowy',
        spawnPoint: { x: 40, y: 160 },
        npcs: [
            {
                id: 'doggo',
                x: 320, y: 160,
                sprite: 'doggo_standing',
                interaction: 'doggo_battle',
                battleOnInteract: 'doggo',
                requiresMovement: true,
                disappearAfter: 'doggo_defeated'
            }
        ],
        savePoint: {
            x: 100, y: 250,
            name: 'ドゴーの小屋',
            text: '犬の鳴き声が　聞こえる・・・\nケツイが　みなぎった。'
        },
        exits: [
            { x: 0, y: 120, w: 10, h: 80, target: 'snowdin_gate', spawnX: 600, spawnY: 160 },
            { x: 630, y: 120, w: 10, h: 80, target: 'snowdin_puzzle_electric', spawnX: 40, spawnY: 160 }
        ]
    },
    
    snowdin_town: {
        id: 'snowdin_town',
        name: 'スノーフルの町',
        area: 'snowdin',
        width: 1280,
        height: 480,
        background: 'snowdin_town',
        music: 'mus_snowdin_town',
        spawnPoint: { x: 40, y: 300 },
        buildings: [
            { 
                type: 'shop',
                x: 200, y: 180, w: 100, h: 120,
                entrance: { x: 250, y: 300 },
                interior: 'snowdin_shop'
            },
            {
                type: 'inn',
                x: 400, y: 180, w: 100, h: 120,
                entrance: { x: 450, y: 300 },
                interior: 'snowdin_inn'
            },
            {
                type: 'skeleton_house',
                x: 900, y: 150, w: 150, h: 150,
                entrance: { x: 975, y: 300 },
                interior: 'skeleton_house',
                requires: 'papyrus_defeated'
            }
        ],
        npcs: [
            { id: 'snowdin_bunny', x: 300, y: 350, sprite: 'bunny_npc', dialogue: 'snowdin_bunny_dialogue' },
            { id: 'snowdin_bear', x: 500, y: 380, sprite: 'bear_npc', dialogue: 'snowdin_bear_dialogue' }
        ],
        savePoint: {
            x: 150, y: 350,
            name: 'スノーフルの町',
            text: '小さいけれど　にぎやかな　町・・・\nケツイが　みなぎった。'
        },
        exits: [
            { x: 0, y: 260, w: 10, h: 80, target: 'snowdin_path_town', spawnX: 920, spawnY: 240 },
            { x: 1270, y: 260, w: 10, h: 80, target: 'snowdin_papyrus_battle', spawnX: 40, spawnY: 240 }
        ]
    },
    
    snowdin_papyrus_battle: {
        id: 'snowdin_papyrus_battle',
        name: 'パピルス戦',
        area: 'snowdin',
        width: 640,
        height: 320,
        background: 'snowdin_fog',
        music: null,
        spawnPoint: { x: 40, y: 160 },
        npcs: [
            {
                id: 'papyrus_final',
                x: 500, y: 160,
                sprite: 'papyrus',
                interaction: 'papyrus_final_battle',
                battleOnInteract: 'papyrus',
                disappearAfter: 'papyrus_defeated'
            }
        ],
        exits: [
            { x: 0, y: 120, w: 10, h: 80, target: 'snowdin_town', spawnX: 1240, spawnY: 300 },
            { x: 630, y: 120, w: 10, h: 80, target: 'waterfall_entrance', spawnX: 40, spawnY: 160, requires: 'papyrus_defeated' }
        ]
    },
    
    skeleton_house: {
        id: 'skeleton_house',
        name: 'サンズとパピルスの家',
        area: 'snowdin',
        width: 480,
        height: 320,
        background: 'skeleton_house_interior',
        music: 'mus_home',
        spawnPoint: { x: 240, y: 280 },
        interactables: [
            { type: 'tv', x: 100, y: 150, dialogue: 'tv_mettaton' },
            { type: 'couch', x: 200, y: 180, dialogue: 'couch_comfy' },
            { type: 'sock', x: 350, y: 250, dialogue: 'sans_sock' },
            { type: 'pet_rock', x: 150, y: 200, dialogue: 'pet_rock' }
        ],
        exits: [
            { x: 220, y: 310, w: 40, h: 10, target: 'snowdin_town', spawnX: 975, spawnY: 350 },
            { x: 50, y: 120, w: 30, h: 40, target: 'sans_room', spawnX: 160, spawnY: 200, requires: 'sans_room_key' },
            { x: 400, y: 120, w: 30, h: 40, target: 'papyrus_room', spawnX: 160, spawnY: 200 }
        ],
        npcs: [
            {
                id: 'sans_home',
                x: 120, y: 200,
                sprite: 'sans',
                interaction: 'sans_home_dialogue',
                condition: (flags) => flags.papyrus_defeated
            },
            {
                id: 'papyrus_home',
                x: 350, y: 200,
                sprite: 'papyrus',
                interaction: 'papyrus_home_dialogue',
                condition: (flags) => flags.papyrus_spared
            }
        ]
    },
    
    papyrus_room: {
        id: 'papyrus_room',
        name: 'パピルスの部屋',
        area: 'snowdin',
        width: 320,
        height: 240,
        background: 'papyrus_room',
        music: 'mus_home',
        spawnPoint: { x: 160, y: 200 },
        interactables: [
            { type: 'bed', x: 50, y: 80, dialogue: 'papyrus_bed_race_car' },
            { type: 'action_figures', x: 200, y: 100, dialogue: 'papyrus_figures' },
            { type: 'computer', x: 280, y: 80, dialogue: 'papyrus_computer' },
            { type: 'bookshelf', x: 100, y: 60, dialogue: 'papyrus_books' }
        ],
        exits: [
            { x: 140, y: 230, w: 40, h: 10, target: 'skeleton_house', spawnX: 400, spawnY: 150 }
        ]
    }
};

// Room connection data for easier navigation
const ROOM_CONNECTIONS = {
    ruins: [
        'ruins_fall', 'ruins_flowey', 'ruins_entrance', 'ruins_toriel',
        'ruins_puzzle1', 'ruins_dummy', 'ruins_froggit', 'ruins_spike_puzzle',
        'ruins_home', 'ruins_basement', 'ruins_exit'
    ],
    snowdin: [
        'snowdin_entrance', 'snowdin_path1', 'snowdin_sans', 'snowdin_gate',
        'snowdin_doggo', 'snowdin_puzzle_electric', 'snowdin_town',
        'snowdin_papyrus_battle', 'skeleton_house', 'papyrus_room'
    ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAPS, ROOM_CONNECTIONS };
}
