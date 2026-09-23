import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VillageIntelligenceMap } from './components/VillageIntelligenceMap';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { FutureDemandRadar } from './components/FutureDemandRadar';
import { FarmerLearningEngine } from './components/FarmerLearningEngine';
import { AIVillageMentor } from './components/AIVillageMentor';
import { DigitalTwinFarm } from './components/DigitalTwinFarm';
import { VillageGovernanceAndCBSE } from './components/VillageGovernanceAndCBSE';
import { FarmGuardHardware } from './components/FarmGuardHardware';
import { DirectFarmMarketplace } from './components/DirectFarmMarketplace';
import { SmartStorageNetwork } from './components/SmartStorageNetwork';
import { FarmerKnowledgeVault } from './components/FarmerKnowledgeVault';
import { AtmosphericWeatherIntelligence } from './components/AtmosphericWeatherIntelligence';
import { useCloudData } from './context/CloudDataContext';

import {
  DEMAND_SIGNALS,
  COURSES,
  SAMPLE_DIGITAL_TWIN,
} from './data/mockAgricultureData';

import {
  POPULAR_CITIES_PRESETS,
  getOrCreateCityVillageData,
} from './data/allCitiesData';

import {
  VillageInfo,
  AnonymousCropRegistration,
  SimulationScenario,
  FarmSeasonLog,
  DigitalTwinFarm as TwinType,
} from './types';

// Initial default preset list converted to VillageInfo format
const INITIAL_CITY_VILLAGES: VillageInfo[] = POPULAR_CITIES_PRESETS.map((p) => ({
  id: p.id,
  name: p.cityName,
  district: p.district,
  state: p.state,
  totalArableAcres: p.totalArableAcres,
  activeFarmersRegistered: p.activeFarmersRegistered,
  waterAvailabilityIndex: p.waterAvailabilityIndex,
  soilTypes: p.soilTypes,
  crops: p.crops,
}));

