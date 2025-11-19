const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Easy words - common, simple words (expanded list)
const easyWords = [
  'ABOUT', 'AFTER', 'AGAIN', 'ALLOW', 'APPLE', 'BEACH', 'BEING', 'BLACK', 'BOARD', 'BREAD',
  'BRING', 'BROWN', 'BUILD', 'CHAIR', 'CHILD', 'CLEAN', 'CLEAR', 'CLOCK', 'CLOSE', 'COULD',
  'DAILY', 'DANCE', 'DOING', 'DREAM', 'DRINK', 'EARLY', 'EARTH', 'EIGHT', 'EMPTY', 'ENJOY',
  'ENTER', 'EVERY', 'FIELD', 'FIRST', 'FLOOR', 'FOUND', 'FRESH', 'FRONT', 'FRUIT', 'FUNNY',
  'GIVEN', 'GLASS', 'GOING', 'GRAND', 'GRASS', 'GREAT', 'GREEN', 'GROUP', 'HAPPY', 'HEART',
  'HEAVY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'LARGE', 'LATER', 'LAUGH', 'LEARN', 'LIGHT',
  'LUNCH', 'MAGIC', 'MONEY', 'MONTH', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC', 'NEVER', 'NIGHT',
  'OCEAN', 'OFTEN', 'OTHER', 'PAINT', 'PAPER', 'PARTY', 'PEACE', 'PHONE', 'PLACE', 'PLANT',
  'POINT', 'POWER', 'QUEEN', 'QUICK', 'QUIET', 'RADIO', 'READY', 'RIGHT', 'RIVER', 'ROUND',
  'SEVEN', 'SHAPE', 'SHIRT', 'SHORT', 'SIGHT', 'SLEEP', 'SMALL', 'SMILE', 'SOUND', 'SOUTH',
  'SPACE', 'SPEAK', 'SPEND', 'STAND', 'START', 'STONE', 'STORE', 'STORY', 'STUDY', 'SWEET',
  'TABLE', 'THANK', 'THEIR', 'THERE', 'THESE', 'THING', 'THINK', 'THREE', 'TODAY', 'TOUCH',
  'TRAIN', 'UNDER', 'UNTIL', 'VISIT', 'VOICE', 'WATCH', 'WATER', 'WHERE', 'WHICH', 'WHILE',
  'WHITE', 'WHOLE', 'WOMAN', 'WORLD', 'WOULD', 'WRITE', 'WRONG', 'YOUNG', 'YOUTH', 'CLICK',
  'PRICE', 'STATE', 'EMAIL', 'VIDEO', 'BOOKS', 'LINKS', 'YEARS', 'ORDER', 'ITEMS', 'GAMES',
  'HOTEL', 'TERMS', 'LOCAL', 'THOSE', 'USING', 'PHONE', 'FORUM', 'BASED', 'CHECK', 'INDEX',
  'WOMEN', 'PAGES', 'PHOTO', 'TOTAL', 'NORTH', 'POSTS', 'MEDIA', 'SINCE', 'GUIDE', 'BOARD',
  'SMALL', 'TIMES', 'SITES', 'LEVEL', 'HOURS', 'IMAGE', 'TITLE', 'SHALL', 'CLASS', 'STILL',
  'EVERY', 'TOOLS', 'REPLY', 'VALUE', 'PRESS', 'LEARN', 'PRINT', 'STOCK', 'POINT', 'SALES',
  'TABLE', 'MODEL', 'HUMAN', 'MOVIE', 'MARCH', 'YAHOO', 'STUDY', 'STAFF', 'APRIL', 'USERS',
  'TOPIC', 'BELOW', 'LOGIN', 'LEGAL', 'ABOVE', 'QUOTE', 'STORY', 'RATES', 'FIELD', 'GIRLS',
  'NIGHT', 'TEXAS', 'POKER', 'ISSUE', 'RANGE', 'COURT', 'AUDIO', 'OFFER', 'GIVEN', 'FILES',
  'EVENT', 'NEEDS', 'MIGHT', 'MAJOR', 'AREAS', 'CARDS', 'ENTER', 'SHARE', 'ADDED', 'UNTIL',
  'COLOR', 'TRACK', 'LEAST', 'TRADE', 'DAVID', 'CLOSE', 'DRIVE', 'MEANS', 'BEACH', 'COSTS',
  'STYLE', 'PARTS', 'EARLY', 'MILES', 'WORKS', 'RULES', 'FINAL', 'ADULT', 'CHEAP', 'THIRD',
  'GIFTS', 'COVER', 'OFTEN', 'DEALS', 'WORDS', 'LINUX', 'JAMES', 'ERROR', 'MAKES', 'TAKEN',
  'KNOWN', 'CASES', 'WHOLE', 'LATER', 'BASIC', 'SHOWS', 'ALONG', 'AMONG', 'DEATH', 'SPEED',
  'BRAND', 'STUFF', 'LOANS', 'SHOES', 'ENTRY', 'NOTES', 'FORCE', 'RIVER', 'ALBUM', 'VIEWS',
  'PLANS', 'BUILD', 'TYPES', 'LINES', 'APPLY', 'ASKED', 'CROSS', 'WEEKS', 'LOWER', 'UNION',
  'NAMES', 'LEAVE', 'TEENS', 'CABLE', 'SCORE', 'SHOWN', 'FLASH', 'IDEAS', 'HOMES', 'SUPER',
  'ASIAN', 'CAUSE', 'FOCUS', 'ROOMS', 'COMES', 'BROWN', 'FORMS', 'HAPPY', 'SMITH', 'PRIOR',
  'SPORT', 'ROUND', 'BUILT', 'BLOOD', 'NOKIA', 'BASIS', 'AWARD', 'PETER', 'EXTRA', 'RATED',
  'QUITE', 'HORSE', 'LISTS', 'OWNER', 'TAKES', 'INPUT', 'AGENT', 'VALID', 'GRAND', 'TRIAL',
  'UNITS', 'WROTE', 'SHIPS', 'METAL', 'FUNDS', 'GUEST', 'SEEMS', 'TRUST', 'MULTI', 'GRADE',
  'PANEL', 'FLOOR', 'MATCH', 'PLANT', 'SENSE', 'STAGE', 'GOODS', 'MAYBE', 'BATCH', 'ALTER',
  'EDGES', 'TWINS', 'AMEND', 'CHICK', 'THONG', 'MEDAL', 'WALKS', 'BOOTH', 'INDIE', 'BONES',
  'BREED', 'POLAR', 'MSGID', 'CAREY', 'DANNY', 'PATIO', 'LLOYD', 'BEANS', 'ELLIS', 'SNAKE',
  'JULIA', 'BERRY', 'OUGHT', 'FIXES', 'SENDS', 'MAZDA', 'TIMER', 'TYLER', 'VERSE', 'HIGHS',
  'ELLEN', 'RACKS', 'NASTY', 'TUMOR', 'WATTS', 'FORTY', 'TUBES', 'FLOYD', 'QUEUE', 'SKINS',
  'EXAMS', 'WELSH', 'BELLY', 'ELDER', 'SONIC', 'THUMB', 'TWIST', 'RANKS', 'DEBUT', 'VOLVO',
  'PENNY', 'IVORY', 'REMIX', 'ALIAS', 'NEWER', 'SPICE', 'ASCII', 'DONOR', 'TRASH', 'MANOR',
  'DIANE', 'DISCO', 'ENDIF', 'MINUS', 'MILAN', 'SHADE', 'DIGIT', 'LIONS', 'POOLS', 'LYRIC',
  'GRAVE', 'HOWTO', 'DEVON', 'SAVES', 'LOBBY', 'PUNCH', 'GOTTA', 'KARMA', 'BETTY', 'LUCAS',
  'MARDI', 'SHAKE', 'HOLLY', 'SILLY', 'MERCY', 'FENCE', 'DIANA', 'SHAME', 'FATAL', 'FLESH',
  'JESSE', 'SHEER', 'WITCH', 'COHEN', 'PUPPY', 'KATHY', 'SMELL', 'SATIN', 'PROMO', 'TUNES',
  'LUCIA', 'NERVE', 'RENEW', 'LOCKS', 'EUROS', 'REBEL', 'HIRED', 'HINDU', 'KILLS', 'SLOPE',
  'NAILS', 'WHATS', 'RIDES', 'REHAB', 'MERIT', 'DISKS', 'CONDO', 'FAIRY', 'SHAFT', 'CASIO',
  'KITTY', 'DRAIN', 'MONTE', 'FIRES', 'PANIC', 'LEONE', 'ONION', 'BEATS', 'MERRY', 'SCUBA',
  'VERDE', 'DRIED', 'DERBY', 'ANNIE', 'DEREK', 'STEAL', 'FEARS', 'TUNER', 'ALIKE', 'SAGEM',
  'SCOUT', 'DEALT', 'BUCKS', 'BADGE', 'WRIST', 'HEATH', 'LEXUS', 'REALM', 'JENNY', 'BUSES',
  'ROUGE', 'YEAST', 'KENNY', 'YUKON', 'SINGH', 'BROOK', 'WIVES', 'XEROX', 'SORTS', 'VSNET',
  'PAPUA', 'ARMOR', 'VIRAL', 'PIPES', 'LADEN', 'ARUBA', 'MERGE', 'EDGAR', 'DUBAI', 'ALLAN',
  'SPERM', 'FILME', 'CRAPS', 'FROST', 'SALLY', 'YACHT', 'TRACY', 'WHALE', 'SHARK', 'GROWS',
  'CLIFF', 'TRACT', 'SHINE', 'WENDY', 'DIFFS', 'OZONE', 'PASTA', 'SERUM', 'SWIFT', 'INBOX',
  'FOCAL', 'SAMBA', 'WOUND', 'BELLE', 'CINDY', 'LINED', 'BOXED', 'CUBIC', 'SPIES', 'ELECT',
  'BUNNY', 'CHEVY', 'TIONS', 'FLYER', 'BATHS', 'EMACS', 'CLIMB', 'SPARC', 'DOVER', 'TOKEN',
  'KINDA', 'DYLAN', 'BELTS', 'BURKE', 'CLARA', 'FLUSH', 'HAYES', 'MOSES', 'JOHNS', 'JEWEL',
  'TEDDY', 'DRYER', 'RULED', 'FUNKY', 'JOINS', 'SCARY', 'MPEGS', 'CAKES', 'MIXER', 'SBJCT',
  'TOOTH', 'STAYS', 'DROVE', 'UPSET', 'MINES', 'LOGAN', 'LANCE', 'COLON', 'LANES', 'PURSE',
  'ALIGN', 'BLESS', 'CREST', 'ALLOY', 'PLOTS', 'TULSA', 'CASEY', 'DRAWS', 'BLOOM', 'LOOPS',
  'SURGE', 'TAHOE', 'SOULS', 'SPANK', 'VAULT', 'WIRES', 'MAILS', 'BLAKE', 'ORBIT', 'BACON',
  'PAXIL', 'SPINE', 'TROUT', 'APNIC', 'FATTY', 'JOYCE', 'MARCO', 'ISAAC', 'OXIDE', 'BADLY',
  'SCOOP', 'SANYO', 'BLINK', 'CARLO', 'TILES', 'TAMIL', 'FUZZY', 'GRAMS', 'FORGE', 'DENSE',
  'BRAVE', 'AWFUL', 'MEYER', 'WAGON', 'KNOCK', 'PEERS', 'QUILT', 'NOTRE', 'MAMBO', 'FLOUR',
  'CHOIR', 'BLOND', 'BURST', 'WILEY', 'FIBRE', 'DAISY', 'CRUDE', 'BORED', 'ALLAH', 'FARES',
  'HOPED', 'SAFER', 'MARSH', 'RICKY', 'THETA', 'STAKE', 'ARBOR'
];

