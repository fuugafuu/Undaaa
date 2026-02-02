/**
 * UNDERTALE Web Recreation - Items Database
 * Complete item data with Japanese names and accurate effects
 */

const ITEMS = {
    // ============================================
    // HEALING ITEMS - RUINS
    // ============================================
    
    monster_candy: {
        id: 'monster_candy',
        name: 'モンスターキャンディ',
        nameEn: 'Monster Candy',
        type: 'consumable',
        heal: 10,
        description: 'あまーい　キャンディ。',
        useText: 'モンスターキャンディを　食べた。\nとても　あまい！',
        sellPrice: 5,
        buyPrice: 0, // Free from bowl
        category: 'food'
    },
    
    spider_donut: {
        id: 'spider_donut',
        name: 'クモのドーナツ',
        nameEn: 'Spider Donut',
        type: 'consumable',
        heal: 12,
        description: 'クモが　作った　ドーナツ。\nクモの巣で　できている。',
        useText: 'クモのドーナツを　食べた。\nクモの巣の　味がする！',
        sellPrice: 20,
        buyPrice: 7,
        category: 'food',
        special: 'muffet_encounter' // Prevents Muffet fight if used
    },
    
    spider_cider: {
        id: 'spider_cider',
        name: 'クモのサイダー',
        nameEn: 'Spider Cider',
        type: 'consumable',
        heal: 24,
        description: 'クモが　作った　サイダー。\nクモで　できている。',
        useText: 'クモのサイダーを　飲んだ。\nクモの味がする！',
        sellPrice: 30,
        buyPrice: 18,
        category: 'drink',
        special: 'muffet_encounter'
    },
    
    butterscotch_pie: {
        id: 'butterscotch_pie',
        name: 'バタースコッチパイ',
        nameEn: 'Butterscotch Pie',
        type: 'consumable',
        heal: 99, // Full heal
        description: 'バタースコッチと　シナモンの　パイ。',
        useText: 'バタースコッチパイを　食べた。\nとても　おいしい！\nHPが　まんたんに　なった！',
        sellPrice: 50,
        buyPrice: 0, // Gift from Toriel
        category: 'food',
        special: 'asgore_effect' // Lowers Asgore's stats if eaten in his fight
    },
    
    // ============================================
    // HEALING ITEMS - SNOWDIN
    // ============================================
    
    nice_cream: {
        id: 'nice_cream',
        name: 'ナイスクリーム',
        nameEn: 'Nice Cream',
        type: 'consumable',
        heal: 15,
        description: 'アイスクリーム。\n元気が出る　メッセージつき！',
        useText: 'ナイスクリームを　食べた！\nメッセージ:「きみは　すてきだ！」',
        sellPrice: 8,
        buyPrice: 15,
        category: 'food',
        messages: [
            'きみは　すてきだ！',
            'きょうも　いい日に　なるよ！',
            'がんばってね！',
            'きみなら　できる！',
            'あなたは　あいされている！'
        ]
    },
    
    bisicle: {
        id: 'bisicle',
        name: 'ビスクル',
        nameEn: 'Bisicle',
        type: 'consumable',
        heal: 11,
        description: '2本セットの　アイスキャンディ。\n2回に　分けて　使える！',
        useText: 'ビスクルを　1本　食べた！',
        sellPrice: 5,
        buyPrice: 15,
        category: 'food',
        split: 'unisicle' // Becomes this item after first use
    },
    
    unisicle: {
        id: 'unisicle',
        name: 'ユニスクル',
        nameEn: 'Unisicle',
        type: 'consumable',
        heal: 11,
        description: 'ビスクルの　残り半分。',
        useText: 'ユニスクルを　食べた！',
        sellPrice: 2,
        buyPrice: 0, // Can't buy, only from Bisicle
        category: 'food'
    },
    
    cinnamon_bunny: {
        id: 'cinnamon_bunny',
        name: 'シナモンバニー',
        nameEn: 'Cinnamon Bunny',
        type: 'consumable',
        heal: 22,
        description: 'うさぎの　形をした\nシナモンロール。',
        useText: 'シナモンバニーを　食べた！\nシナモンの　いい香り！',
        sellPrice: 12,
        buyPrice: 25,
        category: 'food'
    },
    
    snowman_piece: {
        id: 'snowman_piece',
        name: 'ゆきだるまのかけら',
        nameEn: 'Snowman Piece',
        type: 'consumable',
        heal: 45,
        description: '雪だるまから　もらった　雪。\n遠くまで　運んでほしいと　頼まれた。',
        useText: 'ゆきだるまのかけらを　食べた。\nとても　つめたい！',
        sellPrice: 50,
        buyPrice: 0, // Gift
        category: 'special',
        canHold: 3
    },
    
    // ============================================
    // WEAPONS - RUINS
    // ============================================
    
    stick: {
        id: 'stick',
        name: 'ぼう',
        nameEn: 'Stick',
        type: 'weapon',
        atk: 0,
        description: 'ただの　えだ。\nその辺で　ひろった。',
        equipText: 'ぼうを　そうびした。',
        sellPrice: 5,
        buyPrice: 0,
        special: 'dog_interest' // Dogs are interested in this
    },
    
    toy_knife: {
        id: 'toy_knife',
        name: 'おもちゃのナイフ',
        nameEn: 'Toy Knife',
        type: 'weapon',
        atk: 3,
        description: 'プラスチックの　ナイフ。\nぜんぜん　切れない。',
        equipText: 'おもちゃのナイフを　そうびした。',
        sellPrice: 25,
        buyPrice: 0, // Found in Ruins
        location: 'ruins'
    },
    
    // ============================================
    // WEAPONS - SNOWDIN
    // ============================================
    
    tough_glove: {
        id: 'tough_glove',
        name: 'タフグローブ',
        nameEn: 'Tough Glove',
        type: 'weapon',
        atk: 5,
        description: 'ボクシング用の　グローブ。\nボタンを　たくさん　押すと\nたくさん　当たる！',
        equipText: 'タフグローブを　そうびした。',
        sellPrice: 50,
        buyPrice: 50,
        multiHit: 4, // Can hit up to 4 times
        location: 'snowdin'
    },
    
    // ============================================
    // ARMOR - RUINS
    // ============================================
    
    bandage: {
        id: 'bandage',
        name: 'ばんそうこう',
        nameEn: 'Bandage',
        type: 'armor',
        df: 0,
        description: 'ただの　ばんそうこう。\nHP　1　回復（アイテムとして使用時）',
        equipText: 'ばんそうこうを　そうびした。',
        sellPrice: 5,
        buyPrice: 0,
        healOnUse: 1
    },
    
    faded_ribbon: {
        id: 'faded_ribbon',
        name: 'くすんだリボン',
        nameEn: 'Faded Ribbon',
        type: 'armor',
        df: 3,
        description: '色あせた　リボン。\nかつては　明るい　色だった。',
        equipText: 'くすんだリボンを　そうびした。',
        sellPrice: 25,
        buyPrice: 0, // Found in Ruins
        location: 'ruins'
    },
    
    // ============================================
    // ARMOR - SNOWDIN
    // ============================================
    
    manly_bandanna: {
        id: 'manly_bandanna',
        name: 'マンリーバンダナ',
        nameEn: 'Manly Bandanna',
        type: 'armor',
        df: 7,
        description: 'マッチョマンが　つけてそうな\nバンダナ。',
        equipText: 'マンリーバンダナを　そうびした。',
        sellPrice: 50,
        buyPrice: 50,
        location: 'snowdin_shop'
    },
    
    old_tutu: {
        id: 'old_tutu',
        name: 'ふるいチュチュ',
        nameEn: 'Old Tutu',
        type: 'armor',
        df: 10,
        description: 'かなり　古い　チュチュ。\n優雅に　回避できる。',
        equipText: 'ふるいチュチュを　そうびした。',
        sellPrice: 75,
        buyPrice: 0, // Found in Waterfall
        location: 'waterfall',
        bonusInv: 1 // Extra invincibility frame
    },
    
    // ============================================
    // KEY ITEMS
    // ============================================
    
    cell_phone: {
        id: 'cell_phone',
        name: 'けいたいでんわ',
        nameEn: 'Cell Phone',
        type: 'key',
        description: 'トリエルから　もらった\nけいたいでんわ。',
        canDrop: false
    },
    
    annoying_dog: {
        id: 'annoying_dog',
        name: 'うざいイヌ',
        nameEn: 'Annoying Dog',
        type: 'key',
        description: 'なぜか　インベントリに　いる。',
        canDrop: false,
        special: 'absorbs_artifact' // Absorbs legendary artifact
    }
};

