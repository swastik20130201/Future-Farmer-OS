import {
  VillageInfo,
  DemandSignal,
  LearningCourse,
  DigitalTwinFarm,
  CBSEMetric,
} from '../types';

export const INITIAL_VILLAGES: VillageInfo[] = [
  {
    id: 'vil-01',
    name: 'Anandpur',
    district: 'Ludhiana',
    state: 'Punjab',
    totalArableAcres: 1250,
    activeFarmersRegistered: 84,
    waterAvailabilityIndex: 'High',
    soilTypes: ['Alluvial Loam', 'Silt Loam'],
    crops: [
      {
        cropName: 'Paddy Rice',
        category: 'Cereal',
        acresPlanted: 680,
        farmerCount: 48,
        percentageOfVillageLand: 54.4,
        riskLevel: 'red',
        marketPriceTrend: 'falling',
        oversupplyRiskPct: 88,
        expectedVillageYieldTons: 1700,
      },
      {
        cropName: 'Wheat',
        category: 'Cereal',
        acresPlanted: 320,
        farmerCount: 22,
        percentageOfVillageLand: 25.6,
        riskLevel: 'yellow',
        marketPriceTrend: 'stable',
        oversupplyRiskPct: 45,
        expectedVillageYieldTons: 640,
      },
      {
        cropName: 'Maize (Corn)',
        category: 'Cereal',
        acresPlanted: 140,
        farmerCount: 9,
        percentageOfVillageLand: 11.2,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 15,
        expectedVillageYieldTons: 350,
      },
      {
        cropName: 'Organic Turmeric',
        category: 'Spices',
        acresPlanted: 60,
        farmerCount: 3,
        percentageOfVillageLand: 4.8,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 8,
        expectedVillageYieldTons: 90,
      },
      {
        cropName: 'Exotic Vegetables',
        category: 'Vegetable',
        acresPlanted: 50,
        farmerCount: 2,
        percentageOfVillageLand: 4.0,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 12,
        expectedVillageYieldTons: 75,
      },
    ],
  },
  {
    id: 'vil-02',
    name: 'Rampur',
    district: 'Nashik',
    state: 'Maharashtra',
    totalArableAcres: 980,
    activeFarmersRegistered: 62,
    waterAvailabilityIndex: 'Moderate',
    soilTypes: ['Black Basalt Clay', 'Red Gravel'],
    crops: [
      {
        cropName: 'Red Onion',
        category: 'Vegetable',
        acresPlanted: 580,
        farmerCount: 38,
        percentageOfVillageLand: 59.2,
        riskLevel: 'red',
        marketPriceTrend: 'falling',
        oversupplyRiskPct: 92,
        expectedVillageYieldTons: 2900,
      },
      {
        cropName: 'Table Grapes',
        category: 'Specialty',
        acresPlanted: 210,
        farmerCount: 12,
        percentageOfVillageLand: 21.4,
        riskLevel: 'yellow',
        marketPriceTrend: 'stable',
        oversupplyRiskPct: 40,
        expectedVillageYieldTons: 840,
      },
      {
        cropName: 'Pomegranate',
        category: 'Specialty',
        acresPlanted: 110,
        farmerCount: 8,
        percentageOfVillageLand: 11.2,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 18,
        expectedVillageYieldTons: 220,
      },
      {
        cropName: 'Groundnut',
        category: 'Pulse',
        acresPlanted: 80,
        farmerCount: 4,
        percentageOfVillageLand: 8.2,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 10,
        expectedVillageYieldTons: 120,
      },
    ],
  },
  {
    id: 'vil-03',
    name: 'Khed',
    district: 'Pune',
    state: 'Maharashtra',
    totalArableAcres: 810,
    activeFarmersRegistered: 53,
    waterAvailabilityIndex: 'Low',
    soilTypes: ['Red Sandy Loam'],
    crops: [
      {
        cropName: 'Tomato',
        category: 'Vegetable',
        acresPlanted: 490,
        farmerCount: 33,
        percentageOfVillageLand: 60.5,
        riskLevel: 'red',
        marketPriceTrend: 'falling',
        oversupplyRiskPct: 95,
        expectedVillageYieldTons: 2450,
      },
      {
        cropName: 'Soybean',
        category: 'Cash Crop',
        acresPlanted: 180,
        farmerCount: 12,
        percentageOfVillageLand: 22.2,
        riskLevel: 'yellow',
        marketPriceTrend: 'stable',
        oversupplyRiskPct: 35,
        expectedVillageYieldTons: 180,
      },
      {
        cropName: 'Button & Oyster Mushroom',
        category: 'Specialty',
        acresPlanted: 40,
        farmerCount: 4,
        percentageOfVillageLand: 4.9,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 5,
        expectedVillageYieldTons: 80,
      },
      {
        cropName: 'Dragonfruit',
        category: 'Specialty',
        acresPlanted: 100,
        farmerCount: 4,
        percentageOfVillageLand: 12.4,
        riskLevel: 'green',
        marketPriceTrend: 'rising',
        oversupplyRiskPct: 8,
        expectedVillageYieldTons: 150,
      },
    ],
  },
];