// Medium words - less common, moderate difficulty
const mediumWords = [
  'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AGENT', 'AGREE', 'AHEAD',
  'ALARM', 'ALBUM', 'ALERT', 'ALIGN', 'ALIKE', 'ALIVE', 'ALONE', 'ALONG', 'ALTER', 'AMONG',
  'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE',
  'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC',
  'BASIS', 'BEGAN', 'BEGIN', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLAME', 'BLIND', 'BLOCK',
  'BLOOD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BREAK', 'BREED', 'BRIEF', 'BROAD',
  'BROKE', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHART',
  'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS',
  'CLICK', 'COACH', 'COAST', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM',
  'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CYCLE', 'DATED', 'DEALT', 'DEATH', 'DEBUT',
  'DELAY', 'DEPTH', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DRESS', 'DRILL',
  'DRIVE', 'DROVE', 'DYING', 'EAGER', 'ELITE', 'ENEMY', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT',
  'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIFTH', 'FIFTY', 'FIGHT',
  'FINAL', 'FIXED', 'FLASH', 'FLEET', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM',
  'FRAME', 'FRANK', 'FRAUD', 'FULLY', 'GIANT', 'GLOBE', 'GRACE', 'GRADE', 'GRANT', 'GROSS',
  'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HARRY', 'HENCE', 'HENRY', 'IDEAL', 'IMAGE',
  'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN',
  'LABEL', 'LASER', 'LAYER', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LEWIS',
  'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LYING', 'MAJOR',
  'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT',
  'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MORAL', 'MOTOR', 'MOUNT', 'NEWLY', 'NOISE', 'NORTH',
  'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OFFER', 'ORDER', 'OUGHT', 'PANEL', 'PETER', 'PHASE',
  'PHOTO', 'PIECE', 'PILOT', 'PITCH', 'PLAIN', 'PLANE', 'PLATE', 'POUND', 'PRESS', 'PRICE',
  'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUITE', 'RAISE',
  'RANGE', 'RAPID', 'RATIO', 'REACH', 'REFER', 'RIVAL', 'ROBIN', 'ROGER', 'ROMAN', 'ROUGH',
  'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SHALL',
  'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHOCK', 'SHOOT', 'SHOWN',
  'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLIDE', 'SMART', 'SMITH', 'SMOKE', 'SOLID',
  'SOLVE', 'SORRY', 'SPARE', 'SPEED', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE',
  'STAKE', 'STATE', 'STEAM', 'STEEL', 'STICK', 'STILL', 'STOCK', 'STOOD', 'STORM', 'STRIP',
  'STUCK', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'TAKEN', 'TASTE', 'TAXES', 'TEACH',
  'TEETH', 'TERRY', 'TEXAS', 'THEFT', 'THEME', 'THICK', 'THIRD', 'THOSE', 'THREW', 'THROW',
  'TIGHT', 'TIMES', 'TITLE', 'TOPIC', 'TOTAL', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TREAT',
  'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TROOP', 'TRUCK', 'TRULY', 'TRUNK',
  'TRUST', 'TRUTH', 'TWICE', 'UNDUE', 'UNION', 'UNITY', 'UPPER', 'UPSET', 'URBAN', 'USAGE',
  'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VITAL', 'VOCAL', 'WASTE', 'WHEEL', 'WHOSE',
  'WOMEN', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOUND', 'WROTE', 'YIELD'
];