export default function App() {
  const {
    cropRegistrations: cloudRegistrations,
    addCropRegistration,
    twinData: cloudTwinData,
    addFarmSeasonLog,
  } = useCloudData();

  const [activeTab, setActiveTab] = useState<string>('map');
  const [villages, setVillages] = useState<VillageInfo[]>(INITIAL_CITY_VILLAGES);
  const [selectedVillage, setSelectedVillage] = useState<VillageInfo>(
    INITIAL_CITY_VILLAGES[0]
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSearchingCity, setIsSearchingCity] = useState<boolean>(false);

  // Registrations state
  const [localRegistrations, setLocalRegistrations] = useState<AnonymousCropRegistration[]>([]);
  const registrations = cloudRegistrations.length > 0 ? cloudRegistrations : localRegistrations;

  // Digital Twin Farm state
  const [twinData, setTwinData] = useState<TwinType>({
    ...SAMPLE_DIGITAL_TWIN,
    villageName: `${INITIAL_CITY_VILLAGES[0].name}, ${INITIAL_CITY_VILLAGES[0].state}`,
  });

  // Selected Scenario for Mentor
  const [selectedScenarioForMentor, setSelectedScenarioForMentor] =
    useState<SimulationScenario | null>(null);

  // Handle searching/selecting ANY city or district across India / World
  const handleSearchCity = async (cityNameQuery: string) => {
    if (!cityNameQuery || !cityNameQuery.trim()) return;

    setIsSearchingCity(true);

    // Instant local response for fast feedback
    const localData = getOrCreateCityVillageData(cityNameQuery);
    setSelectedVillage(localData);

    // Add to villages list if not already present
    setVillages((prev) => {
      if (prev.some((v) => v.name.toLowerCase() === localData.name.toLowerCase())) {
        return prev;
      }
      return [localData, ...prev];
    });

    // Update digital twin location context
    setTwinData((prev) => ({
      ...prev,
      villageName: `${localData.name}, ${localData.state}`,
    }));

    // Perform background query to Gemini API / Server for enriched geographic intelligence
    try {
      const response = await fetch('/api/city-agri-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityName: cityNameQuery }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.cityData && result.cityData.name) {
          const aiData: VillageInfo = {
            id: `ai-city-${Date.now()}`,
            name: result.cityData.name,
            district: result.cityData.district || `${result.cityData.name} Region`,
            state: result.cityData.state || 'India',
            totalArableAcres: result.cityData.totalArableAcres || 1400,
            activeFarmersRegistered: result.cityData.activeFarmersRegistered || 95,
            waterAvailabilityIndex: result.cityData.waterAvailabilityIndex || 'Moderate',
            soilTypes: result.cityData.soilTypes || ['Alluvial Loam'],
            crops: result.cityData.crops || localData.crops,
          };
          setSelectedVillage(aiData);
          setVillages((prev) => [aiData, ...prev.filter((v) => v.id !== aiData.id)]);
        }
      }
    } catch (err) {
      console.warn('City AI fetch failed, using local geographic engine:', err);
    } finally {
      setIsSearchingCity(false);
    }
  };

  const handleRegisterCrop = (reg: AnonymousCropRegistration) => {
    setLocalRegistrations((prev) => [reg, ...prev]);

    // Persist crop registration to Cloud Firestore and backend
    addCropRegistration({
      villageId: reg.villageId || selectedVillage.id,
      farmerAlias: reg.farmerAlias || 'Registered Farmer',
      plannedCrop: reg.plannedCrop,
      landSizeAcres: reg.landSizeAcres,
      season: reg.season,
    }).catch((err) => console.warn('Cloud crop registration error:', err));

    fetch('/api/crop-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        villageName: selectedVillage.name,
        farmerName: reg.farmerAlias || 'Registered Farmer',
        plannedCrop: reg.plannedCrop,
        landSizeAcres: reg.landSizeAcres,
      }),
    }).catch((err) => console.warn('Backend crop registration save failed:', err));

    // Update land calculation dynamically in selected village
    setSelectedVillage((prev) => {
      if (prev.id === reg.villageId || prev.name === selectedVillage.name) {
        const updatedCrops = prev.crops.map((c) => {
          if (c.cropName.toLowerCase().includes(reg.plannedCrop.toLowerCase())) {
            const newAcres = c.acresPlanted + reg.landSizeAcres;
            const newPct = Number(
              ((newAcres / prev.totalArableAcres) * 100).toFixed(1)
            );
            return {
              ...c,
              acresPlanted: newAcres,
              farmerCount: c.farmerCount + 1,
              percentageOfVillageLand: newPct,
              riskLevel: newPct > 45 ? ('red' as const) : newPct > 25 ? ('yellow' as const) : ('green' as const),
            };
          }
          return c;
        });
        return {
          ...prev,
          activeFarmersRegistered: prev.activeFarmersRegistered + 1,
          crops: updatedCrops,
        };
      }
      return prev;
    });
  };

  const handleAddSeasonLog = (log: FarmSeasonLog) => {
    addFarmSeasonLog(log).catch((err) => console.warn('Cloud farm season log error:', err));
    setTwinData((prev) => ({
      ...prev,
      seasons: [log, ...prev.seasons],
      twinIntelligenceScore: Math.min(99, prev.twinIntelligenceScore + 3),
    }));
  };


  const handleSelectScenarioForMentor = (scenario: SimulationScenario) => {
    setSelectedScenarioForMentor(scenario);
    setActiveTab('mentor');
  };

  const handleApplySignalFilter = (_cropTarget: string) => {
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Header Navigation with All-City Search Engine */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
        villages={villages}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onSearchCity={handleSearchCity}
        isSearchingCity={isSearchingCity}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'map' && (
          <VillageIntelligenceMap
            village={selectedVillage}
            onRegisterCrop={handleRegisterCrop}
            registrations={registrations}
          />
        )}

        {activeTab === 'weather' && (
          <AtmosphericWeatherIntelligence
            village={selectedVillage}
            onSelectCity={handleSearchCity}
          />
        )}

        {activeTab === 'hardware' && (
          <FarmGuardHardware
            village={selectedVillage}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'marketplace' && (
          <DirectFarmMarketplace
            village={selectedVillage}
          />
        )}

        {activeTab === 'storage' && (
          <SmartStorageNetwork
            village={selectedVillage}
          />
        )}

        {activeTab === 'vault' && (
          <FarmerKnowledgeVault
            village={selectedVillage}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'simulator' && (
          <WhatIfSimulator
            village={selectedVillage}
            onSelectScenarioForMentor={handleSelectScenarioForMentor}
          />
        )}

        {activeTab === 'radar' && (
          <FutureDemandRadar
            signals={DEMAND_SIGNALS}
            onApplySignalFilter={handleApplySignalFilter}
          />
        )}

        {activeTab === 'learning' && (
          <FarmerLearningEngine courses={COURSES} />
        )}

        {activeTab === 'mentor' && (
          <AIVillageMentor
            village={selectedVillage}
            selectedScenario={selectedScenarioForMentor}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'twin' && (
          <DigitalTwinFarm
            twinData={twinData}
            onAddSeasonLog={handleAddSeasonLog}
          />
        )}

        {activeTab === 'gov' && <VillageGovernanceAndCBSE />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          FutureFarm OS — KrishiMitra AI Decision Intelligence
        </p>
        <p>
          Available for every city & district • "Helping farmers grow what the future needs, not what the past grew."
        </p>
      </footer>
    </div>
  );
}