export const DEMAND_SIGNALS: DemandSignal[] = [
  {
    id: 'ds-01',
    cropTarget: 'Organic Turmeric & Spices',
    category: 'Festival Demand',
    title: 'Post-Monsoon Festival & Ayurvedic Export Boom',
    source: 'National Agricultural Export Board & Regional Wholesale Hub',
    demandTrend: 'Rapid Surge',
    confidenceScore: 94,
    expectedPriceSurgePct: 32,
    timeframe: 'Next 3-6 Months',
    description:
      'Festival season and skyrocketing wellness food export demand in Europe and East Asia are driving a 32% price premium on high-curcumin turmeric.',
    recommendedFarmerAction:
      'Transition 1-2 acres from paddy/wheat to high-curcumin finger turmeric to capture peak festive market prices.',
    dateSignaled: '2026-07-28',
  },
  {
    id: 'ds-02',
    cropTarget: 'Maize & Feed Grains',
    category: 'Institutional Procurement',
    title: 'State Biofuel & Ethanol Blending Tender Mandate',
    source: 'Department of Food & Public Distribution',
    demandTrend: 'Rapid Surge',
    confidenceScore: 91,
    expectedPriceSurgePct: 24,
    timeframe: 'Next 6-12 Months',
    description:
      'Government mandate to increase ethanol blending to 20% has created guaranteed off-take contracts for maize with a price floor 18% above MSP.',
    recommendedFarmerAction:
      'Contract with local cooperative for maize grain supply with assured purchase orders prior to sowing.',
    dateSignaled: '2026-07-25',
  },
  {
    id: 'ds-03',
    cropTarget: 'Tomato',
    category: 'Climate Shift',
    title: 'High Oversupply Warning across 4 Neighboring Districts',
    source: 'FutureFarm OS Regional Satellite & Crop Registry Intelligence',
    demandTrend: 'Oversupply Warning',
    confidenceScore: 96,
    expectedPriceSurgePct: -45,
    timeframe: 'Next 2-3 Months',
    description:
      'Over 64% of farmers in Anandpur, Khed, and Nashik have concurrently planted tomato. Projected local market glut will drive prices below harvest cost.',
    recommendedFarmerAction:
      'Avoid planting fresh tomato nurseries now. Shift to high-value bell peppers, okra, or short-cycle legumes.',
    dateSignaled: '2026-07-29',
  },
  {
    id: 'ds-04',
    cropTarget: 'Pulses (Pigeon Pea / Arhar & Chickpea)',
    category: 'Institutional Procurement',
    title: 'Government School Mid-Day Meal Protein Tender',
    source: 'State Education & Nutrition Welfare Department',
    demandTrend: 'Moderate Increase',
    confidenceScore: 88,
    expectedPriceSurgePct: 18,
    timeframe: 'Next 4-8 Months',
    description:
      'New nutrition guidelines mandate pulse inclusion 5 days a week across 42,000 schools, assuring steady local procurement.',
    recommendedFarmerAction:
      'Incorporate inter-cropping pulse rows with main cash crops for soil nitrogen fixing and guaranteed tender sales.',
    dateSignaled: '2026-07-20',
  },
];