// Hard words - uncommon, challenging words with tricky letter patterns
const hardWords = [
  'ABYSS', 'AFFIX', 'ASKEW', 'AXIOM', 'AZURE', 'BLITZ', 'BOGGY', 'BOXED', 'BUZZY', 'CRYPT',
  'CURVY', 'CYNIC', 'DIZZY', 'DWARF', 'EPOXY', 'EQUIP', 'FJORD', 'FIZZY', 'FLUNG', 'FOXED',
  'FUZZY', 'GLYPH', 'GNOME', 'GYPSY', 'HAIKU', 'HYPER', 'ICILY', 'IVORY', 'JAZZY', 'JIFFY',
  'JUMBO', 'KAYAK', 'KAZOO', 'KIOSK', 'KNACK', 'LYMPH', 'NYMPH', 'ONYX', 'OVARY', 'OXIDE',
  'OZONE', 'PIXEL', 'PLAZA', 'PROXY', 'PSALM', 'PUPPY', 'QUACK', 'QUALM', 'QUART', 'QUASH',
  'QUASI', 'QUERY', 'QUEST', 'QUEUE', 'QUIRK', 'QUOTA', 'QUOTE', 'ROGUE', 'RUSTY', 'SASSY',
  'SAVVY', 'SOAPY', 'SQUAD', 'SQUAT', 'SWAMP', 'SWIFT', 'SWUNG', 'SYNOD', 'TOPAZ', 'TOXIC',
  'TRYST', 'TWEED', 'TWIXT', 'UNIFY', 'USURP', 'VAGUE', 'VALVE', 'VAPID', 'VAULT', 'VENOM',
  'VERGE', 'VIGOR', 'VIPER', 'VIVID', 'VIXEN', 'VODKA', 'VOGUE', 'VOUCH', 'VOWEL', 'WALTZ',
  'WHACK', 'WHARF', 'WHEAT', 'WHELP', 'WHIFF', 'WHISK', 'WIMPY', 'WOOZY', 'WRACK', 'WRATH',
  'WRECK', 'WRIST', 'XEROX', 'YACHT', 'YEARN', 'YEAST', 'ZESTY', 'ZILCH', 'ZINGY', 'ZIPPY',
  'ZONAL', 'ZONED', 'ZOOMS'
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    console.error('Please set MONGODB_URI and MONGODB_DB in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('words');

    // Clear existing words
    await collection.deleteMany({});
    console.log('Cleared existing words');

    // Insert words with difficulty levels
    const wordDocuments = [
      ...easyWords.map(word => ({
        word: word.toUpperCase(),
        difficulty: 'easy',
        createdAt: new Date()
      })),
      ...mediumWords.map(word => ({
        word: word.toUpperCase(),
        difficulty: 'medium',
        createdAt: new Date()
      })),
      ...hardWords.map(word => ({
        word: word.toUpperCase(),
        difficulty: 'hard',
        createdAt: new Date()
      }))
    ];

    const result = await collection.insertMany(wordDocuments);
    console.log(`Inserted ${result.insertedCount} words`);

    // Create indexes
    await collection.createIndex({ word: 1 });
    await collection.createIndex({ difficulty: 1 });
    console.log('Created indexes on word and difficulty fields');

    // Show statistics
    const easyCount = await collection.countDocuments({ difficulty: 'easy' });
    const mediumCount = await collection.countDocuments({ difficulty: 'medium' });
    const hardCount = await collection.countDocuments({ difficulty: 'hard' });
    
    console.log('\nDatabase seeded successfully!');
    console.log(`Easy words: ${easyCount}`);
    console.log(`Medium words: ${mediumCount}`);
    console.log(`Hard words: ${hardCount}`);
    console.log(`Total words: ${result.insertedCount}`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
