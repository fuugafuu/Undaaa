/**
 * UNDERTALE Web Recreation - Enemy Data
 * Complete enemy database for Ruins and Snowdin
 */

const ENEMIES = {
    // ============================================
    // RUINS ENEMIES
    // ============================================
    
    dummy: {
        id: 'dummy',
        name: 'ダミー',
        hp: 20, maxHp: 20,
        atk: 0, def: 0,
        exp: 0, gold: 0,
        canFlee: false,
        check: 'コットン100%。\n気持ちは　まだ　こもっていない。',
        flavorTexts: ['ダミーが　じっと　こちらを　見ている。'],
        acts: [
            { name: 'はなす', effect: 'talk' },
            { name: 'チェック', effect: 'check' }
        ],
        attacks: [],
        sprite: 'dummy',
        spareCondition: (b) => b.turns >= 1,
        onTalk: () => ({ text: 'ダミーに　話しかけた。\nダミーは　なにも　言わない。', spareable: true })
    },
    
    froggit: {
        id: 'froggit',
        name: 'フロギー',
        hp: 30, maxHp: 30,
        atk: 4, def: 5,
        exp: 3, gold: 2,
        canFlee: true,
        check: 'ATK 4 DEF 5\nいきるのが　たいへんな　敵。',
        flavorTexts: [
            'フロギーが　ぴょんぴょん　はねている。',
            'マスタードの　においが　ただよっている。'
        ],
        acts: [
            { name: 'ほめる', effect: 'compliment' },
            { name: 'おどす', effect: 'threaten' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'froggit',
        spareCondition: (b) => b.enemyFlags.complimented || b.enemyFlags.threatened,
        onCompliment: (b) => { b.enemyFlags.complimented = true; return { text: 'フロギーは　きみの言ったことを\n理解できなかった。\nでも　うれしそうだ。', spareable: true }; },
        onThreaten: (b) => { b.enemyFlags.threatened = true; return { text: 'フロギーは　きみの言ったことを\n理解できなかった。\nでも　怖がっているようだ。', spareable: true }; }
    },
    
    whimsun: {
        id: 'whimsun',
        name: 'ナキムシ',
        hp: 10, maxHp: 10,
        atk: 5, def: 0,
        exp: 2, gold: 2,
        canFlee: true,
        check: 'ATK 5 DEF 0\nこのモンスターは　傷つきやすすぎて\nたたかえない・・・',
        flavorTexts: ['ナキムシは　なきそうに　見える。'],
        acts: [
            { name: 'なぐさめる', effect: 'console' },
            { name: 'おどす', effect: 'terrorize' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'whimsun',
        spareCondition: () => true,
        onConsole: () => ({ text: 'ナキムシを　なぐさめた。\nナキムシは　にげだした！', endBattle: true }),
        onTerrorize: () => ({ text: 'ナキムシを　おどした。\nナキムシは　こわがって　にげだした！', endBattle: true })
    },
    
    moldsmal: {
        id: 'moldsmal',
        name: 'モルドスマ',
        hp: 50, maxHp: 50,
        atk: 6, def: 0,
        exp: 3, gold: 1,
        canFlee: true,
        check: 'ATK 6 DEF 0\nモルドスマル。\n生活様式が　あれ。',
        flavorTexts: ['モルドスマルが　ぷるぷる　している。'],
        acts: [
            { name: 'イミテイト', effect: 'imitate' },
            { name: 'フレックス', effect: 'flex' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'moldsmal',
        spareCondition: () => true,
        onImitate: () => ({ text: 'モルドスマルを　まねした。\nモルドスマルは　わかってくれた　ようだ。', spareable: true }),
        onFlex: () => ({ text: 'きんにくを　見せつけた。\nモルドスマルは　わかってくれた　ようだ。', spareable: true })
    },
    
    loox: {
        id: 'loox',
        name: 'ルックス',
        hp: 50, maxHp: 50,
        atk: 6, def: 6,
        exp: 7, gold: 5,
        canFlee: true,
        check: 'ATK 6 DEF 6\n見つめないでくれと　頼んでいる。',
        flavorTexts: ['ルックスは　あなたを　じっと見つめている。'],
        acts: [
            { name: '見つめない', effect: 'dontPickOn' },
            { name: '見つめる', effect: 'pickOn' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'loox',
        spareCondition: (b) => b.enemyFlags.dontPickOn,
        onDontPickOn: (b) => { b.enemyFlags.dontPickOn = true; return { text: 'ルックスを　見つめなかった。\nルックスは　安心したようだ。', spareable: true }; },
        onPickOn: () => ({ text: 'ルックスを　見つめた。\nルックスは　怒っている！', atkUp: true })
    },
    
    vegetoid: {
        id: 'vegetoid',
        name: 'ベジトイド',
        hp: 72, maxHp: 72,
        atk: 6, def: 6,
        exp: 6, gold: 4,
        canFlee: true,
        check: 'ATK 6 DEF 6\nやさいを　食べろ。\nおいしいぞ。',
        flavorTexts: ['ベジトイドが　土から　顔を出している。'],
        acts: [
            { name: 'ディナー', effect: 'dinner' },
            { name: 'デボウアー', effect: 'devour' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'vegetoid',
        spareCondition: (b) => b.enemyFlags.ate
    },
    
    migosp: {
        id: 'migosp',
        name: 'ミゴスプ',
        hp: 40, maxHp: 40,
        atk: 7, def: 5,
        exp: 4, gold: 2,
        canFlee: true,
        check: 'ATK 7 DEF 5\nひとりになると　なにも　しなくなる。',
        flavorTexts: ['ミゴスプは　よくしゃべる。'],
        acts: [
            { name: 'はなす', effect: 'talk' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'migosp',
        spareCondition: (b) => b.aloneInBattle,
        specialBehavior: 'stops_when_alone'
    },
    
    napstablook: {
        id: 'napstablook',
        name: 'ナプスタブルーク',
        hp: 88, maxHp: 88,
        atk: 10, def: 10,
        exp: 0, gold: 0,
        canFlee: true,
        isBoss: true,
        check: 'ATK 10 DEF 10\nこのゴーストは　ずっとここにいる。\n人がいないから・・・',
        flavorTexts: ['ナプスタブルークは　静かに　泣いている・・・'],
        acts: [
            { name: 'チアー', effect: 'cheer' },
            { name: 'フレックス', effect: 'flex' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'napstablook',
        music: 'mus_ghost_fight',
        spareCondition: (b) => b.enemyFlags.cheerCount >= 3,
        onCheer: (b) => {
            b.enemyFlags.cheerCount = (b.enemyFlags.cheerCount || 0) + 1;
            const msgs = [
                'ナプスタブルークを　はげました。\nナプスタブルークは　少し　元気が出たようだ。',
                'ナプスタブルークを　はげました。\nナプスタブルークは　笑おうとしている。',
                'ナプスタブルークを　はげました。\n「見て　ぼく・・・\nなみだを　使って・・・」'
            ];
            const idx = Math.min(b.enemyFlags.cheerCount - 1, msgs.length - 1);
            return { text: msgs[idx], spareable: b.enemyFlags.cheerCount >= 3 };
        },
        onHit: () => ({ text: 'あなたの　こうげきは　すりぬけた。', noDamage: true })
    },
    
    // ============================================
    // RUINS BOSS: TORIEL
    // ============================================
    
    toriel: {
        id: 'toriel',
        name: 'トリエル',
        hp: 440, maxHp: 440,
        atk: 80, def: 80,
        exp: 200, gold: 0,
        canFlee: false,
        isBoss: true,
        check: 'ATK 80 DEF 80\n「いせき」の番人。\n不思議な　やさしさを　持っている。',
        flavorTexts: [
            'トリエルは　じっと　見つめている。',
            'トリエルは　目を　そらした。',
            'トリエルの　手が　ふるえている。'
        ],
        acts: [
            { name: 'はなす', effect: 'talk' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'toriel_battle',
        music: 'mus_heartache',
        spareCondition: (b) => b.enemyFlags.spareCount >= 24,
        getEffectiveDef: (b, p) => {
            if (p.hp < 3) return -15;
            if (b.enemy.currentHp < 150) return -140;
            return 80;
        },
        shouldMiss: (p) => p.hp < 3,
        onTalk: (b) => {
            const count = b.enemyFlags.talkCount || 0;
            b.enemyFlags.talkCount = count + 1;
            const msgs = ['・・・', '・・・・・・', 'どうして　あきらめない？', '・・・いきなさい。'];
            return { text: msgs[Math.min(count, msgs.length - 1)] };
        },
        onSpare: (b) => {
            b.enemyFlags.spareCount = (b.enemyFlags.spareCount || 0) + 1;
            if (b.enemyFlags.spareCount >= 24) {
                return { text: '・・・わかった。\n止められない　のね。', spareable: true, endFight: true };
            }
            return null;
        },
        onKill: () => ({
            specialDeath: true,
            dialogue: ['・・・あなたは　本当に・・・', '・・・つよい　子ね・・・', '・・・行きなさい・・・']
        })
    },

    // ============================================
    // SNOWDIN ENEMIES
    // ============================================
    
    snowdrake: {
        id: 'snowdrake',
        name: 'スノードレイク',
        hp: 74, maxHp: 74,
        atk: 12, def: 7,
        exp: 22, gold: 18,
        canFlee: true,
        check: 'ATK 12 DEF 7\n最近　家から　家出してきた\nティーンエイジャーの　ドレイク。',
        flavorTexts: ['スノードレイクは　ダジャレを　言いたそうだ。'],
        acts: [
            { name: 'ジョーク', effect: 'joke' },
            { name: 'ヘックル', effect: 'heckle' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'snowdrake',
        spareCondition: (b) => b.enemyFlags.laughed
    },
    
    icecap: {
        id: 'icecap',
        name: 'アイスキャップ',
        hp: 48, maxHp: 48,
        atk: 12, def: 6,
        exp: 17, gold: 17,
        canFlee: true,
        check: 'ATK 12 DEF 6\n自分の　ぼうしを\n見せびらかしたい　らしい。',
        flavorTexts: ['アイスキャップは　自分の帽子を　自慢している。'],
        acts: [
            { name: 'ほめる', effect: 'compliment' },
            { name: '無視する', effect: 'ignore' },
            { name: 'ぼうしを取る', effect: 'stealHat' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'icecap',
        spareCondition: (b) => b.enemyFlags.ignoreCount >= 2 || b.enemyFlags.hatStolen,
        onIgnore: (b) => {
            b.enemyFlags.ignoreCount = (b.enemyFlags.ignoreCount || 0) + 1;
            if (b.enemyFlags.ignoreCount >= 2) return { text: 'アイスキャップを　無視した。\nアイスキャップは　自信を　なくした。', spareable: true };
            return { text: 'アイスキャップを　無視した。\nアイスキャップは　こまっているようだ。' };
        },
        onStealHat: (b) => {
            b.enemyFlags.hatStolen = true;
            return { text: 'アイスキャップの　帽子を　取った！\nアイスキャップは　「アイス」に　なった！', spareable: true };
        }
    },
    
    gyftrot: {
        id: 'gyftrot',
        name: 'ギフトロット',
        hp: 114, maxHp: 114,
        atk: 14, def: 8,
        exp: 35, gold: 30,
        canFlee: true,
        check: 'ATK 14 DEF 8\nティーンエイジャーに\nいじめられ続けた　悲しい　生き物。',
        flavorTexts: ['ギフトロットは　飾り付けに　うんざりしている。'],
        acts: [
            { name: 'かざりを取る', effect: 'undecorate' },
            { name: 'チェック', effect: 'check' }
        ],
        sprite: 'gyftrot',
        spareCondition: (b) => b.enemyFlags.undecorateCount >= 3,
        onUndecorate: (b) => {
            b.enemyFlags.undecorateCount = (b.enemyFlags.undecorateCount || 0) + 1;
            if (b.enemyFlags.undecorateCount >= 3) return { text: 'かざりを　取りのぞいた。\nギフトロットは　とても　感謝している。', spareable: true };
            return { text: 'かざりを　取りのぞいた。\nギフトロットは　少し　楽になった。' };
        }
    },
    
    doggo: {
        id: 'doggo',
        name: 'ドゴー',
        hp: 70, maxHp: 70,
        atk: 12, def: 5,
        exp: 30, gold: 30,
        canFlee: true,
        isBoss: true,
        check: 'ATK 12 DEF 5\n動いているものしか　見えない。',
        flavorTexts: ['ドゴーは　あなたが　動くのを　待っている。'],
        acts: [{ name: 'なでる', effect: 'pet' }, { name: 'チェック', effect: 'check' }],
        sprite: 'doggo',
        music: 'mus_dogsong',
        spareCondition: (b) => b.enemyFlags.petted,
        onPet: (b) => {
            if (!b.enemyFlags.petted) {
                b.enemyFlags.petted = true;
                return { text: 'ドゴーを　なでた。\n「なに？ なでられた？」', spareable: true };
            }
            return { text: 'ドゴーを　なでた。' };
        }
    },
    
    lesser_dog: {
        id: 'lesser_dog',
        name: 'レッサードッグ',
        hp: 60, maxHp: 60,
        atk: 12, def: 5,
        exp: 18, gold: 20,
        canFlee: true,
        isBoss: true,
        check: 'ATK 12 DEF 5\nなでてほしいと　思っている。',
        flavorTexts: ['レッサードッグは　しっぽを　ふっている。'],
        acts: [{ name: 'なでる', effect: 'pet' }, { name: 'チェック', effect: 'check' }],
        sprite: 'lesser_dog',
        music: 'mus_dogsong',
        spareCondition: (b) => b.enemyFlags.petCount >= 1,
        onPet: (b) => {
            b.enemyFlags.petCount = (b.enemyFlags.petCount || 0) + 1;
            const msgs = ['レッサードッグを　なでた。', 'レッサードッグを　なでた。\n首が　のびてきた。', 'レッサードッグを　なでた。\n首が　さらに　のびた！'];
            return { text: msgs[Math.min(b.enemyFlags.petCount - 1, msgs.length - 1)], spareable: true };
        }
    },
    
    jerry: {
        id: 'jerry',
        name: 'ジェリー',
        hp: 60, maxHp: 60,
        atk: 7, def: 7,
        exp: 1, gold: 0,
        canFlee: true,
        damageMultiplier: 0.2,
        check: 'ATK 7 DEF 7\n・・・・・・ジェリー。',
        flavorTexts: ['ジェリーが　いる。'],
        acts: [{ name: 'ディッチ', effect: 'ditch' }, { name: 'チェック', effect: 'check' }],
        sprite: 'jerry',
        spareCondition: () => true,
        onDitch: (b) => {
            if (b.enemies.length === 1) return { text: 'ジェリーを　ディッチした。', endBattle: true };
            return { text: 'ジェリーを　ディッチした。\nでも　戻ってきた。' };
        }
    },

    // ============================================
    // SNOWDIN BOSS: PAPYRUS
    // ============================================
    
    papyrus: {
        id: 'papyrus',
        name: 'パピルス',
        hp: 680, maxHp: 680,
        atk: 20, def: 20,
        exp: 200, gold: 0,
        canFlee: false,
        isBoss: true,
        cantDie: true,
        check: 'ATK 20 DEF 20\n友達が　ほしいと　思っている\nスケルトン。',
        flavorTexts: ['パピルスは　ホネを　使った　攻撃の　準備をしている。', 'パピルスは　自信満々だ。'],
        acts: [
            { name: 'チェック', effect: 'check' },
            { name: 'フラート', effect: 'flirt' },
            { name: 'おしゃべり', effect: 'talk' }
        ],
        sprite: 'papyrus_battle',
        music: 'mus_bonetrousle',
        spareCondition: (b) => b.enemyFlags.spared,
        onTurnEnd: (b) => {
            b.enemyFlags.turnCount = (b.enemyFlags.turnCount || 0) + 1;
            if (b.enemyFlags.turnCount >= 22) return { text: '「・・・オマエ　まだ　あきらめないの？」', spareable: true };
            return null;
        },
        onFlirt: (b) => {
            if (!b.enemyFlags.flirted) { b.enemyFlags.flirted = true; return { text: 'パピルスに　フラートした！\n「え・・・えぇぇぇぇぇ！？」' }; }
            return { text: 'パピルスに　フラートした！' };
        },
        onTalk: (b) => {
            const count = b.enemyFlags.talkCount || 0;
            b.enemyFlags.talkCount = count + 1;
            const talks = ['「なにを　話したいんだ？」', '「オレさまは　パピルス！」', '「友達が　ほしいんだ・・・」'];
            return { text: talks[Math.min(count, talks.length - 1)] };
        },
        onKill: () => ({ specialDeath: true, dialogue: ['「・・・ニンゲン・・・」', '「おまえなら　もっと　よく・・・」'] }),
        onSpare: () => ({ text: '「ニンゲン！\nオマエは　もう\nオレさまの　友達だ！」', friendEnding: true })
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ENEMIES };
}
