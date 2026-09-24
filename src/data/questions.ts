import { Question, ZoneConfig } from "@/types/game";

export const ZONE_CONFIGS: ZoneConfig[] = [
  {
    id: "mountains",
    title: "Mountains",
    rangeText: "1 – 3",
    startCheckpoint: 1,
    endCheckpoint: 3,
    description: "Vast natural elevations of the earth's surface with steep slopes, sharp peaks, and cold high altitudes.",
    lookFor: ["Snow-capped peaks", "Steep rocky cliffs", "Coniferous pine forests", "Glacial streams"],
    formation: "Formed by tectonic plate collisions folding the crust (e.g., Himalayas) or volcanic eruptions.",
    humanLife: "Settlements are sparse due to harsh climate, thin air, and rugged terrain. Houses often have steep sloping roofs.",
    occupations: "Terraced farming, sheep & yak rearing, tourism, forestry, and hydro-electric generation.",
    challenges: "Landslides, severe cold, difficult transport, and thin oxygen levels.",
    opportunities: "Abundant fresh water from glaciers, clean energy, timber, and medicinal alpine herbs.",
    color: "#0284c7"
  },
  {
    id: "valley",
    title: "Valley",
    rangeText: "4 – 6",
    startCheckpoint: 4,
    endCheckpoint: 6,
    description: "Low-lying stretches between hills or mountains, often carved by rivers (V-shaped) or glaciers (U-shaped).",
    lookFor: ["Sheltered floor", "Meandering stream", "Gentle lower slopes", "Dense vegetation"],
    formation: "Erosion caused by flowing mountain rivers over millions of years or glacial scouring.",
    humanLife: "More sheltered and warmer than high slopes, valleys naturally attract mountain towns and transit routes.",
    occupations: "Fruit orchards (apples, apricots), valley farming, river fishing, and market towns.",
    challenges: "Flash floods from mountain meltwater, fog traps, and limited horizontal expansion.",
    opportunities: "Natural transport corridors connecting mountain passes, fertile alluvial soil pockets.",
    color: "#059669"
  },
  {
    id: "plateau",
    title: "Plateau",
    rangeText: "7 – 9",
    startCheckpoint: 7,
    endCheckpoint: 9,
    description: "An elevated, relatively flat tableland rising abruptly above the surrounding landscape on one or more sides.",
    lookFor: ["Flat table-like top", "Steep cliff sides (escarpments)", "Deep gorges and waterfalls", "Rocky mineral soil"],
    formation: "Formed by ancient volcanic basalt lava flows (e.g., Deccan Plateau) or slow crustal uplift (Tibetan Plateau).",
    humanLife: "Moderate populations centered around rich mineral deposits, mining towns, and grazing commons.",
    occupations: "Mineral extraction (iron, coal, gold, bauxite), stone quarrying, cattle ranching, and dryland farming.",
    challenges: "Deep underground water table, rocky unplowable soils, and sudden cliff hazards.",
    opportunities: "Incredible mineral wealth, scenic waterfalls generating hydroelectric power.",
    color: "#d97706"
  },
  {
    id: "plains",
    title: "Plains",
    rangeText: "10 – 12",
    startCheckpoint: 10,
    endCheckpoint: 12,
    description: "Extensive, flat or gently undulating expanses of low-elevation land with deep fertile soils.",
    lookFor: ["Endless horizon", "Checkerboard agricultural fields", "Paved highway networks", "Dense towns"],
    formation: "Deposited over thousands of years by major rivers carrying silt, sand, and clay from mountains.",
    humanLife: "The most densely populated regions on Earth ('Cradles of Civilization') due to fertile soil and ease of building.",
    occupations: "Intensive crop farming (rice, wheat), food processing, manufacturing, trade, and education hubs.",
    challenges: "Seasonal river flooding, soil depletion from over-farming, and groundwater contamination.",
    opportunities: "High agricultural productivity, easy construction of railways, airports, and urban hubs.",
    color: "#16a34a"
  },
  {
    id: "river",
    title: "River Landscape",
    rangeText: "13 – 14",
    startCheckpoint: 13,
    endCheckpoint: 14,
    description: "Dynamic waterway zones with meandering loops, floodplains, oxbow lakes, and bridges crossing the flow.",
    lookFor: ["Wide river bends", "Suspension bridges", "River banks and docks", "Wetland reeds"],
    formation: "Continuous kinetic action of flowing water transporting sediments towards the ocean.",
    humanLife: "Historically, nearly all great human civilizations arose along riverbanks for fresh water and navigation.",
    occupations: "Inland water transport, ferry operation, freshwater fishing, irrigation canal management, and tourism.",
    challenges: "Bank erosion, monsoon overflow, and bridge maintenance across wide channels.",
    opportunities: "Perennial irrigation water supply, eco-tourism, and natural trade navigation.",
    color: "#0284c7"
  },
  {
    id: "settlement",
    title: "Final Stretch",
    rangeText: "15",
    startCheckpoint: 15,
    endCheckpoint: 15,
    description: "The thriving human community and final destination where geography and human innovation unite.",
    lookFor: ["Organized streets", "Marketplace", "Checkered finish arch", "Celebration grounds"],
    formation: "Built by human communities where water, flat land, and transportation crossroads meet.",
    humanLife: "Dense, vibrant community with schools, trading centers, energy networks, and cultural life.",
    occupations: "Commerce, administration, technology, education, healthcare, and artisanal crafts.",
    challenges: "Urban crowding, resource management, waste disposal, and environmental balance.",
    opportunities: "Innovation hubs, collaborative human progress, and shared prosperity.",
    color: "#e11d48"
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // MOUNTAINS (Zone 1)
  {
    id: "m-1",
    question: "Why do high mountain peaks often remain covered in snow even during warm seasons?",
    options: [
      "Higher temperature at higher altitudes",
      "Higher air pressure traps the snow",
      "Lower temperature as elevation increases",
      "Dense tree canopies block the sun"
    ],
    correctAnswer: 2,
    category: "mountains",
    difficulty: "easy",
    explanation: "For roughly every 165 meters of elevation, temperature drops by approximately 1°C (normal lapse rate), keeping high peaks cold.",
    visualType: "terrain",
    terrainFocus: "mountains"
  },
  {
    id: "m-2",
    question: "Which type of agriculture is specifically adapted to cultivate crops on steep mountain slopes?",
    options: [
      "Terrace farming (stepped fields)",
      "Plantation monoculture",
      "Underground crop chambers",
      "Deep river dredging"
    ],
    correctAnswer: 0,
    category: "human-activities",
    difficulty: "medium",
    explanation: "Terraced farming carves flat steps into hillsides to prevent rapid soil erosion and catch rainwater for crops.",
    visualType: "terrain",
    terrainFocus: "mountains"
  },
  {
    id: "m-3",
    question: "Why are high mountain regions typically much less densely populated than flat plains?",
    options: [
      "Lack of sunshine throughout the year",
      "Rugged terrain, harsh climate, and difficult transport",
      "Absence of freshwater sources",
      "Overabundance of mineral toxicities"
    ],
    correctAnswer: 1,
    category: "land-life",
    difficulty: "easy",
    explanation: "Steep slopes make building roads and homes difficult, while cold weather and thin topsoil limit extensive human settlement.",
    visualType: "terrain",
    terrainFocus: "mountains"
  },
  {
    id: "m-4",
    question: "Which of these mountain ranges is an example of young fold mountains with sharp conical peaks?",
    options: [
      "The Appalachians in North America",
      "The Urals in Russia",
      "The Himalayas in Asia",
      "The Aravalli Range in India"
    ],
    correctAnswer: 2,
    category: "mountains",
    difficulty: "hard",
    explanation: "The Himalayas are young fold mountains formed relatively recently in geological time, characterized by jagged, snow-capped peaks.",
    visualType: "terrain",
    terrainFocus: "mountains"
  },

  // VALLEYS (Zone 2)
  {
    id: "v-1",
    question: "How is a typical V-shaped mountain valley usually formed over millions of years?",
    options: [
      "By wind blowing away sand dunes",
      "By the downward erosive cutting of a swift river",
      "By meteorite impacts in a row",
      "By underground caves collapsing"
    ],
    correctAnswer: 1,
    category: "valleys",
    difficulty: "medium",
    explanation: "Swift mountain rivers cut vertically into bedrock, while weathering widens the upper walls into a characteristic V-shape.",
    visualType: "terrain",
    terrainFocus: "valley"
  },
  {
    id: "v-2",
    question: "Why do mountain valleys frequently serve as critical natural transportation routes?",
    options: [
      "They provide lower, gentler passes between steep mountain ridges",
      "They have no vegetation to clear",
      "Airplanes cannot fly over mountains",
      "Valley winds push vehicles forward"
    ],
    correctAnswer: 0,
    category: "land-life",
    difficulty: "easy",
    explanation: "Carving roads through valleys follows the natural gentle grade created by rivers, avoiding impassable high cliffs.",
    visualType: "terrain",
    terrainFocus: "valley"
  },
  {
    id: "v-3",
    question: "Which agricultural activity famously thrives in sheltered mountain valley microclimates?",
    options: [
      "Extensive sugarcane plantations",
      "Fruit orchards such as apples, apricots, and peaches",
      "Submerged deep-water paddy fields",
      "Desert date palm groves"
    ],
    correctAnswer: 1,
    category: "human-activities",
    difficulty: "medium",
    explanation: "Valleys offer protection from harsh summit winds and benefit from well-drained alluvial soil ideal for fruit orchards.",
    visualType: "terrain",
    terrainFocus: "valley"
  },

  // PLATEAUS (Zone 3)
  {
    id: "p-1",
    question: "Which key physical feature distinguishes a plateau from a mountain?",
    options: [
      "A plateau is always underwater",
      "A plateau has a relatively flat, table-like summit",
      "A plateau has no steep cliff sides",
      "A plateau never rises above 100 meters"
    ],
    correctAnswer: 1,
    category: "plateaus",
    difficulty: "easy",
    explanation: "A plateau is often described as an elevated 'tableland' because its top is flat or undulating rather than a pointed summit.",
    visualType: "terrain",
    terrainFocus: "plateau"
  },
  {
    id: "p-2",
    question: "Which major economic activity is globally prominent on plateaus like the Chota Nagpur Plateau?",
    options: [
      "Commercial pearl diving",
      "Deep sea trawling",
      "Mineral mining (iron, coal, manganese)",
      "High-density skyscraper construction"
    ],
    correctAnswer: 2,
    category: "human-activities",
    difficulty: "medium",
    explanation: "Plateaus are ancient geological formations rich in mineral reserves like iron ore, bauxite, and coal, making them mining centers.",
    visualType: "terrain",
    terrainFocus: "plateau"
  },
  {
    id: "p-3",
    question: "Why do scenic waterfalls frequently form near the edges of plateaus?",
    options: [
      "Plateau rivers freeze instantly at the rim",
      "Rivers drop suddenly down the steep escarpment cliffs",
      "Wind blows the water backwards onto the plateau",
      "Plateau rock is softer than plain soil"
    ],
    correctAnswer: 1,
    category: "plateaus",
    difficulty: "medium",
    explanation: "When rivers flowing across elevated tablelands reach steep cliff borders, water plummets downwards, creating spectacular waterfalls.",
    visualType: "terrain",
    terrainFocus: "plateau"
  },
  {
    id: "p-4",
    question: "The Tibetan Plateau is famously known by which geographic nickname?",
    options: [
      "The Garden of the World",
      "The Roof of the World",
      "The Golden Basin",
      "The Silicon Valley of Nature"
    ],
    correctAnswer: 1,
    category: "plateaus",
    difficulty: "easy",
    explanation: "With an average elevation exceeding 4,500 meters above sea level, the Tibetan Plateau is referred to as the 'Roof of the World'.",
    visualType: "terrain",
    terrainFocus: "plateau"
  },

  // PLAINS (Zone 4)
  {
    id: "pl-1",
    question: "Why are river plains among the most fertile and densely populated regions across the globe?",
    options: [
      "They receive 24 hours of continuous sunlight",
      "Flooding rivers regularly deposit nutrient-rich alluvium (silt)",
      "Mountains protect them from all storms",
      "They have no insects or weeds"
    ],
    correctAnswer: 1,
    category: "plains",
    difficulty: "easy",
    explanation: "Annual river floods deposit fresh fine silt and minerals (alluvial soil), creating naturally renewed, highly fertile agricultural soils.",
    visualType: "terrain",
    terrainFocus: "plains"
  },
  {
    id: "pl-2",
    question: "A commercial developer needs to build an extensive railway and highway network. Why are plains ideal?",
    options: [
      "Building on flat terrain requires minimal tunneling and leveling",
      "Plains have fewer government regulations",
      "Metal railway tracks cannot be laid above sea level",
      "Engines do not require fuel on plains"
    ],
    correctAnswer: 0,
    category: "human-activities",
    difficulty: "medium",
    explanation: "Flat surfaces allow roads and tracks to be laid smoothly across long distances without cutting through rock or building viaducts.",
    visualType: "terrain",
    terrainFocus: "plains"
  },
  {
    id: "pl-3",
    question: "The vast Indo-Gangetic Plains were primarily formed by sediments brought by which river systems?",
    options: [
      "Amazon, Congo, and Nile",
      "Indus, Ganga, and Brahmaputra",
      "Mississippi, Missouri, and Ohio",
      "Rhine, Danube, and Seine"
    ],
    correctAnswer: 1,
    category: "plains",
    difficulty: "medium",
    explanation: "The Indus, Ganga, and Brahmaputra rivers and their tributaries deposited alluvial silt eroded from the Himalayas across millions of years.",
    visualType: "terrain",
    terrainFocus: "plains"
  },

  // RIVER LANDSCAPES & SETTLEMENTS (Zone 5 & 6)
  {
    id: "r-1",
    question: "What is the term for the broad S-shaped bends formed as a river slowly flows through flat plains?",
    options: [
      "Cataracts",
      "Meanders",
      "Glaciers",
      "Fault lines"
    ],
    correctAnswer: 1,
    category: "rivers",
    difficulty: "medium",
    explanation: "As water velocity slows on flat plains, rivers curve and loop across the landscape, forming dramatic serpentine meanders.",
    visualType: "terrain",
    terrainFocus: "river"
  },
  {
    id: "r-2",
    question: "Why did almost all ancient human civilizations (like Mesopotamia, Egypt, Indus) begin along river banks?",
    options: [
      "They needed reliable water for drinking, irrigation, and trade transport",
      "Ancient people were unable to live away from fish",
      "River valleys are the only places where fire burns",
      "Stone tools could only be made under water"
    ],
    correctAnswer: 0,
    category: "land-life",
    difficulty: "easy",
    explanation: "Perennial fresh water, fertile soil for food surplus, and easy navigation routes made river banks the ideal cradle for cities.",
    visualType: "terrain",
    terrainFocus: "settlement"
  },
  {
    id: "r-3",
    question: "How do modern human settlements actively adapt when situated on coastal or river floodplains?",
    options: [
      "Constructing raised dykes, levees, and homes on stilts",
      "Diverting rivers permanently into outer space",
      "Eliminating all vegetation along the riverbank",
      "Replacing all bridges with underground subways only"
    ],
    correctAnswer: 0,
    category: "human-activities",
    difficulty: "medium",
    explanation: "Communities build flood embankments (dykes/levees) and elevate homes on pillars/stilts to protect against seasonal water rise.",
    visualType: "terrain",
    terrainFocus: "settlement"
  },
  {
    id: "r-4",
    question: "Which geographic landform forms at the river's mouth where it splits into distributaries and meets the sea?",
    options: [
      "Gorge",
      "Delta",
      "Plateau",
      "Escarpment"
    ],
    correctAnswer: 1,
    category: "rivers",
    difficulty: "easy",
    explanation: "A triangular tract of sediment deposited at the mouth of a river (such as the Sundarbans Delta) is called a delta.",
    visualType: "terrain",
    terrainFocus: "river"
  },
  {
    id: "ll-1",
    question: "How does the physical landscape directly shape human architectural choices?",
    options: [
      "Houses in snowy mountains feature steep sloped roofs to shed snow easily",
      "Every house in the world is identical regardless of climate",
      "Flat roofs are constructed only in rainforests",
      "Glass walls are built in polar ice zones for heating"
    ],
    correctAnswer: 0,
    category: "land-life",
    difficulty: "easy",
    explanation: "Sloping roofs allow heavy snow and rainwater to slide off without collapsing the roof structure.",
    visualType: "terrain",
    terrainFocus: "mountains"
  },
  {
    id: "ll-2",
    question: "Animals living in high altitude plateaus and mountains (like yaks and snow leopards) typically possess:",
    options: [
      "Thin skin and large ears to lose heat",
      "Thick woolly fur, fat layers, and high red-blood-cell counts",
      "Gills to breathe underwater",
      "Featherless wings to glide"
    ],
    correctAnswer: 1,
    category: "land-life",
    difficulty: "medium",
    explanation: "Thick fur insulates against extreme cold, while higher hemoglobin/red blood cells adapt to low oxygen levels in thin air.",
    visualType: "terrain",
    terrainFocus: "mountains"
  }
];
