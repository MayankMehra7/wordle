const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Additional words from user
const additionalWords = ["about","other","which","their","there","first","would","these","click","price","state","email","world","music","after","video","where","books","links","years","order","items","group","under","games","could","great","hotel","store","terms","right","local","those","using","phone","forum","based","black","check","index","being","women","today","south","pages","found","house","photo","power","while","three","total","place","think","north","posts","media","water","since","guide","board","white","small","times","sites","level","hours","image","title","shall","class","still","money","every","visit","tools","reply","value","press","learn","print","stock","point","sales","large","table","start","model","human","movie","march","yahoo","going","study","staff","again","april","never","users","topic","below","party","login","legal","above","quote","story","rates","young","field","paper","girls","night","texas","poker","issue","range","court","audio","light","write","offer","given","files","event","needs","might","month","major","areas","space","cards","child","enter","share","added","radio","until","color","track","least","trade","david","green","close","drive","short","means","daily","beach","costs","style","front","parts","early","miles","sound","works","rules","final","adult","thing","cheap","third","gifts","cover","often","watch","deals","words","linux","james","heart","error","clear","makes","taken","known","cases","quick","whole","later","basic","shows","along","among","death","speed","brand","stuff","doing","loans","shoes","entry","notes","force","river","album","views","plans","build","types","lines","apply","asked","cross","weeks","lower","union","names","leave","teens","woman","cable","score","shown","flash","ideas","allow","homes","super","asian","cause","focus","rooms","voice","comes","brown","forms","glass","happy","smith","thank","prior","sport","ready","round","built","blood","earth","nokia","basis","award","peter","extra","rated","quite","horse","stars","lists","owner","takes","bring","input","agent","valid","grand","trial","units","wrote","ships","metal","funds","guest","seems","trust","multi","grade","panel","floor","match","plant","sense","stage","goods","maybe","youth","break","dance","apple","enjoy","block","civil","steel","songs","fixed","wrong","hands","paris","fully","worth","peace","coast","grant","agree","blogs","scale","stand","frame","chief","gives","heard","begin","royal","clean","bible","suite","vegas","chris","piece","sheet","seven","older","cells","looks","calls","whose","naked","lives","stone","tests","buyer","steve","label","scott","canon","waste","chair","phase","motor","shirt","crime","count","claim","patch","santa","alone","jones","saint","drugs","joint","fresh","dates","upper","prime","limit","began","louis","steps","shops","creek","urban","tours","labor","admin","heavy","solid","theme","touch","goals","serve","magic","mount","smart","latin","avoid","birth","virus","abuse","facts","faith","chain","moved","reach","sorry","gamma","truth","films","owned","draft","chart","jesus","clubs","equal","codes","kinds","teams","funny","tried","named","laser","harry","taxes","mouse","brain","dream","false","falls","stats","carry","hello","clips","brief","ended","eight","wants","alert","queen","sweet","diego","truck","votes","ocean","signs","depth","train","feeds","route","frank","anime","speak","query","rural","judge","bytes","fight","filed","korea","banks","kelly","leads","brian","miami","wales","minor","noted","spent","davis","helps","cycle","sleep","scene","drink","intel","rings","henry","guess","ahead","devel","delta","cisco","alpha","bonus","adobe","trees","dress","refer","babes","layer","spend","clock","ratio","proof","empty","maine","ideal","specs","parks","cream","boxes","hills","aware","shape","irish","firms","usage","mixed","exist","wheel","angel","width","noise","array","greek","sharp","occur","knows","coach","kevin","plate","logic","sizes","plain","costa","trail","buddy","setup","blues","scope","crazy","bears","mouth","meter","fruit","mysql","lewis","sugar","stick","allen","genre","slide","exact","bound","storm","micro","dolls","paint","delay","pilot","czech","novel","ultra","idaho","plays","truly","lodge","broad","swiss","sarah","clark","foods","guard","newly","raise","drama","bands","lunch","audit","polls","tower","yours","jason","shell","solar","catch","doubt","tasks","const","doors","forth","bruce","split","twice","shift","simon","marks","loved","birds","saved","shots","moore","treat","piano","risks","ports","teach","rapid","hairy","dutch","boots","holds","pulse","metro","strip","pearl","heads","logos","honda","bills","opera","asset","blank","humor","lived","tight","meant","plane","meets","tampa","grace","susan","adams","villa","inner","roman","taste","trips","sides","turns","cache","lease","proud","giant","seats","alarm","usual","angle","vinyl","worst","honor","eagle","pants","nurse","quiet","comic","crown","maker","crack","picks","smoke","craft","apart","blind","coins","gross","epson","actor","finds","fifth","prize","dirty","wayne","alive","prove","wings","ridge","modem","larry","skill","moves","throw","trend","rhode","worse","boats","tells","fiber","graph","talks","bonds","fraud","roger","crash","inter","grove","spray","roads","faces","mayor","yield","hence","radar","lakes","diary","kings","flags","baker","shock","walls","ebony","drawn","beast","dodge","pizza","yards","woods","jokes","twiki","globe","dicke","kerry","ghost","pride","keith","linda","maria","brass","plaza","quest","trans","booty","acres","venue","vital","excel","modes","enemy","wells","opens","lucky","thick","iraqi","vista","chips","terry","flood","arena","grown","jerry","smile","lands","armed","laura","tokyo","nikon","candy","pills","tiger","folks","boost","icons","moral","keeps","pound","roses","bread","tough","gonna","chest","billy","craig","solve","nancy","tones","sight","towns","worry","reads","roles","glory","saudi","fault","karen","jimmy","rugby","fluid","barry","devil","grass","marie","sized","manga","theft","swing","dated","shoot","elite","poems","robot","winds","gnome","roots","noble","shore","loves","loose","slots","rocks","genes","hosts","atlas","feels","ralph","corps","liver","decor","texts","evans","fails","aging","alice","intro","clerk","mills","jeans","fonts","favor","sigma","xhtml","aside","essay","camps","aaron","trace","packs","spoke","arrow","rough","weird","holes","blade","meals","robin","strap","crowd","cloud","valve","knife","shelf","liked","adopt","fotos","outer","tales","islam","nodes","seeds","cited","skype","tired","steam","acute","stood","carol","stack","curve","amber","trunk","waves","camel","lamps","juice","chase","sauce","beads","flows","fewer","proxy","lanka","voted","bikes","gates","slave","lycos","zdnet","combo","haven","charm","basin","ranch","drunk","toner","latex","delhi","alien","broke","nylon","discs","rocky","fleet","bunch","cents","omega","civic","saver","grill","grain","wanna","seeks","gains","spots","salon","turbo","thats","aimed","reset","brush","spare","kodak","skirt","honey","gauge","faced","sixth","farms","cheat","sandy","macro","laugh","pitch","autos","perry","dozen","teeth","cloth","stamp","lotus","cargo","salem","likes","tapes","zones","races","maple","depot","blend","julie","janet","phpbb","probe","helen","lopez","debug","chuck","ebook","bingo","minds","xanax","sunny","leeds","cedar","blair","hopes","mason","burns","pumps","mario","utils","pairs","chose","blast","tommy","brake","olive","cyber","clone","relay","tears","oasis","angry","lover","rolls","daddy","ferry","omaha","loads","motel","rally","dying","stuck","stops","vocal","organ","lemon","toxic","bench","rider","butts","bobby","sheep","wines","salad","paste","katie","relax","sword","sells","coral","pixel","float","colin","paths","acids","dairy","admit","fancy","squad","wages","males","chaos","wheat","bases","unity","bride","begun","socks","essex","fever","drums","rover","flame","tanks","spell","emily","annex","hints","wired","elvis","argue","arise","jamie","chess","oscar","menus","canal","amino","herbs","lying","drill","bryan","hobby","tries","trick","myers","drops","wider","screw","blame","fifty","uncle","jacob","randy","brick","naval","donna","cabin","eddie","fired","perth","klein","tires","retro","anger","suits","glenn","handy","crops","guild","tribe","batch","alter","edges","twins","amend","chick","thong","medal","walks","booth","indie","bones","breed","polar","msgid","carey","danny","patio","lloyd","beans","ellis","snake","julia","berry","ought","fixes","sends","mazda","timer","tyler","verse","highs","ellen","racks","nasty","tumor","watts","forty","tubes","floyd","queue","skins","exams","welsh","belly","elder","sonic","thumb","twist","ranks","debut","volvo","penny","ivory","remix","alias","newer","spice","ascii","donor","trash","manor","diane","disco","endif","minus","milan","shade","digit","lions","pools","lyric","grave","howto","devon","saves","lobby","punch","gotta","karma","betty","lucas","mardi","shake","holly","silly","mercy","fence","diana","shame","fatal","flesh","jesse","sheer","witch","cohen","puppy","kathy","smell","satin","promo","tunes","lucia","nerve","renew","locks","euros","rebel","hired","hindu","kills","slope","nails","whats","rides","rehab","merit","disks","condo","fairy","shaft","casio","kitty","drain","monte","fires","panic","leone","onion","beats","merry","scuba","verde","dried","derby","annie","derek","steal","fears","tuner","alike","sagem","scout","dealt","bucks","badge","wrist","heath","lexus","realm","jenny","buses","rouge","yeast","kenny","yukon","singh","brook","wives","xerox","sorts","vsnet","papua","armor","viral","pipes","laden","aruba","merge","edgar","dubai","allan","sperm","filme","craps","frost","sally","yacht","tracy","whale","shark","grows","cliff","tract","shine","wendy","diffs","ozone","pasta","serum","swift","inbox","focal","samba","wound","belle","cindy","lined","boxed","cubic","spies","elect","bunny","chevy","tions","flyer","baths","emacs","climb","sparc","dover","token","kinda","dylan","belts","burke","clara","flush","hayes","moses","johns","jewel","teddy","dryer","ruled","funky","joins","scary","mpegs","cakes","mixer","sbjct","tooth","stays","drove","upset","mines","logan","lance","colon","lanes","purse","align","bless","crest","alloy","plots","tulsa","casey","draws","bloom","loops","surge","tahoe","souls","spank","vault","wires","mails","blake","orbit","bacon","paxil","spine","trout","apnic","fatty","joyce","marco","isaac","oxide","badly","scoop","sanyo","blink","carlo","tiles","tamil","fuzzy","grams","forge","dense","brave","awful","meyer","wagon","knock","peers","quilt","notre","mambo","flour","choir","blond","burst","wiley","fibre","daisy","crude","bored","allah","fares","hoped","safer","marsh","ricky","theta","stake","arbor"];

// Easy words - common, simple words
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
  'WHITE', 'WHOLE', 'WOMAN', 'WORLD', 'WOULD', 'WRITE', 'WRONG', 'YOUNG', 'YOUTH',
  ...additionalWords.map(w => w.toUpperCase())
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

// Remove duplicates
const uniqueEasy = [...new Set(easyWords)];
const uniqueMedium = [...new Set(mediumWords)];
const uniqueHard = [...new Set(hardWords)];

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
      ...uniqueEasy.map(word => ({
        word: word.toUpperCase(),
        difficulty: 'easy',
        createdAt: new Date()
      })),
      ...uniqueMedium.map(word => ({
        word: word.toUpperCase(),
        difficulty: 'medium',
        createdAt: new Date()
      })),
      ...uniqueHard.map(word => ({
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