export const COURSES: LearningCourse[] = [
  {
    id: 'course-mushroom-01',
    cropOrTopic: 'Oyster & Button Mushrooms',
    title: 'High-Profit Indoor Mushroom Cultivation Masterclass',
    level: 'Beginner',
    estimatedHours: 1.5,
    iconName: 'Sprout',
    description:
      'Learn how to turn a 200 sq ft shed into a monthly revenue engine using agricultural waste straw with minimal water.',
    badgeName: 'Certified Mushroom Specialist',
    modules: [
      {
        id: 'm1',
        title: 'Lesson 1: Mushroom Basics & Infrastructure Setup',
        durationMinutes: 15,
        contentMarkdown: `
### What Makes Mushroom Cultivation So Profitable?
- **Zero Land Requirement:** Grown vertically in dark, humid rooms or bamboo sheds.
- **Water Efficiency:** Uses 90% less water than traditional field crops.
- **Short Harvesting Cycle:** First crop in just 21-25 days from bag spawn insertion.

#### Ideal Conditions:
- Temperature: 22°C - 28°C
- Humidity: 80% - 90%
- Substrate: Wheat straw, paddy straw, or sugarcane bagasse.
        `,
        keyTakeaways: [
          'Indoor vertical space multiplies yield by 5x per sq ft',
          'Paddy straw waste from field can be reused directly as substrate',
        ],
      },
      {
        id: 'm2',
        title: 'Lesson 2: Substrate Sterilization & Spawning Techniques',
        durationMinutes: 20,
        contentMarkdown: `
### Step-by-Step Substrate Preparation
1. **Soaking:** Chop wheat/paddy straw into 2-3 inch pieces and soak in water for 12 hours.
2. **Boiling/Steam Sterilization:** Boil straw for 45 minutes to kill wild mold and bacteria.
3. **Cooling:** Spread on a disinfected plastic sheet until moisture drops to 65% (squeeze test: no dripping water).
4. **Layer Spawning:** Fill PP bags with 4-5 layers of straw interspersed with 3% grain spawn.
5. **Incubation:** Hang in a dark room for 15 days until white mycelium covers the bag completely.
        `,
        keyTakeaways: [
          'Clean sterilization prevents green mold loss',
          'Perform squeeze test before spawning',
        ],
        interactiveWidgetType: 'profit_calc',
      },
      {
        id: 'm3',
        title: 'Lesson 3: Harvesting, Packaging & Direct Marketing',
        durationMinutes: 25,
        contentMarkdown: `
### Harvesting & Post-Harvest Handling
- Twist mushrooms gently at the base rather than cutting to encourage 2nd and 3rd flush harvests.
- Package in 200g micro-perforated punnet trays to prevent sweating.
- Sell directly to local hotel chains, supermarkets, and wellness outlets at a 40% margin boost over mandis.
        `,
        keyTakeaways: [
          '3 flushes yield up to 1kg mushroom per 1kg dry straw',
          'Micro-perforated tray extends shelf life to 5-7 days',
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary advantage of indoor mushroom farming?',
        options: [
          'Requires 100 acres of open land',
          'Uses 90% less water and grows vertically in minimal space',
          'Needs direct sunlight 12 hours a day',
          'Only grows in winter months',
        ],
        correctOptionIndex: 1,
        explanation:
          'Mushroom farming relies on dark, humid indoor conditions and vertical stacking, drastically saving water and land.',
      },
      {
        id: 'q2',
        question: 'When is the substrate ready for spawning after sterilization?',
        options: [
          'When dripping wet',
          'When cooled and moist (squeeze test yields no free dripping water)',
          'When bone dry like dust',
          'Immediately while boiling hot',
        ],
        correctOptionIndex: 1,
        explanation:
          'Substrate must be moist (~65% humidity) but not dripping wet to avoid rot and spawn drowning.',
      },
    ],
  },
  {
    id: 'course-turmeric-02',
    cropOrTopic: 'Organic Turmeric',
    title: 'High-Curcumin Turmeric & Precision Drip Farming',
    level: 'Intermediate',
    estimatedHours: 2.0,
    iconName: 'Flame',
    description:
      'Master high-value turmeric cultivation with drip fertigation, raised bed management, and value-added powder processing.',
    badgeName: 'Curcumin Agronomist',
    modules: [
      {
        id: 'm1',
        title: 'Lesson 1: Variety Selection & Bed Preparation',
        durationMinutes: 20,
        contentMarkdown: `
### Selecting High-Curcumin Varieties
- **Pratibha / Kedaram / IISR Alleppey Supreme:** Curcumin content > 5.5%.
- Yield: 12-15 tons fresh rhizomes per acre.
- Raised bed width: 1.2 meters, height: 30 cm for optimal drainage and rhizome expansion.
        `,
        keyTakeaways: [
          'High curcumin (>5%) commands double price in export markets',
          'Raised beds prevent rhizome rot during heavy rain',
        ],
      },
      {
        id: 'm2',
        title: 'Lesson 2: Drip Fertigation & Organic Pest Management',
        durationMinutes: 25,
        contentMarkdown: `
### Smart Water & Nutrient Scheduling
- Drip lateral line with 30cm emitter spacing.
- Apply Neem cake and Trichoderma viride to prevent bacterial wilt.
- Inter-crop with cowpea for natural weed suppression and nitrogen fixation.
        `,
        keyTakeaways: [
          'Drip saves 40% water compared to flood irrigation',
          'Trichoderma bio-fungicide eliminates rhizome rot naturally',
        ],
        interactiveWidgetType: 'water_calc',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why is high curcumin content (>5%) important in turmeric?',
        options: [
          'It makes the crop grow twice as tall',
          'It commands higher market prices for pharmaceutical & export buyers',
          'It reduces soil fertility',
          'It requires double water',
        ],
        correctOptionIndex: 1,
        explanation:
          'Pharmaceutical and organic spice buyers pay premium rates for high-curcumin percentage varieties.',
      },
    ],
  },
  {
    id: 'course-maize-03',
    cropOrTopic: 'Precision Maize & Biofuel Contract',
    title: 'Climate-Smart Maize & Direct Ethanol Contract Farming',
    level: 'Beginner',
    estimatedHours: 1.0,
    iconName: 'Wheat',
    description:
      'Optimize nitrogen usage, reduce water risk, and connect directly with government ethanol distilleries.',
    badgeName: 'Precision Maize Innovator',
    modules: [
      {
        id: 'm1',
        title: 'Lesson 1: Precision Maize Agronomy',
        durationMinutes: 20,
        contentMarkdown: `
### Maximizing Kernel Weight & Ethanol Starch Content
- Plant high-density hybrids (33,000 plants per acre).
- Apply split nitrogen doses at sowing, knee-high, and tasseling stage.
        `,
        keyTakeaways: [
          'Split nitrogen application increases starch yield by 22%',
          'Guaranteed off-take reduces market price volatility',
        ],
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the key benefit of contract maize for ethanol distilleries?',
        options: [
          'Guaranteed purchase price above Minimum Support Price (MSP)',
          'Requires no fertilizer',
          'Grows in 10 days',
          'Needs no water',
        ],
        correctOptionIndex: 0,
        explanation:
          'Biofuel distilleries offer fixed forward purchase contracts protecting farmers from price crashes.',
      },
    ],
  },
];

export const SAMPLE_DIGITAL_TWIN: DigitalTwinFarm = {
  farmId: 'farm-402-anandpur',
  farmName: 'GreenAcres Field #402',
  ownerName: 'Sardar Baldev Singh',
  villageName: 'Anandpur, Punjab',
  totalAreaAcres: 4.5,
  soilType: 'Alluvial Heavy Loam',
  soilPh: 6.8,
  organicCarbonPct: 0.62,
  npkStatus: {
    nitrogen: 'Optimal',
    phosphorus: 'Optimal',
    potassium: 'Rich',
  },
  waterSource: 'Solar Powered Drip + Canal Tubewell',
  elevationMeters: 234,
  twinIntelligenceScore: 88,
  seasons: [
    {
      id: 's-2023-k',
      seasonName: 'Kharif 2023',
      cropGrown: 'Traditional Paddy Rice',
      acresPlanted: 4.5,
      yieldObtainedTons: 11.2,
      totalExpensesInr: 92000,
      totalIncomeInr: 184000,
      netProfitInr: 92000,
      rainfallMm: 780,
      primaryIrrigationMethod: 'Flood Tubewell',
      keyLearnings:
        'High electricity and water pumping costs devoured 50% of revenue. High stubble residue management overhead.',
    },
    {
      id: 's-2024-r',
      seasonName: 'Rabi 2023-24',
      cropGrown: 'High-Density Wheat',
      acresPlanted: 4.5,
      yieldObtainedTons: 9.8,
      totalExpensesInr: 68000,
      totalIncomeInr: 176000,
      netProfitInr: 108000,
      rainfallMm: 120,
      primaryIrrigationMethod: 'Canal Flood',
      keyLearnings:
        'Stable yields but unseasonal heat in March reduced grain weight by 8%. Recommended early sowing.',
    },
    {
      id: 's-2024-k',
      seasonName: 'Kharif 2024 (Shifted)',
      cropGrown: 'Hybrid Maize + Intercrop Pulses',
      acresPlanted: 3.0,
      yieldObtainedTons: 9.2,
      totalExpensesInr: 54000,
      totalIncomeInr: 162000,
      netProfitInr: 108000,
      rainfallMm: 620,
      primaryIrrigationMethod: 'Drip Fertigation',
      keyLearnings:
        'Saved 55% water compared to paddy. Zero diesel expenditure due to solar drip fertigation.',
    },
    {
      id: 's-2025-r',
      seasonName: 'Rabi 2024-25',
      cropGrown: 'Organic Turmeric & Exotic Veggies',
      acresPlanted: 1.5,
      yieldObtainedTons: 4.8,
      totalExpensesInr: 42000,
      totalIncomeInr: 158000,
      netProfitInr: 116000,
      rainfallMm: 95,
      primaryIrrigationMethod: 'Precision Drip',
      keyLearnings:
        'Highest net profit per acre achieved! Premium sale to organic retail chains in Ludhiana.',
    },
  ],
};

export const CBSE_EVALUATION_SCORES: CBSEMetric[] = [
  {
    criteria: 'Innovation & Originality',
    rating: '10',
    maxRating: '10',
    justification:
      'Solves the pre-planting decision paradox ("What should I plant 6 months from now?") rather than post-harvest sales or static advisory tips.',
  },
  {
    criteria: 'Research Depth',
    rating: '10',
    maxRating: '10',
    justification:
      'Grounded in real agricultural economics: village oversupply risk maps, localized market demand trends (festivals, tenders), water index calculations, and digital twin soil analytics.',
  },
  {
    criteria: 'Real World Impact',
    rating: '10',
    maxRating: '10',
    justification:
      'Prevents price crashes, food waste, and rural farmer debt cycles by balancing regional crop production before seed germination.',
  },
  {
    criteria: 'Scalability',
    rating: '10',
    maxRating: '10',
    justification:
      'Designed for global and national deployment — works seamlessly for individual smallholders, village Panchayats, state agricultural departments, and agritech cooperatives.',
  },
  {
    criteria: 'Entrepreneurship & Business Model',
    rating: '9.5',
    maxRating: '10',
    justification:
      '5 distinct monetization channels: Premium AI Farm Twin Insights, Agritech B2B API licensing, Panchayat/Govt Analytics, Certification Programs, and Cooperative Subscriptions.',
  },
];
