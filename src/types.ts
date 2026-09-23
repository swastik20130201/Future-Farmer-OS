export type CropRiskLevel = 'green' | 'yellow' | 'red';

export interface VillageCropData {
  cropName: string;
  category: 'Cereal' | 'Vegetable' | 'Cash Crop' | 'Pulse' | 'Spices' | 'Specialty';
  acresPlanted: number;
  farmerCount: number;
  percentageOfVillageLand: number;
  riskLevel: CropRiskLevel;
  marketPriceTrend: 'rising' | 'stable' | 'falling';
  oversupplyRiskPct: number;
  expectedVillageYieldTons: number;
}

export interface VillageInfo {
  id: string;
  name: string;
  district: string;
  state: string;
  totalArableAcres: number;
  activeFarmersRegistered: number;
  waterAvailabilityIndex: 'High' | 'Moderate' | 'Low' | 'Critical';
  soilTypes: string[];
  crops: VillageCropData[];
}

export interface AnonymousCropRegistration {
  id: string;
  villageId: string;
  farmerAlias: string; // e.g. "Farmer #104"
  landSizeAcres: number;
  plannedCrop: string;
  season: string;
  registeredAt: string;
}

export interface SimulationInput {
  landAcres: number;
  waterLevel: 'High (Canal/Borewell)' | 'Moderate (Drip/Rainfed)' | 'Low (Deficit/Tanker)';
  budgetInr: number;
  riskTolerance: 'Low (Safe Staples)' | 'Balanced' | 'High (High-Margin Specialty)';
  experienceYears: number;
  soilType: string;
}

export interface SimulationScenario {
  id: string;
  cropName: string;
  category: string;
  expectedYieldPerAcre: string;
  estimatedGrossRevenue: number;
  estimatedCost: number;
  expectedNetProfit: number;
  roiPercentage: number;
  waterUsageLiters: number;
  waterEfficiencyRating: 'A+' | 'A' | 'B' | 'C' | 'D';
  riskScorePct: number; // 0-100 (lower is safer)
  crowdCompetitionIndex: number; // 0-100 (how crowded in nearby villages)
  keyAdvantages: string[];
  riskFactors: string[];
  marketOutlook: string;
}

export interface DemandSignal {
  id: string;
  cropTarget: string;
  category: 'Festival Demand' | 'Institutional Procurement' | 'Industrial Processing' | 'Export Trend' | 'Climate Shift';
  title: string;
  source: string; // e.g. "Diwali Sweets & Temple Procurement Board", "State Mid-Day Meal Scheme"
  demandTrend: 'Rapid Surge' | 'Moderate Increase' | 'Stable' | 'Oversupply Warning';
  confidenceScore: number; // 0 - 100%
  expectedPriceSurgePct: number;
  timeframe: string; // e.g. "Next 4-6 Months"
  description: string;
  recommendedFarmerAction: string;
  dateSignaled: string;
}

export interface LessonModule {
  id: string;
  title: string;
  durationMinutes: number;
  contentMarkdown: string;
  keyTakeaways: string[];
  interactiveWidgetType?: 'profit_calc' | 'water_calc' | 'soil_ph_picker';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LearningCourse {
  id: string;
  cropOrTopic: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  iconName: string;
  description: string;
  modules: LessonModule[];
  quiz: QuizQuestion[];
  badgeName: string;
}

export interface FarmSeasonLog {
  id: string;
  seasonName: string; // e.g., "Kharif 2025"
  cropGrown: string;
  acresPlanted: number;
  yieldObtainedTons: number;
  totalExpensesInr: number;
  totalIncomeInr: number;
  netProfitInr: number;
  rainfallMm: number;
  primaryIrrigationMethod: string;
  keyLearnings: string;
}

export interface DigitalTwinFarm {
  farmId: string;
  farmName: string;
  ownerName: string;
  villageName: string;
  totalAreaAcres: number;
  soilType: string;
  soilPh: number;
  organicCarbonPct: number;
  npkStatus: {
    nitrogen: 'Deficient' | 'Optimal' | 'Rich';
    phosphorus: 'Deficient' | 'Optimal' | 'Rich';
    potassium: 'Deficient' | 'Optimal' | 'Rich';
  };
  waterSource: string;
  elevationMeters: number;
  seasons: FarmSeasonLog[];
  twinIntelligenceScore: number; // 0-100 (gets smarter over seasons)
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface CBSEMetric {
  criteria: string;
  rating: string;
  maxRating: string;
  justification: string;
}

export interface MarketItem {
  id: string;
  name: string;
  category: 'Fruits' | 'Vegetables' | 'Pulses' | 'Cereals' | 'Organic Products';
  farmerName: string;
  farmerContact?: string;
  location: string;
  pricePerKg: number;
  availableKg: number;
  grade: 'A+' | 'A' | 'B';
  storageVerified: boolean;
  sacReceiptId?: string;
  image: string;
  description: string;
  farmerUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketOrder {
  id: string;
  itemId: string;
  itemName: string;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmountInr: number;
  status: 'Order Placed' | 'Warehouse QC Verified' | 'In Cold-Chain Transit' | 'Delivered' | 'Cancelled';
  trackingCode: string;
  carrierName?: string;
  buyerUid?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StorageReceipt {
  id?: string;
  receiptId: string;
  farmerName: string;
  village: string;
  cropType: string;
  variety?: string;
  quantityKg: number;
  depositDate: string;
  expiryDate?: string;
  grade: 'A+' | 'A' | 'B';
  hubLocation: string;
  chamberType?: string;
  temperature: number; // °C
  humidity: number; // %
  ethylenePpm?: number;
  spoilageRiskPct: number;
  shelfLifeDays?: number;
  sacTagId?: string;
  status: 'In Storage (Safe)' | 'Listed on Market' | 'Sold & Dispatched' | 'Withdrawn by Farmer';
  notes?: string;
  farmerUid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: 'Organic Farming' | 'Pest Control' | 'Traditional Irrigation' | 'Soil Care' | string;
  author: string;
  authorName?: string;
  authorRole?: 'Experienced Farmer' | 'Agri Student' | 'Agronomist Specialist' | string;
  location?: string;
  village?: string;
  type?: 'Voice Note' | 'Video Guide' | 'Farming Story' | string;
  duration?: string;
  content: string;
  tags?: string;
  likes: number;
  upvotes?: number;
  userId?: string;
  createdAt?: string;
}

