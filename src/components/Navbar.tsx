import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  Map,
  Sliders,
  TrendingUp,
  GraduationCap,
  Bot,
  Layers,
  Award,
  Volume2,
  VolumeX,
  Search,
  Globe,
  RefreshCw,
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
  Cpu,
  ShoppingBag,
  Warehouse,
  BookOpen,
  Sun,
  Cloud,
} from 'lucide-react';
import { VillageInfo } from '../types';
import { POPULAR_CITIES_PRESETS } from '../data/allCitiesData';
import { useAuth } from '../context/AuthContext';
import { useCloudData } from '../context/CloudDataContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedVillage: VillageInfo;
  setSelectedVillage: (v: VillageInfo) => void;
  villages: VillageInfo[];
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onSearchCity: (query: string) => void;
  isSearchingCity?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedVillage,
  setSelectedVillage,
  villages,
  soundEnabled,
  setSoundEnabled,
  onSearchCity,
  isSearchingCity = false,
}) => {
  const { user, signInWithGoogle, signOutUser, loading: authLoading } = useAuth();
  const { isCloudConnected, isSyncing } = useCloudData();
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');


  const navItems = [
    { id: 'map', label: 'Crop Intelligence Map', icon: Map, badge: 'Heatmap' },
    { id: 'weather', label: 'Vayunetra Weather AI', icon: Sun, badge: 'Atmospheric' },
    { id: 'hardware', label: 'FarmGuard Hardware', icon: Cpu, badge: 'IoT Sensors' },
    { id: 'marketplace', label: 'Direct Farm Market', icon: ShoppingBag, badge: 'Logistics' },
    { id: 'storage', label: 'Smart Storage Sacs', icon: Warehouse, badge: 'Hubs' },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, badge: 'Predictor' },
    { id: 'radar', label: 'Demand Radar', icon: TrendingUp, badge: 'Signals' },
    { id: 'vault', label: 'Knowledge Vault', icon: BookOpen, badge: 'Wisdom' },
    { id: 'learning', label: 'Learning Engine', icon: GraduationCap, badge: 'Academy' },
    { id: 'mentor', label: 'AI Village Mentor', icon: Bot, badge: 'Gemini AI' },
    { id: 'twin', label: 'Digital Twin Farm', icon: Layers, badge: 'Farm #402' },
    { id: 'gov', label: 'CBSE Pitch & Revenue', icon: Award, badge: 'Score 10/10' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchCity(searchInput.trim());
    }
  };

  const filteredPresets = selectedRegion === 'All'
    ? POPULAR_CITIES_PRESETS
    : POPULAR_CITIES_PRESETS.filter((p) => p.region === selectedRegion);

  return (
    <header className="bg-slate-900 border-b border-emerald-800/40 sticky top-0 z-50 shadow-xl">
      {/* Top Banner Alert Ticker */}
      <div className="bg-emerald-950/90 border-b border-emerald-800/40 px-4 py-1.5 text-xs text-emerald-200 flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
            GEOGRAPHIC INTELLIGENCE
          </span>
          <span className="text-slate-300">
            📍 Active Region: <strong className="text-emerald-300">{selectedVillage.name}, {selectedVillage.district} ({selectedVillage.state})</strong> •
            Water: <strong className="text-cyan-300">{selectedVillage.waterAvailabilityIndex}</strong> •
            Soil: <strong className="text-amber-300">{selectedVillage.soilTypes.join(' & ')}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Cloud Database Sync Status */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-emerald-700/50 rounded-lg px-2 py-0.5 text-[10px] text-emerald-300">
            <Cloud className={`w-3 h-3 text-cyan-400 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span className="font-semibold">{isCloudConnected ? 'Cloud Synced' : 'Offline Cache'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors text-[11px]"
            title={soundEnabled ? 'Mute Speech Assistant' : 'Enable Speech Assistant'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>

          {/* Google Sign-In / Account Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-emerald-800/60 rounded-lg px-2 py-0.5">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="text-[11px] font-medium text-emerald-200 max-w-[100px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOutUser}
                className="text-slate-400 hover:text-red-400 ml-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="bg-white hover:bg-slate-100 text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Branding & City Search Bar Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                FutureFarm <span className="text-emerald-400">OS</span>
              </h1>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" /> All-City Geographic AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Geographic & predictive decision OS available for every city, district & village.
            </p>
          </div>
        </div>

        {/* City & District Search Engine Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex-1 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ANY City or District (e.g. Cuttack, Jaipur, Patna, Indore, Fresno...)"
              className="w-full bg-transparent text-xs font-medium text-slate-100 placeholder-slate-500 outline-none py-1"
            />
            <button
              type="submit"
              disabled={isSearchingCity || !searchInput.trim()}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              {isSearchingCity ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Search</span>
            </button>
          </form>

          {/* Quick Preset City Select Dropdown */}
          <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-2 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedVillage.name}
              onChange={(e) => onSearchCity(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-300 rounded px-2 py-1 outline-none cursor-pointer max-w-[160px] truncate"
            >
              <optgroup label="Popular Regional Cities">
                {POPULAR_CITIES_PRESETS.map((p) => (
                  <option key={p.id} value={p.cityName} className="bg-slate-900 text-slate-200">
                    {p.cityName} ({p.state})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Regional Quick Filters Bar */}
      <div className="bg-slate-950/70 border-t border-slate-800/60 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0 flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" /> Explore Regions:
          </span>
          {['East & Odisha', 'North', 'South', 'West', 'Central', 'Hills', 'Global'].map((reg) => (
            <button
              key={reg}
              onClick={() => {
                setSelectedRegion(reg);
                const firstInReg = POPULAR_CITIES_PRESETS.find((p) => p.region === reg);
                if (firstInReg) onSearchCity(firstInReg.cityName);
              }}
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedVillage.state.includes(reg) || selectedRegion === reg
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