// ============================================
// SHOP DATA
// ============================================

const SHOPS = {
    ruins_spider: {
        id: 'ruins_spider',
        name: 'クモのベイクセール',
        keeper: null, // Web-based shop
        items: ['spider_donut', 'spider_cider'],
        greeting: '（クモの巣に　お金を　置くと\nクモが　商品を　持ってくる）',
        buyText: '（クモたちが　商品を　運んできた）',
        exitText: '（クモたちが　手を振った）'
    },
    
    snowdin_shop: {
        id: 'snowdin_shop',
        name: 'スノーフルショップ',
        keeper: 'shopkeeper',
        items: ['tough_glove', 'manly_bandanna', 'bisicle', 'cinnamon_bunny'],
        greeting: 'いらっしゃい！\n何を　買っていく？',
        lowGoldText: 'ごめんね、\nお金が　たりないみたい。',
        buyText: 'ありがとう！\n他に　何か　いる？',
        exitText: 'また　きてね！',
        talkTopics: [
            {
                name: 'この店について',
                text: 'ここは　スノーフルで\n唯一の　お店よ。\nなんでも　そろってるわ！'
            },
            {
                name: 'スノーフルについて',
                text: 'スノーフルは　静かな　町よ。\nみんな　優しいわ。\n・・・ちょっと　変わった子も　いるけど。'
            }
        ]
    },
    
    nice_cream_stand: {
        id: 'nice_cream_stand',
        name: 'ナイスクリームスタンド',
        keeper: 'nice_cream_guy',
        items: ['nice_cream'],
        greeting: 'やあ！　ナイスクリームは　いかが？\n元気が出る　メッセージつきだよ！',
        buyText: 'ナイスクリームを　どうぞ！\n今日も　いい日に　なるといいね！',
        exitText: 'じゃあね！　また会おう！'
    }
};

// ============================================
// DIMENSIONAL BOX DATA
// ============================================

const DIMENSIONAL_BOX = {
    maxItems: 10,
    locations: [
        { area: 'snowdin', room: 'snowdin_box', x: 200, y: 150 }
    ]
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ITEMS, SHOPS, DIMENSIONAL_BOX };
}
