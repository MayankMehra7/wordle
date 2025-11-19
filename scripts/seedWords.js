const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

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
  'CLICK', 'PRICE', 'STATE', 'EMAIL', 'BOOKS', 'LINKS', 'YEARS', 'ORDER', 'ITEMS', 'GAMES',
  'HOTEL', 'TERMS', 'LOCAL', 'THOSE', 'USING', 'FORUM', 'BASED', 'CHECK', 'INDEX', 'WOMEN',
  'TODAY', 'SOUTH', 'PAGES', 'PHOTO', 'WHILE', 'TOTAL', 'NORTH', 'POSTS', 'MEDIA', 'SINCE',
  'GUIDE', 'WHITE', 'TIMES', 'SITES', 'LEVEL', 'HOURS', 'IMAGE', 'TITLE', 'SHALL', 'CLASS',
  'STILL', 'EVERY', 'TOOLS', 'REPLY', 'VALUE', 'PRESS', 'PRINT', 'STOCK', 'SALES', 'MODEL',
  'MARCH', 'YAHOO', 'STAFF', 'APRIL', 'USERS', 'TOPIC', 'BELOW', 'LOGIN', 'LEGAL', 'ABOVE',
  'QUOTE', 'RATES', 'FIELD', 'GIRLS', 'TEXAS', 'POKER', 'ISSUE', 'RANGE', 'COURT', 'AUDIO',
  'OFFER', 'FILES', 'EVENT', 'NEEDS', 'MIGHT', 'MAJOR', 'AREAS', 'CARDS', 'SHARE', 'ADDED',
  'UNTIL', 'COLOR', 'TRACK', 'LEAST', 'TRADE', 'DAVID', 'DRIVE', 'MEANS', 'BEACH', 'COSTS',
  'STYLE', 'PARTS', 'EARLY', 'MILES', 'WORKS', 'RULES', 'FINAL', 'ADULT', 'CHEAP', 'THIRD',
  'GIFTS', 'COVER', 'WATCH', 'DEALS', 'WORDS', 'LINUX', 'JAMES', 'ERROR', 'MAKES', 'TAKEN',
  'KNOWN', 'CASES', 'WHOLE', 'SHOWS', 'ALONG', 'AMONG', 'DEATH', 'SPEED', 'BRAND', 'STUFF',
  'LOANS', 'SHOES', 'ENTRY', 'NOTES', 'FORCE', 'ALBUM', 'VIEWS', 'PLANS', 'TYPES', 'LINES',
  'APPLY', 'ASKED', 'CROSS', 'WEEKS', 'LOWER', 'UNION', 'NAMES', 'LEAVE', 'TEENS', 'CABLE',
  'SCORE', 'SHOWN', 'FLASH', 'IDEAS', 'HOMES', 'SUPER', 'ASIAN', 'CAUSE', 'FOCUS', 'ROOMS',
  'COMES', 'BROWN', 'FORMS', 'HAPPY', 'SMITH', 'PRIOR', 'SPORT', 'ROUND', 'BUILT', 'BLOOD',
  'NOKIA', 'BASIS', 'AWARD', 'PETER', 'EXTRA', 'RATED', 'QUITE', 'STARS', 'LISTS', 'OWNER',
  'TAKES', 'INPUT', 'AGENT', 'VALID', 'GRAND', 'TRIAL', 'UNITS', 'WROTE', 'SHIPS', 'METAL',
  'FUNDS', 'GUEST', 'SEEMS', 'TRUST', 'MULTI', 'GRADE', 'PANEL', 'FLOOR', 'MATCH', 'SENSE',
  'STAGE', 'GOODS', 'MAYBE', 'BREAK', 'ENJOY', 'BLOCK', 'CIVIL', 'STEEL', 'SONGS', 'FIXED',
  'HANDS', 'PARIS', 'FULLY', 'WORTH', 'COAST', 'GRANT', 'AGREE', 'BLOGS', 'SCALE', 'FRAME',
  'CHIEF', 'GIVES', 'HEARD', 'BEGIN', 'ROYAL', 'BIBLE', 'SUITE', 'VEGAS', 'CHRIS', 'PIECE',
  'SHEET', 'OLDER', 'CELLS', 'LOOKS', 'CALLS', 'WHOSE', 'NAKED', 'LIVES', 'TESTS', 'BUYER',
  'STEVE', 'LABEL', 'SCOTT', 'CANON', 'WASTE', 'PHASE', 'MOTOR', 'CRIME', 'COUNT', 'CLAIM',
  'PATCH', 'SANTA', 'ALONE', 'JONES', 'SAINT', 'DRUGS', 'JOINT', 'DATES', 'UPPER', 'PRIME',
  'LIMIT', 'BEGAN', 'LOUIS', 'STEPS', 'SHOPS', 'CREEK', 'URBAN', 'TOURS', 'LABOR', 'ADMIN',
  'SOLID', 'THEME', 'TOUCH', 'GOALS', 'SERVE', 'MOUNT', 'SMART', 'LATIN', 'AVOID', 'BIRTH',
  'VIRUS', 'ABUSE', 'FACTS', 'FAITH', 'CHAIN', 'MOVED', 'REACH', 'SORRY', 'GAMMA', 'TRUTH',
  'FILMS', 'OWNED', 'DRAFT', 'CHART', 'JESUS', 'CLUBS', 'EQUAL', 'CODES', 'KINDS', 'TEAMS',
  'TRIED', 'NAMED', 'LASER', 'HARRY', 'TAXES', 'BRAIN', 'FALSE', 'FALLS', 'STATS', 'CARRY',
  'HELLO', 'CLIPS', 'BRIEF', 'ENDED', 'EIGHT', 'WANTS', 'ALERT', 'SWEET', 'DIEGO', 'TRUCK',
  'VOTES', 'SIGNS', 'DEPTH', 'FEEDS', 'ROUTE', 'FRANK', 'ANIME', 'SPEAK', 'QUERY', 'RURAL',
  'JUDGE', 'BYTES', 'FIGHT', 'FILED', 'KOREA', 'BANKS', 'KELLY', 'LEADS', 'BRIAN', 'MIAMI',
  'WALES', 'MINOR', 'NOTED', 'SPENT', 'DAVIS', 'HELPS', 'CYCLE', 'SCENE', 'INTEL', 'RINGS',
  'HENRY', 'GUESS', 'AHEAD', 'DEVEL', 'DELTA', 'CISCO', 'ALPHA', 'BONUS', 'ADOBE', 'TREES',
  'DRESS', 'REFER', 'BABES', 'LAYER', 'CLOCK', 'RATIO', 'PROOF', 'MAINE', 'IDEAL', 'SPECS',
  'PARKS', 'CREAM', 'BOXES', 'HILLS', 'AWARE', 'IRISH', 'FIRMS', 'USAGE', 'MIXED', 'EXIST',
  'WHEEL', 'ANGEL', 'WIDTH', 'NOISE', 'ARRAY', 'GREEK', 'SHARP', 'OCCUR', 'KNOWS', 'COACH',
  'KEVIN', 'PLATE', 'LOGIC', 'SIZES', 'PLAIN', 'COSTA', 'TRAIL', 'BUDDY', 'SETUP', 'BLUES',
  'SCOPE', 'CRAZY', 'BEARS', 'METER', 'MYSQL', 'LEWIS', 'SUGAR', 'STICK', 'ALLEN', 'GENRE',
  'SLIDE', 'EXACT', 'BOUND', 'STORM', 'MICRO', 'DOLLS', 'DELAY', 'PILOT', 'CZECH', 'NOVEL',
  'ULTRA', 'IDAHO', 'PLAYS', 'TRULY', 'LODGE', 'BROAD', 'SWISS', 'SARAH', 'CLARK', 'FOODS',
  'GUARD', 'NEWLY', 'RAISE', 'DRAMA', 'BANDS', 'AUDIT', 'POLLS', 'TOWER', 'YOURS', 'JASON',
  'SHELL', 'SOLAR', 'CATCH', 'DOUBT', 'TASKS', 'CONST', 'DOORS', 'FORTH', 'BRUCE', 'SPLIT',
  'TWICE', 'SHIFT', 'SIMON', 'MARKS', 'LOVED', 'BIRDS', 'SAVED', 'SHOTS', 'MOORE', 'TREAT',
  'PIANO', 'RISKS', 'PORTS', 'TEACH', 'RAPID', 'HAIRY', 'DUTCH', 'BOOTS', 'HOLDS', 'PULSE',
  'METRO', 'STRIP', 'PEARL', 'HEADS', 'LOGOS', 'HONDA', 'BILLS', 'OPERA', 'ASSET', 'BLANK',
  'HUMOR', 'LIVED', 'TIGHT', 'MEANT', 'PLANE', 'MEETS', 'TAMPA', 'GRACE', 'SUSAN', 'ADAMS',
  'VILLA', 'INNER', 'ROMAN', 'TASTE', 'TRIPS', 'SIDES', 'TURNS', 'CACHE', 'LEASE', 'PROUD',
  'GIANT', 'SEATS', 'ALARM', 'USUAL', 'ANGLE', 'VINYL', 'WORST', 'HONOR', 'EAGLE', 'PANTS',
  'NURSE', 'COMIC', 'CROWN', 'MAKER', 'CRACK', 'PICKS', 'SMOKE', 'CRAFT', 'APART', 'BLIND',
  'COINS', 'GROSS', 'EPSON', 'ACTOR', 'FINDS', 'FIFTH', 'PRIZE', 'DIRTY', 'WAYNE', 'ALIVE',
  'PROVE', 'WINGS', 'RIDGE', 'MODEM', 'LARRY', 'SKILL', 'MOVES', 'THROW', 'TREND', 'RHODE',
  'WORSE', 'BOATS', 'TELLS', 'FIBER', 'GRAPH', 'TALKS', 'BONDS', 'FRAUD', 'ROGER', 'CRASH',
  'INTER', 'GROVE', 'SPRAY', 'ROADS', 'FACES', 'MAYOR', 'YIELD', 'HENCE', 'RADAR', 'LAKES',
  'DIARY', 'KINGS', 'FLAGS', 'BAKER', 'SHOCK', 'WALLS', 'EBONY', 'DRAWN', 'BEAST', 'DODGE',
  'PIZZA', 'YARDS', 'WOODS', 'JOKES', 'TWIKI', 'GLOBE', 'DICKE', 'KERRY', 'GHOST', 'PRIDE',
  'KEITH', 'LINDA', 'MARIA', 'BRASS', 'PLAZA', 'QUEST', 'TRANS', 'BOOTY', 'ACRES', 'VENUE',
  'VITAL', 'EXCEL', 'MODES', 'ENEMY', 'WELLS', 'OPENS', 'LUCKY', 'THICK', 'IRAQI', 'VISTA',
  'CHIPS', 'TERRY', 'FLOOD', 'ARENA', 'GROWN', 'JERRY', 'LANDS', 'ARMED', 'LAURA', 'TOKYO',
  'NIKON', 'CANDY', 'PILLS', 'TIGER', 'FOLKS', 'BOOST', 'ICONS', 'MORAL', 'KEEPS', 'POUND',
  'ROSES', 'TOUGH', 'GONNA', 'CHEST', 'BILLY', 'CRAIG', 'SOLVE', 'NANCY', 'TONES', 'SIGHT',
  'TOWNS', 'WORRY', 'READS', 'ROLES', 'GLORY', 'SAUDI', 'FAULT', 'KAREN', 'JIMMY', 'RUGBY',
  'FLUID', 'BARRY', 'DEVIL', 'MARIE', 'SIZED', 'MANGA', 'THEFT', 'SWING', 'DATED', 'SHOOT',
  'ELITE', 'POEMS', 'ROBOT', 'WINDS', 'GNOME', 'ROOTS', 'NOBLE', 'SHORE', 'LOVES', 'LOOSE',
  'SLOTS', 'ROCKS', 'GENES', 'HOSTS', 'ATLAS', 'FEELS', 'RALPH', 'CORPS', 'LIVER', 'DECOR',
  'TEXTS', 'EVANS', 'FAILS', 'AGING', 'ALICE', 'INTRO', 'CLERK', 'MILLS', 'JEANS', 'FONTS',
  'FAVOR', 'SIGMA', 'XHTML', 'ASIDE', 'ESSAY', 'CAMPS', 'AARON', 'TRACE', 'PACKS', 'SPOKE',
  'ARROW', 'ROUGH', 'WEIRD', 'HOLES', 'BLADE', 'MEALS', 'ROBIN', 'STRAP', 'CROWD', 'CLOUD',
  'VALVE', 'KNIFE', 'SHELF', 'LIKED', 'ADOPT', 'FOTOS', 'OUTER', 'TALES', 'ISLAM', 'NODES',
  'SEEDS', 'CITED', 'SKYPE', 'TIRED', 'STEAM', 'ACUTE', 'STOOD', 'CAROL', 'STACK', 'CURVE',
  'AMBER', 'TRUNK', 'WAVES', 'CAMEL', 'LAMPS', 'JUICE', 'CHASE', 'SAUCE', 'BEADS', 'FLOWS',
  'FEWER', 'PROXY', 'LANKA', 'VOTED', 'BIKES', 'GATES', 'SLAVE', 'LYCOS', 'ZDNET', 'COMBO',
  'HAVEN', 'CHARM', 'BASIN', 'RANCH', 'DRUNK', 'TONER', 'LATEX', 'DELHI', 'ALIEN', 'BROKE',
  'NYLON', 'DISCS', 'ROCKY', 'FLEET', 'BUNCH', 'CENTS', 'OMEGA', 'CIVIC', 'SAVER', 'GRILL',
  'GRAIN', 'WANNA', 'SEEKS', 'GAINS', 'SPOTS', 'SALON', 'TURBO', 'THATS', 'AIMED', 'RESET',
  'BRUSH', 'SPARE', 'KODAK', 'SKIRT', 'HONEY', 'GAUGE', 'FACED', 'SIXTH', 'FARMS', 'CHEAT',
  'SANDY', 'MACRO', 'PITCH', 'AUTOS', 'PERRY', 'DOZEN', 'TEETH', 'CLOTH', 'STAMP', 'LOTUS',
  'CARGO', 'SALEM', 'LIKES', 'TAPES', 'ZONES', 'RACES', 'MAPLE', 'DEPOT', 'BLEND', 'JULIE',
  'JANET', 'PHPBB', 'PROBE', 'HELEN', 'LOPEZ', 'DEBUG', 'CHUCK', 'EBOOK', 'BINGO', 'MINDS',
  'XANAX', 'SUNNY', 'LEEDS', 'CEDAR', 'BLAIR', 'HOPES', 'MASON', 'BURNS', 'PUMPS', 'MARIO',
  'UTILS', 'PAIRS', 'CHOSE', 'BLAST', 'TOMMY', 'BRAKE', 'OLIVE', 'CYBER', 'CLONE', 'RELAY',
  'TEARS', 'OASIS', 'ANGRY', 'LOVER', 'ROLLS', 'DADDY', 'FERRY', 'OMAHA', 'LOADS', 'MOTEL',
  'RALLY', 'DYING', 'STUCK', 'STOPS', 'VOCAL', 'ORGAN', 'LEMON', 'TOXIC', 'BENCH', 'RIDER',
  'BUTTS', 'BOBBY', 'SHEEP', 'WINES', 'SALAD', 'PASTE', 'KATIE', 'RELAX', 'SWORD', 'SELLS',
  'CORAL', 'PIXEL', 'FLOAT', 'COLIN', 'PATHS', 'ACIDS', 'DAIRY', 'ADMIT', 'FANCY', 'SQUAD',
  'WAGES', 'MALES', 'CHAOS', 'WHEAT', 'BASES', 'UNITY', 'BRIDE', 'BEGUN', 'SOCKS', 'ESSEX',
  'FEVER', 'DRUMS', 'ROVER', 'FLAME', 'TANKS', 'SPELL', 'EMILY', 'ANNEX', 'HINTS', 'WIRED',
  'ELVIS', 'ARGUE', 'ARISE', 'JAMIE', 'CHESS', 'OSCAR', 'MENUS', 'CANAL', 'AMINO', 'HERBS',
  'LYING', 'DRILL', 'BRYAN', 'HOBBY', 'TRIES', 'TRICK', 'MYERS', 'DROPS', 'WIDER', 'SCREW',
  'BLAME', 'FIFTY', 'UNCLE', 'JACOB', 'RANDY', 'BRICK', 'NAVAL', 'DONNA', 'CABIN', 'EDDIE',
  'FIRED', 'PERTH', 'KLEIN', 'TIRES', 'RETRO', 'ANGER', 'SUITS', 'GLENN', 'HANDY', 'CROPS',
  'GUILD', 'TRIBE', 'BATCH', 'ALTER', 'EDGES', 'TWINS', 'AMEND', 'CHICK', 'THONG', 'MEDAL',
  'WALKS', 'BOOTH', 'INDIE', 'BONES', 'BREED', 'POLAR', 'MSGID', 'CAREY', 'DANNY', 'PATIO',
  'LLOYD', 'BEANS', 'ELLIS', 'SNAKE', 'JULIA', 'BERRY', 'OUGHT', 'FIXES', 'SENDS', 'MAZDA',
  'TIMER', 'TYLER', 'VERSE', 'HIGHS', 'ELLEN', 'RACKS', 'NASTY', 'TUMOR', 'WATTS', 'FORTY',
  'TUBES', 'FLOYD', 'QUEUE', 'SKINS', 'EXAMS', 'WELSH', 'BELLY', 'ELDER', 'SONIC', 'THUMB',
  'TWIST', 'RANKS', 'DEBUT', 'VOLVO', 'PENNY', 'IVORY', 'REMIX', 'ALIAS', 'NEWER', 'SPICE',
  'ASCII', 'DONOR', 'TRASH', 'MANOR', 'DIANE', 'DISCO', 'ENDIF', 'MINUS', 'MILAN', 'SHADE',
  'DIGIT', 'LIONS', 'POOLS', 'LYRIC', 'GRAVE', 'HOWTO', 'DEVON', 'SAVES', 'LOBBY', 'PUNCH',
  'GOTTA', 'KARMA', 'BETTY', 'LUCAS', 'MARDI', 'SHAKE', 'HOLLY', 'SILLY', 'MERCY', 'FENCE',
  'DIANA', 'SHAME', 'FATAL', 'FLESH', 'JESSE', 'SHEER', 'WITCH', 'COHEN', 'PUPPY', 'KATHY',
  'SMELL', 'SATIN', 'PROMO', 'TUNES', 'LUCIA', 'NERVE', 'RENEW', 'LOCKS', 'EUROS', 'REBEL',
  'HIRED', 'HINDU', 'KILLS', 'SLOPE', 'NAILS', 'WHATS', 'RIDES', 'REHAB', 'MERIT', 'DISKS',
  'CONDO', 'FAIRY', 'SHAFT', 'CASIO', 'KITTY', 'DRAIN', 'MONTE', 'FIRES', 'PANIC', 'LEONE',
  'ONION', 'BEATS', 'MERRY', 'SCUBA', 'VERDE', 'DRIED', 'DERBY', 'ANNIE', 'DEREK', 'STEAL',
  'FEARS', 'TUNER', 'ALIKE', 'SAGEM', 'SCOUT', 'DEALT', 'BUCKS', 'BADGE', 'WRIST', 'HEATH',
  'LEXUS', 'REALM', 'JENNY', 'BUSES', 'ROUGE', 'YEAST', 'KENNY', 'YUKON', 'SINGH', 'BROOK',
  'WIVES', 'XEROX', 'SORTS', 'VSNET', 'PAPUA', 'ARMOR', 'VIRAL', 'PIPES', 'LADEN', 'ARUBA',
  'MERGE', 'EDGAR', 'DUBAI', 'ALLAN', 'SPERM', 'FILME', 'CRAPS', 'FROST', 'SALLY', 'YACHT',
  'TRACY', 'WHALE', 'SHARK', 'GROWS', 'CLIFF', 'TRACT', 'SHINE', 'WENDY', 'DIFFS', 'OZONE',
  'PASTA', 'SERUM', 'SWIFT', 'INBOX', 'FOCAL', 'SAMBA', 'WOUND', 'BELLE', 'CINDY', 'LINED',
  'BOXED', 'CUBIC', 'SPIES', 'ELECT', 'BUNNY', 'CHEVY', 'TIONS', 'FLYER', 'BATHS', 'EMACS',
  'CLIMB', 'SPARC', 'DOVER', 'TOKEN', 'KINDA', 'DYLAN', 'BELTS', 'BURKE', 'CLARA', 'FLUSH',
  'HAYES', 'MOSES', 'JOHNS', 'JEWEL', 'TEDDY', 'DRYER', 'RULED', 'FUNKY', 'JOINS', 'SCARY',
  'MPEGS', 'CAKES', 'MIXER', 'SBJCT', 'TOOTH', 'STAYS', 'DROVE', 'UPSET', 'MINES', 'LOGAN',
  'LANCE', 'COLON', 'LANES', 'PURSE', 'ALIGN', 'BLESS', 'CREST', 'ALLOY', 'PLOTS', 'TULSA',
  'CASEY', 'DRAWS', 'BLOOM', 'LOOPS', 'SURGE', 'TAHOE', 'SOULS', 'SPANK', 'VAULT', 'WIRES',
  'MAILS', 'BLAKE', 'ORBIT', 'BACON', 'PAXIL', 'SPINE', 'TROUT', 'APNIC', 'FATTY', 'JOYCE',
  'MARCO', 'ISAAC', 'OXIDE', 'BADLY', 'SCOOP', 'SANYO', 'BLINK', 'CARLO', 'TILES', 'TAMIL',
  'FUZZY', 'GRAMS', 'FORGE', 'DENSE', 'BRAVE', 'AWFUL', 'MEYER', 'WAGON', 'KNOCK', 'PEERS',
  'QUILT', 'NOTRE', 'MAMBO', 'FLOUR', 'CHOIR', 'BLOND', 'BURST', 'WILEY', 'FIBRE', 'DAISY',
  'CRUDE', 'BORED', 'ALLAH', 'FARES', 'HOPED', 'SAFER', 'MARSH', 'RICKY', 'THETA', 'STAKE',
  'ARBOR'
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

const allWords = [...easyWords, ...mediumWords, ...hardWords];

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
